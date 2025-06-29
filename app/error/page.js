'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ComingSoonPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-cyan-800 to-teal-700 p-6">
      <div className="text-center bg-white shadow-2xl rounded-3xl p-10 max-w-lg w-full border border-gray-200 animate-fade-in">
        
        <img
          src="/error.webp"
          alt="Coming Soon"
          width={500}
          height={300}
          className="mx-auto mb-6"
        />

        <h1 className="text-3xl font-bold text-gray-800 mb-3">This Page is Coming Soon 🚧</h1>
        <p className="text-gray-600 text-base mb-6">
          We're working hard to launch this page. Stay tuned for something amazing!
        </p>

        <button
          onClick={() => router.push('/')}
          className="bg-green-900 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition duration-200 shadow-md"
        >
          Back to Home
        </button>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
