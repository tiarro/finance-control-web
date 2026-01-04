"use client";

import { useActionState } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { login } from "./actions";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, null);

  const fields = [
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "email@anda.com",
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
      title="Masuk"
      description="Kontrol Finansial yang Mudah"
      fields={fields}
      buttonText={isPending ? "Sedang Masuk..." : "Masuk"}
      action={action}
      footerText="Belum punya akun?"
      footerLinkText="Daftar"
      footerLinkHref="/register"
    >
      {state?.error && (
        <div className="text-red-500 text-sm font-medium text-center bg-red-50 dark:bg-red-900/10 p-3 rounded-md border border-red-200 dark:border-red-800">
          {state.error}
        </div>
      )}
    </AuthForm>
  );
}
