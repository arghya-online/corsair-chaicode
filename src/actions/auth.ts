"use server";

import prisma from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";

const JWT_SECRET = process.env.JWT_SECRET || "zentra_auth_secret_key_987654";
const COOKIE_NAME = "zentra_session";

export async function signUpAction(formData: any) {
  try {
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      return { success: false, error: "All fields are required" };
    }
    const userExists = await prisma.user.findUnique({
      where: { email }
    });
    if (userExists) {
      return { success: false, error: "User already exists with this email" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Registration error" };
  }
}

export async function signInAction(formData: any) {
  try {
    const { email, password } = formData;
    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user || !user.password) {
      return { success: false, error: "Invalid credentials" };
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return { success: false, error: "Invalid credentials" };
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Login error" };
  }
}

export async function signOutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    revalidatePath("/");
  } catch (error: any) {
    console.error(error);
  }
}

import { cache } from "react";

const getCachedUser = cache(async () => {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  // 1. Try to find the user in the database locally first
  let user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true
    }
  });

  // 2. Only if the user is not found, fetch registration details from Clerk API
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return null;
    }
    
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      return null;
    }
    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "User";

    // Check if user exists by email first (for native signups or seeded accounts migrating to Clerk)
    const existingByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingByEmail) {
      // Migrate the existing user record's ID to match their Clerk ID
      user = await prisma.user.update({
        where: { email },
        data: { id: clerkUser.id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true
        }
      });
    } else {
      user = await prisma.user.create({
        data: {
          id: clerkUser.id,
          email,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true
        }
      });
    }
  }

  return user;
});

export async function getCurrentUser() {
  try {
    return await getCachedUser();
  } catch (error: any) {
    // Rethrow Next.js dynamic rendering errors so the build system marks the route as dynamic on demand
    if (
      error instanceof Error &&
      (error.message.includes("Dynamic server usage") ||
        (error as any).digest === "DYNAMIC_SERVER_USAGE" ||
        (error as any).code === "DYNAMIC_SERVER_USAGE")
    ) {
      throw error;
    }
    console.error("Clerk session resolution error in getCurrentUser:", error);
    return null;
  }
}

export async function updateUsernameAction(name: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // 1. Update in the local database
    await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    // 2. Update in Clerk if possible
    try {
      const client = await clerkClient();
      const parts = name.trim().split(/\s+/);
      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || "";
      await client.users.updateUser(userId, {
        firstName,
        lastName,
      });
    } catch (clerkErr) {
      console.error("Failed to update user name in Clerk:", clerkErr);
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");

    return { success: true };
  } catch (error: any) {
    console.error("Error updating username:", error);
    return { success: false, error: error.message || "Failed to update username" };
  }
}
