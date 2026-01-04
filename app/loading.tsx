export default function Loading() {
  // You can add any loading UI here
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat...</p>
      </div>
    </div>
  );
}