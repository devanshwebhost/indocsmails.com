'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    agree: false,
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.firstName || !form.agree) {
      setMsg('❗ Required fields missing or terms not agreed.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMsg('✅ Please verify your email before logging in.');
      router.push('/verify-notice');
    } else {
      setMsg(data.error || '❌ Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 to-cyan-800 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-gray-300 shadow-2xl rounded-2xl p-8 sm:p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">Create Your Account</h2>
        <p className="text-sm text-center text-gray-500 mb-4">Welcome to <span className="font-semibold text-[#0c52a2]">Indocs Mails</span></p>

        {msg && (
          <p className="text-center text-sm font-medium text-blue-700 mb-4 animate-fade-in">
            {msg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="firstName"
            placeholder="First Name *"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 transition"
          />
          <input
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 transition"
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address *"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 transition"
          />
          <input
            name="password"
            type="password"
            placeholder="Password *"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 transition"
          />
          <input
            name="phone"
            placeholder="Phone (optional)"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 transition"
          />
          <input
            name="address"
            placeholder="Address (optional)"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 transition"
          />

          <label className="flex items-center text-sm text-gray-600 mt-2">
            <input
              type="checkbox"
              name="agree"
              onChange={handleChange}
              className="mr-2 accent-cyan-600"
            />
            I agree to the <span className="text-cyan-700 ml-1 underline cursor-pointer">terms and conditions *</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition text-white rounded-xl font-semibold shadow-lg disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
