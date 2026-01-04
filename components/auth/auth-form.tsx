import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          HematKuy
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{description}</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8">
        <form onSubmit={onSubmit} action={action} className="space-y-6">
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.id}>
                <Label
                  htmlFor={field.id}
                  className="text-gray-700 dark:text-gray-300"
                >
                  {field.label}
                </Label>
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="mt-1 h-12 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                  required
                />
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
          © {new Date().getFullYear()} HematKuy. Hak cipta dilindungi.
        </p>
      </div>
    </div>
  );
}
