import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface AuthFormProps {
  title: string;
  description: string;
  fields: Array<{
    id: string;
    label: string;
    type: string;
    placeholder: string;
  }>;
  buttonText: string;
  onSubmit?: (e: React.FormEvent) => void;
  action?: (payload: FormData) => void;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  children?: React.ReactNode;
}

export function AuthForm({
  title,
  description,
  fields,
  buttonText,
  onSubmit,
  footerText,
  footerLinkText,
  footerLinkHref,
  children,
  action,
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">HematKuy</h1>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>

      <div className="bg-whiterounded-xl shadow-lg border px-10 py-14 rounded-xl">
        <form onSubmit={onSubmit} action={action} className="space-y-6">
          <div className="space-y-4">
            {fields.map((field) => (
              <div className="space-y-3" key={field.id}>
                <Label htmlFor={field.id} className="text-gray-700">
                  {field.label}
                </Label>
                <div className="relative">
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type === "password" && showPassword ? "text" : field.type}
                    placeholder={field.placeholder}
                    className="mt-1 h-12 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 pr-12"
                    required
                  />
                  {field.type === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {children}
          </div>

          <Button type="submit" className="w-full h-12">
            {buttonText}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {footerText}{" "}
            <a
              href={footerLinkHref}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {footerLinkText}
            </a>
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 dark:text-gray-500 text-sm">
          © {new Date().getFullYear()} HematKuy by Tiarro Elprida Tamba.
        </p>
      </div>
    </div>
  );
}
