"use server";

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTodos() {
  try {
    return await prisma.todo.findMany({
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
    const todo = await prisma.todo.create({
      data: {
        text,
        completed: false,
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
