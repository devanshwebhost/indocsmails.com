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
    <div className="min-h-screen bg-gradient-to-br from-teal-700 to-cyan-800 flex flex-col items-center justify-center text-white px-4 py-10">
      <div className="max-w-5xl w-full bg-white text-gray-800 shadow-2xl rounded-3xl p-8 transform transition duration-300 ">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center gap-4">
            {/* Using a placeholder image for the logo */}
            <img
              src="https://placehold.co/48x48/0F4C4C/FFFFFF?text=IM"
              alt="Indocs Mails Logo"
              className="h-12 w-12 rounded-full shadow-lg border-2 border-teal-500"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/48x48/E2E8F0/64748B?text=Logo"; e.target.alt="Logo failed to load"; }}
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {user?.firstName || "Developer"} 🎉
              </h1>
              <p className="text-sm text-gray-600 mt-1">Your email: {user?.email || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area: API Key, API Usage, and Developer Feedback */}
        <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
          {/* Left Column: API Key and API Usage Instructions */}
          <div className="flex flex-col lg:w-2/3 space-y-8">
            {/* API Key Section */}
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 shadow-inner">
              <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a3 3 0 016 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path></svg>
                Your API Key
              </h2>
              <div className="bg-gray-100 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between mt-2 space-y-3 sm:space-y-0 sm:space-x-4">
                <code className="font-mono text-base text-gray-700 truncate break-all w-full sm:w-auto flex-grow px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                  {showKey ? apiKey : "****************************************"}
                </code>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="flex-1 sm:flex-none text-blue-700 text-sm font-medium hover:underline px-4 py-2 rounded-lg transition duration-200 hover:bg-blue-100"
                  >
                    {showKey ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={handleCopyApiKey}
                    className="flex-1 sm:flex-none text-sm bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path></svg>
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* API Usage Instructions */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-inner">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.638.162l4 2.5a1 1 0 010 1.676l-4 2.5a1 1 0 01-1.3-.162l-4-2.5a1 1 0 010-1.676l4-2.5a1 1 0 01.638-.162zM4.316 9.051a1 1 0 01.638.162l4 2.5a1 1 0 010 1.676l-4 2.5a1 1 0 01-1.3-.162l-4-2.5a1 1 0 010-1.676l4-2.5a1 1 0 01.638-.162z" clipRule="evenodd"></path></svg>
                About This API
              </h2>

              <div className="leading-relaxed space-y-4 text-gray-700 text-sm">
                <p className="flex items-start">
                  <span className="mr-2 mt-0.5 text-blue-600 font-bold">1.</span>
                  <span className="font-medium">
                    Want to know more about indocs mails and AI integration? Read our summaries blogs
                    <a
                      href="/Blogs"
                      className="text-blue-600 underline hover:text-blue-800 ml-1 font-semibold"
                    >
                      Our latest blogs
                    </a>
                    .
                  </span>
                </p>

                <p className="flex items-start">
                  <span className="mr-2 mt-0.5 text-blue-600 font-bold">2.</span>
                  <span className="font-medium">
                    Make a <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs font-mono">POST</code> request to the API endpoint:
                  </span>
                </p>
                <code className="block bg-white p-3 rounded-md font-mono text-blue-700 break-all border border-gray-200 shadow-sm">
                  https://indocsmails.onrender.com/send-email
                </code>

                <p className="flex items-start">
                  <span className="mr-2 mt-0.5 text-blue-600 font-bold">3.</span>
                  <span className="font-medium">
                    Include your API key in the request header:
                  </span>
                </p>
                <code className="block bg-white p-3 rounded-md font-mono text-green-700 break-all border border-gray-200 shadow-sm">
                  x-api-key: <span className="text-gray-600">{"<YOUR_API_KEY_HERE>"}</span>
                </code>

                <p className="flex items-start">
                  <span className="mr-2 mt-0.5 text-blue-600 font-bold">4.</span>
                  <span className="font-medium">
                    Send the form data as <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs font-mono">multipart/form-data</code>. The fields will dynamically match what you configured in the Control Panel. Common fields include:
                  </span>
                </p>
                <ul className="list-disc ml-8 text-gray-600 space-y-1">
                  <li><code className="font-mono">name</code> (e.g., "John Doe")</li>
                  <li><code className="font-mono">email</code> (e.g., "john.doe@example.com")</li>
                  <li><code className="font-mono">message</code> (your message content)</li>
                  <li><code className="font-mono">logo</code> (optional file upload)</li>
                  {/* Other dynamically configured fields will also be expected */}
                </ul>
                <p className="font-medium mt-4">
                  Upon successful submission, an email will be sent as configured in your Control Panel.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Developer Feedback Section */}
          <div className="flex flex-col lg:w-1/3 space-y-8">
            <div className="p-6 bg-purple-50 rounded-2xl border border-purple-200 shadow-inner">
              <Feedback/>              
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <form action="/api/auth/signout" method="post" className="mt-8 flex justify-center mb-2">
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
