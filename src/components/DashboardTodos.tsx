"use client";

import React, { useState } from "react";
import { addTodoAction, toggleTodoAction, deleteTodoAction } from "@/src/actions/todos";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date | string;
}

interface Props {
  initialTodos: Todo[];
}

export default function DashboardTodos({ initialTodos }: Props) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const tempId = Date.now().toString();
    const tempTodo: Todo = {
      id: tempId,
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTodos((prev) => [tempTodo, ...prev]);
    const originalInput = inputValue;
    setInputValue("");
    setLoading(true);

    const res = await addTodoAction(originalInput.trim());
    setLoading(false);

    if (!res.success) {
      setTodos((prev) => prev.filter((t) => t.id !== tempId));
      alert("Failed to save todo to PostgreSQL database.");
    } else {
      setTodos((prev) =>
        prev.map((t) => (t.id === tempId ? (res.todo as unknown as Todo) : t))
      );
    }
  };

  const handleToggle = async (id: string, currentCompleted: boolean) => {
    const nextCompleted = !currentCompleted;

    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t))
    );

    const res = await toggleTodoAction(id, nextCompleted);
    if (!res.success) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: currentCompleted } : t))
      );
      alert("Failed to update task in database.");
    }
  };

  const handleDelete = async (id: string) => {
    const previousTodos = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));

    const res = await deleteTodoAction(id);
    if (!res.success) {
      setTodos(previousTodos);
      alert("Failed to delete task from database.");
    }
  };

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div className="space-y-8 select-none">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          placeholder="Type a new task and press enter..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-[#FAFAFA] border border-[#E8E8EC] rounded-xl px-4 py-3 text-sm text-[#0D0D0D] focus:outline-none focus:border-[#1B4FD8] focus:ring-1 focus:ring-[#1B4FD8] placeholder-[#6B7280]/40 transition-colors"
        />
        <button
          type="submit"
          className="bg-[#1B4FD8] text-white px-6 rounded-xl text-xs font-semibold hover:bg-[#1844C0] transition-colors uppercase cursor-pointer"
        >
          Add
        </button>
      </form>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-xs text-[#6B7280] uppercase tracking-wider font-mono font-bold">
            Active Tasks ({activeTodos.length})
          </h3>
          {activeTodos.length === 0 ? (
            <p className="text-xs text-[#6B7280] italic py-2">
              No active tasks found in database.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {activeTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between bg-[#FAFAFA] border border-[#E8E8EC] hover:border-[#1B4FD8]/40 p-4 rounded-xl group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggle(todo.id, todo.completed)}
                      className="w-4 h-4 border border-[#E8E8EC] rounded bg-white flex items-center justify-center hover:border-[#1B4FD8] transition-colors cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-sm bg-transparent group-hover:bg-[#6B7280] transition-colors" />
                    </button>
                    <span className="text-xs font-medium text-[#0D0D0D] transition-colors">
                      {todo.text}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(todo.id)}
                    className="text-xs text-[#6B7280]/60 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {completedTodos.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs text-[#6B7280]/60 uppercase tracking-wider font-mono font-bold">
              Completed ({completedTodos.length})
            </h3>
            <ul className="flex flex-col gap-2 opacity-60">
              {completedTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between bg-[#FAFAFA] border border-[#E8E8EC] p-4 rounded-xl group"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggle(todo.id, todo.completed)}
                      className="w-4 h-4 border border-[#1B4FD8] rounded bg-[#1B4FD8] flex items-center justify-center cursor-pointer"
                    >
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <span className="text-xs text-[#6B7280] line-through">
                      {todo.text}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(todo.id)}
                    className="text-xs text-[#6B7280]/60 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

