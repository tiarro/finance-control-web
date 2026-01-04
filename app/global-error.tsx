"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="id">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Terjadi Kesalahan</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Maaf, terjadi kesalahan tak terduga.
            </p>
            <button
              onClick={() => reset()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}