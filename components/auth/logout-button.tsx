"use client";

import { logout } from "@/app/(auth)/logout/actions";

export function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="text-gray-600 dark:text-gray-300 hover:text-red-600 font-medium transition-colors"
    >
      Keluar
    </button>
  );
}
