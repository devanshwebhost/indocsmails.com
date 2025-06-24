'use client';
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    ownerEmail: '',
    appPassword: '',
    adminEmail: '',
    replyMessage: '',
  });
  const [logo, setLogo] = useState(null);
  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('ownerEmail', formData.ownerEmail);
    form.append('appPassword', formData.appPassword);
    form.append('adminEmail', formData.adminEmail);
    form.append('replyMessage', formData.replyMessage);
    if (logo) form.append('logo', logo);

    try {
      const res = await fetch('https://indocsmails.onrender.com/config', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      if (data.success) {
        setResponseMsg('✅ Config saved successfully!');
      } else {
        setResponseMsg('❌ Failed to save config.');
      }
    } catch (err) {
      setResponseMsg('❌ Server error.');
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-[#0c52a2]">Email API Control Panel</h2>

        <input
          type="email"
          name="ownerEmail"
          placeholder="Owner Email (EMAIL_USER)"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="appPassword"
          placeholder="App Password (EMAIL_PASS)"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="adminEmail"
          placeholder="Admin Receiver Email"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <textarea
          name="replyMessage"
          placeholder="Auto Reply Message"
          rows="4"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        ></textarea>

        <label className="block text-sm">Upload Logo (optional):</label>
        <input
          type="file"
          accept="image/*"
          className="w-full p-2 border rounded"
          onChange={handleLogoChange}
        />

        <button
          type="submit"
          className="w-full bg-[#0c52a2] text-white py-2 rounded hover:bg-[#083d7a]"
        >
          Save Configuration
        </button>

        {responseMsg && (
          <p className="text-center mt-2 font-medium">{responseMsg}</p>
        )}
      </form>
    </main>
  );
}
