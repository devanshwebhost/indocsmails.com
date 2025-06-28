'use client';
import React, { useState } from 'react';
// Removed react-icons/fa import to resolve compilation errors
import { toast } from 'react-toastify'; // Assuming toast is available for notifications

export default function ControlPanelClient({ user }) {
  const [formData, setFormData] = useState({
    ownerEmail: '',
    appPassword: '',
    adminEmail: '',
    replyMessage: '',
  });

  const [logo, setLogo] = useState(null);
  const [responseMsg, setResponseMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Custom field builder state
  const [customFields, setCustomFields] = useState([]);
  const [newField, setNewField] = useState({
    type: 'text',
    label: '',
    name: '',
    required: false,
  });

  const fieldTypes = ['text', 'email', 'phone', 'file', 'textarea'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewField(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addField = () => {
    if (!newField.label || !newField.name) return alert('Label and Name required');
    setCustomFields(prev => [...prev, newField]);
    setNewField({ type: 'text', label: '', name: '', required: false });
  };

  const removeField = (index) => {
    setCustomFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setResponseMsg('');

  const form = new FormData();
  form.append('ownerEmail', formData.ownerEmail);
  form.append('appPassword', formData.appPassword);
  form.append('adminEmail', formData.adminEmail);
  form.append('replyMessage', formData.replyMessage);
  form.append('fields', JSON.stringify(customFields));
  if (logo) form.append('logo', logo);

  // ✅ Replace this with however you get user data
  const apiKey = user?.apiKey; // or from session/state/props

  if (!apiKey) {
    setResponseMsg('❌ API key not found. Please login again.');
    setLoading(false);
    return;
  }

  console.log('📦 Sending form data:', [...form.entries()]);

  try {
    const res = await fetch('https://indocsmails.onrender.com/config', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey, // ✅ Add API key to headers
      },
      body: form,
    });

    const data = await res.json();
    console.log('📩 Response:', data);

    if (data.success) {
      setResponseMsg('✅ Configuration saved!');
      toast.success("Configuration saved successfully! 🎉");
    } else {
      setResponseMsg(`❌ Failed to save config: ${data.error || 'Unknown error'}`);
    }
  } catch (err) {
    console.error('❌ Network/Server Error:', err);
    setResponseMsg('❌ Server error');
  } finally {
    setLoading(false);
  }
};
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 space-y-7 animate-fade-in border border-gray-200"
      >
        <h1 className="text-2xl font-extrabold text-center text-blue-700 tracking-wide mb-6 pb-4 border-b-4 border-blue-300 transform transition duration-300 hover:scale-105">
          Indocs Mail Control Panel ⚙️
        </h1>

        {/* Basic Config */}
        <section className="grid gap-5">
          <input
            type="email"
            name="ownerEmail"
            placeholder="Owner Gmail"
            className="input-field"
            onChange={handleChange}
            required
            value={formData.ownerEmail} // Controlled component
          />
          <input
            type="password"
            name="appPassword"
            placeholder="App Password"
            className="input-field"
            onChange={handleChange}
            required
            value={formData.appPassword} // Controlled component
          />
          <input
            type="email"
            name="adminEmail"
            placeholder="Receiver Email"
            className="input-field"
            onChange={handleChange}
            required
            value={formData.adminEmail} // Controlled component
          />
          <textarea
            name="replyMessage"
            placeholder="Auto Reply Message"
            rows={3}
            className="input-field resize-none"
            onChange={handleChange}
            value={formData.replyMessage} // Controlled component
          />
        </section>

        {/* Logo Upload */}
        <section className="border-t border-gray-200 pt-7">
          <label className="block text-base font-semibold mb-3 text-gray-700">Upload Logo (optional):</label>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition duration-200 ease-in-out"
            onChange={handleLogoChange}
          />
          {logo && <p className="text-xs text-gray-500 mt-2">Selected: {logo.name}</p>}
        </section>

        {/* Custom Fields */}
        <section className="border-t border-gray-200 pt-7">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
            {/* Replaced FaPlus with inline SVG */}
            <svg className="w-6 h-6 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
            Custom Form Fields
          </h2>

          <div className="grid md:grid-cols-2 gap-4 items-end mb-4">
            <input
              type="text"
              name="label"
              placeholder="Field Label"
              className="input-field"
              value={newField.label}
              onChange={handleNewFieldChange}
            />
            <input
              type="text"
              name="name"
              placeholder="Field Name (unique)"
              className="input-field"
              value={newField.name}
              onChange={handleNewFieldChange}
            />
            <select
              name="type"
              className="input-field p-3"
              value={newField.type}
              onChange={handleNewFieldChange}
            >
              {fieldTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="required"
                checked={newField.required}
                onChange={handleNewFieldChange}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 transition duration-150 ease-in-out"
              />
              <span className="text-base font-medium">Required</span>
            </label>
          </div>

          <button
            type="button"
            onClick={addField}
            className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            {/* Replaced FaPlus with inline SVG */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
            <span>Add Field</span>
          </button>

          {/* Field List */}
          {customFields.length > 0 && (
            <ul className="mt-6 space-y-3">
              {customFields.map((field, index) => (
                <li
                  key={index}
                  className="p-4 bg-blue-50 rounded-xl shadow-sm flex justify-between items-center border border-blue-200"
                >
                  <span className="text-gray-800 font-medium text-base">
                    <strong>{field.label}</strong> (<span className="text-blue-600">{field.type}</span>)
                    {field.required && <span className="text-red-600 ml-2 font-bold">REQUIRED</span>}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="text-red-500 hover:text-red-700 transition duration-200 ease-in-out transform hover:scale-110 p-2 rounded-full hover:bg-red-100"
                    title="Remove Field"
                  >
                    {/* Replaced FaTrash with inline SVG */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full font-semibold py-3 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 ${
            loading
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving Configuration...</span>
            </>
          ) : (
            <>
              {/* Replaced FaCheckCircle with inline SVG */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              <span>Save Configuration</span>
            </>
          )}
        </button>

        {/* Feedback */}
        {responseMsg && (
          <div className={`text-center text-base font-medium mt-4 p-3 rounded-lg ${
            responseMsg.startsWith("✅") ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {responseMsg}
          </div>
        )}
      </form>
      <style>{`
        .input-field {
          @apply w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base shadow-sm transition duration-200 ease-in-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </main>
  );
}
