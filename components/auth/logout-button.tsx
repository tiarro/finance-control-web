"use client";

import { logout } from "@/app/(auth)/logout/actions";
import { ArrowRightIcon } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="flex items-center text-[0.9rem] gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
    >
      <ArrowRightIcon width={20} height={20} />
      Keluar
    </button>
  );
}
