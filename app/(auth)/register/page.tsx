"use client";

import { useActionState } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { signup } from "./actions";

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(signup, null);

  const fields = [
    {
      id: "name",
      label: "Nama Lengkap",
      type: "text",
      placeholder: "Nama Anda",
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "masukkan email anda",
    },
    {
      id: "password",
      label: "Kata Sandi",
      type: "password",
      placeholder: "masukkan kata sandi anda",
    },
  ];

  return (
    <AuthForm
      title="Daftar"
      description="Daftar untuk mulai menghemat"
      fields={fields}
      buttonText={isPending ? "Sedang Mendaftar..." : "Daftar"}
      action={action}
      footerText="Sudah punya akun?"
      footerLinkText="Masuk"
      footerLinkHref="/login"
    >
      {state?.error && (
        <div className="text-red-500 text-sm font-medium text-center bg-red-50 dark:bg-red-900/10 p-3 rounded-md border border-red-200 dark:border-red-800">
          {state.error}
        </div>
      )}
    </AuthForm>
  );
}
