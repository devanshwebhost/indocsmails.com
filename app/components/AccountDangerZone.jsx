'use client';

import React, { useState } from 'react';
import DeleteAccountSection from './DeleteAccountSection';
import { signOut } from "next-auth/react";

export default function AccountDangerZone({ user }) {
  const [showZone, setShowZone] = useState(false);

  return (
    <div className="mt-10">
      {/* Toggle Button */}
      <div className="text-center">
        <button
          onClick={() => setShowZone((prev) => !prev)}
          className="px-5 py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition duration-200"
        >
          {showZone ? 'Hide Danger Zone 🚫' : 'Show Danger Zone ⚠️'}
        </button>
      </div>

      {/* Hidden Content */}
      {showZone && (
        <div className="mt-6 border border-red-500 bg-red-50 bg-opacity-5 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-red-400 mb-4 text-center">
            🔓 Logout / Danger Zone
          </h2>

          {/* Logout Button */}
          <div className="flex justify-center">
      <button
        type="button"
        onClick={() =>
          signOut({
            callbackUrl: '/goodbye', // 🔁 Redirect after logout
          })
        }
        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold shadow-md hover:bg-red-700 transition duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
          />
        </svg>
        Logout
      </button>
    </div>

          {/* Delete Section */}
          <div className="mt-8">
            <DeleteAccountSection user={user} />
          </div>
        </div>
      )}
    </div>
  );
}
