import Link from "next/link";

// app/goodbye/page.jsx
export default function Goodbye() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 to-cyan-800 text-white text-center p-6">
      <div className="bg-white/10 p-8 rounded-2xl shadow-2xl max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-4">You have been logged out 👋</h1>
        <p className="text-sm text-gray-200 mb-6">
          Thank you for using Indocs Mails. See you soon!
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-white text-teal-800 font-semibold rounded-xl hover:bg-gray-100 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
