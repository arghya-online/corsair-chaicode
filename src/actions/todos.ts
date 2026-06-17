"use server";

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/src/actions/auth";

export async function getTodos() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return [];
    }

    return await prisma.todo.findMany({
      where: { userId: user.id },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    return [];
  }
}

export async function addTodoAction(text: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const todo = await prisma.todo.create({
      data: {
        text,
        completed: false,
        userId: user.id,
      },
    });
    revalidatePath("/");
    return { success: true, todo };
  } catch (error) {
    console.error("Failed to add todo:", error);
    return { success: false, error: "Database error" };
  }
}

export async function toggleTodoAction(id: string, completed: boolean) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const existing = await prisma.todo.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return { success: false, error: "Todo not found or unauthorized" };
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: { completed },
    });
    revalidatePath("/");
    return { success: true, todo };
  } catch (error) {
    console.error("Failed to toggle todo:", error);
    return { success: false, error: "Database error" };
  }
}

export async function deleteTodoAction(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const existing = await prisma.todo.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return { success: false, error: "Todo not found or unauthorized" };
    }

    await prisma.todo.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete todo:", error);
    return { success: false, error: "Database error" };
  }
}
