'use client';

import React, { useState } from 'react';

export default function DeleteAccountSection({ user }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState('');

  const handleDelete = async () => {
    try {
      const res = await fetch('/api/delete-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });

      if (res.ok) {
        setStatus('✅ Account deleted successfully.');
        window.location.href = '/';
      } else {
        const err = await res.json();
        setStatus(`❌ ${err.error || 'Failed to delete account'}`);
      }
    } catch (error) {
      setStatus('❌ Error deleting account');
    }
  };

  return (
    <>
  <h3 className="text-lg font-semibold text-red-400">⚠️ Danger Zone</h3>

  <p className="text-sm text-red-300 mt-2">
    Once you delete your account, <strong className="text-red-100">all your data, access tokens, APIs, and connected forms will be permanently removed</strong>.
    <br />
    <span className="font-semibold">This action cannot be undone. You won’t be able to log in again unless you register as a new user.</span>
  </p>

  {!showConfirm ? (
    <button
      onClick={() => setShowConfirm(true)}
      className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
    >
      Delete My Account
    </button>
  ) : (
    <>
      <p className="text-sm text-red-200 mt-4">
        Are you sure you want to delete your account <strong>({user.email})</strong>?
      </p>
      <div className="mt-3 space-x-4">
        <button
          onClick={handleDelete}
          className="px-6 py-2 bg-red-700 hover:bg-red-800 rounded-lg font-semibold"
        >
          Confirm Delete
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg font-semibold"
        >
          Cancel
        </button>
      </div>
      {status && <p className="text-sm text-yellow-200 mt-3">{status}</p>}
    </>
  )}
</>

  );
}
