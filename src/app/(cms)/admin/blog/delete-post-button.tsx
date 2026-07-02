"use client";

import { Trash2Icon } from "lucide-react";
import { deletePost } from "./actions";

export function DeletePostButton({ id }: { id: string }) {
  return (
    <form
      action={deletePost}
      onSubmit={(e) => {
        if (!window.confirm("Hapus artikel ini secara permanen?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label="Hapus artikel"
        title="Hapus"
        className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-sume-line text-sume-muted transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2Icon className="size-3.5" />
      </button>
    </form>
  );
}
