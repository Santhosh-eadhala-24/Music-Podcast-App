import Link from "next/link";

export default function About() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">About</h1>
      <Link href="/" className="mt-2 inline-block text-blue-500 underline">
        Back to Home
      </Link>
    </div>
  );
}