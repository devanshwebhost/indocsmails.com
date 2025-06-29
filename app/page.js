'use client';

// removed import { useRouter } from 'next/navigation'; to resolve compilation error
import React, { useState, useEffect } from 'react';

export default function StartPage() {
  // const router = useRouter(); // removed useRouter hook

  const [showSplash, setShowSplash] = useState(true); // State to control splash screen visibility

  useEffect(() => {
    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []); // Run once on component mount

  // Function to handle navigation without Next.js router
  const handleNavigation = (path) => {
    window.location.href = path;
  };

  if (showSplash) {
    return (
      // Splash Screen JSX
      <div className="min-h-screen bg-gradient-to-br from-teal-700 to-cyan-800 flex flex-col items-center justify-center text-white text-center animate-fade-in-splash">
        {/* Indocs Media Logo (placeholder) */}
        <img
          src="/logo.webp"
          alt="Indocs Media Logo"
          className="h-32 w-32 rounded-full mb-6 shadow-lg animate-zoom-in"
        />
        <h1 className="text-5xl font-extrabold tracking-wider animate-pulse">
          Indocs Mails
        </h1>
        <p className="mt-4 text-xl animate-fade-in-text">Loading...</p>
        <style>{`
          @keyframes fade-in-splash {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes zoom-in {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes fade-in-text {
            0% { opacity: 0; }
            50% { opacity: 0; }
            100% { opacity: 1; }
          }
          .animate-fade-in-splash { animation: fade-in-splash 1s ease-out forwards; }
          .animate-zoom-in { animation: zoom-in 1s ease-out forwards; }
          .animate-pulse { animation: pulse 2s infinite; }
          .animate-fade-in-text { animation: fade-in-text 2s ease-out forwards; }
        `}</style>
      </div>
    );
  }

  // Main StartPage Content (rendered after splash screen)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 to-blue-100">
      <div className="text-center p-6 max-w-xl bg-white shadow-2xl rounded-3xl border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Indocs Mails 📬</h1>
        <p className="text-gray-600 text-lg mb-6">A simple and secure authentication system <br/> Powered by <a href="https://indocsmedia.onrender.com" className="text-blue-500" target="_blank" rel="noopener noreferrer">Indocs Media</a></p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handleNavigation('/login')} // Using handleNavigation instead of router.push
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg transition shadow-md"
          >
            Login
          </button>
          <button
            onClick={() => handleNavigation('/signup')} // Using handleNavigation instead of router.push
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl text-lg transition shadow-md"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
