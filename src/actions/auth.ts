"use server";

import prisma from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

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
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }
  
  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    return null;
  }
  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "User";

  let user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true
    }
  });

  if (!user) {
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

  return user;
});

export async function getCurrentUser() {
  try {
    return await getCachedUser();
  } catch (error) {
    console.error("Clerk session resolution error in getCurrentUser:", error);
    return null;
  }
}
