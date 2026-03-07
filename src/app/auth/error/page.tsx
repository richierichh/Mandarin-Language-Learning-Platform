export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-red-600">Auth error</h1>
        <p className="mt-2 text-neutral-600">
          {message ?? "Something went wrong signing you in."}
        </p>
        <a href="/" className="mt-4 inline-block text-blue-600 underline">
          Back to home
        </a>
      </div>
    </div>
  );
}
