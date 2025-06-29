"use client";
import React, { useState } from "react";
// Removed Link from next/link to ensure broader React compatibility in Canvas
import { toast } from 'react-toastify'; // Assuming toast is available for notifications
import { Feedback } from "./Feedback";

export default function Dashboard({ user }) {
  const [showKey, setShowKey] = useState(false);
  // const [feedbackText, setFeedbackText] = useState('');
  // const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  // const [feedbackResponse, setFeedbackResponse] = useState(null);

  // Safely access apiKey, providing a default if user or apiKey is undefined
  const apiKey = user?.apiKey || "API_KEY_NOT_AVAILABLE";

  const handleCopyApiKey = () => {
    // Using document.execCommand('copy') for clipboard functionality due to iframe restrictions
    // navigator.clipboard.writeText is preferred but might not work in all iframe contexts
    const tempInput = document.createElement('textarea');
    tempInput.value = apiKey;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      toast.success('API Key copied! ✅');
    } catch (err) {
      console.error('Failed to copy API Key:', err);
      toast.error('Failed to copy API Key! ❌');
    }
    document.body.removeChild(tempInput);
  };

  // const handleLogout = () => {
  //   // In a real application, this would trigger an actual logout process (e.g., clearing auth tokens, redirecting)
  //   // For this demonstration, we'll just show a toast.
  //   toast.info('Logging out... 👋');
  //   // Simulate logout action, e.g., redirect to login page or clear user state
  //   setTimeout(() => {
  //       // Example: if you have a way to set user to null or redirect
  //       // setUser(null);
  //       window.location.href = '/login'; // Or similar redirect
  //       toast.success('Successfully logged out! See you soon! 🚀');
  //   }, 1000);
  // };



  return (
    <div className=" w-full min-h-screen bg-gradient-to-br from-teal-700 to-cyan-800 flex flex-col items-center justify-center text-white mb:px-4 px-0 mb:py-10">
  <div className="bg-white text-gray-800 shadow-2xl rounded-3xl p-6 sm:p-8 w-full max-w-7xl mx-auto transition duration-300 transform">
    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-6 sm:space-y-0 sm:space-x-4">
      <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
        <img
          src="/logo.webp"
          alt="Indocs Mails Logo"
          className="h-12 w-12 rounded-full shadow-lg border-2 border-teal-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/48x48/E2E8F0/64748B?text=Logo";
            e.target.alt = "Logo failed to load";
          }}
        />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
            Welcome, {user?.firstName || "Developer"} 🎉
          </h1>
          <p className="text-sm text-gray-600 mt-1 text-center sm:text-left">
            Your email: {user?.email || "N/A"}
          </p>
        </div>
      </div>
    </div>

    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Column */}
      <div className="flex flex-col lg:w-2/3 gap-6">
        {/* API Key */}
        <div className="p-5 sm:p-6 bg-blue-50 rounded-2xl border border-blue-200 shadow-inner w-full">
          <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 flex items-center">
        
           🔑 Your API Key
          </h2>
          <div className="bg-gray-100 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <code className="font-mono text-[10px] sm:text-base text-gray-700 w-full break-all bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
              {showKey ? apiKey : "****************************************"}
            </code>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button onClick={() => setShowKey(!showKey)} className="text-green-700 text-sm font-medium hover:underline px-4 py-2 rounded-lg hover:bg-blue-100">
                {showKey ? "Hide" : "Show"}
              </button>
              <button
                onClick={handleCopyApiKey}
                className="text-sm bg-gradient-to-tr from-cyan-800 to-teal-700 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md flex items-center justify-center gap-2"
              >
                🔐Copy
              </button>
            </div>
          </div>
        </div>

        {/* API Usage */}
        <div className="p-5 sm:p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-inner w-full">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="..." clipRule="evenodd" />
            </svg>
            About This API🗝️
          </h2>
          <div className="leading-relaxed space-y-4 text-gray-700 text-sm">
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-bold">1.</span>
              <span>
                Want to know more? Visit
                <a href="/blogs" className="text-green-600 underline hover:text-blue-800 ml-1 font-semibold">Our latest blogs</a>.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-bold">2.</span>
              <span>Make a <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">POST</code> request to:</span>
            </p>
            <code className="block bg-white p-3 rounded-md font-mono text-green-700 break-all border border-gray-200 shadow-sm">
              https://indocsmails.onrender.com/send-email
            </code>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-bold">3.</span>
              <span>Include header: <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">x-api-key</code></span>
            </p>
            <code className="block bg-white p-3 rounded-md font-mono text-green-700 break-all border border-gray-200 shadow-sm">
              x-api-key: {"<YOUR_API_KEY_HERE>"}
            </code>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-bold">4.</span>
              <span>Send form as <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">multipart/form-data</code> with fields:</span>
            </p>
            <ul className="list-disc ml-8 text-gray-600 space-y-1">
              <li><code className="font-mono">name</code></li>
              <li><code className="font-mono">email</code></li>
              <li><code className="font-mono">message</code></li>
              <li><code className="font-mono">logo</code></li>
            </ul>
            <p className="mt-2 font-medium">Emails will be delivered as per your config.</p>
          </div>
        </div>
      </div>

      {/* Right Column: Feedback */}
      <div className="flex flex-col lg:w-1/3 w-full">
        <div className="p-6 bg-purple-50 rounded-2xl border border-purple-200 shadow-inner w-full">
          <Feedback />
        </div>
      </div>
    </div>

    {/* Logout Button */}
    <form action="/api/auth/signout" method="post" className="mt-10 flex justify-center">
      <button
        type="submit"
        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold shadow-md hover:bg-red-700 transition duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
        </svg>
        Logout
      </button>
    </form>
  </div>
</div>

  );
}
