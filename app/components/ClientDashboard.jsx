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

    // Debug log
    console.log('📦 Sending form data:', [...form.entries()]);

    try {
      const res = await fetch('https://indocsmails.onrender.com/config', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      console.log('📩 Response:', data);

      if (data.success) {
        setResponseMsg('✅ Configuration saved!');
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
    <main className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-[#0c52a2]">Email API Control Panel</h2>

        {/* Email Config */}
        <input type="email" name="ownerEmail" placeholder="Owner Gmail" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="password" name="appPassword" placeholder="App Password" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="email" name="adminEmail" placeholder="Receiver Email" className="w-full p-2 border rounded" onChange={handleChange} required />
        <textarea name="replyMessage" placeholder="Auto Reply Message" rows="4" className="w-full p-2 border rounded" onChange={handleChange}></textarea>

        {/* Logo Upload */}
        <label className="block text-sm font-medium">Upload Logo (optional):</label>
        <input type="file" accept="image/*" className="w-full p-2 border rounded" onChange={handleLogoChange} />

        {/* --- Custom Field Builder --- */}
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2 text-lg">➕ Custom Form Fields</h3>

          <div className="grid md:grid-cols-2 gap-3">
            <input type="text" name="label" placeholder="Field Label" className="p-2 border rounded" value={newField.label} onChange={handleNewFieldChange} />
            <input type="text" name="name" placeholder="Field Name (unique)" className="p-2 border rounded" value={newField.name} onChange={handleNewFieldChange} />
            <select name="type" className="p-2 border rounded" value={newField.type} onChange={handleNewFieldChange}>
              {fieldTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="required" checked={newField.required} onChange={handleNewFieldChange} />
              <span>Required?</span>
            </label>
          </div>

          <button type="button" onClick={addField} className="mt-3 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">
            ➕ Add Field
          </button>

          {/* Show added fields */}
          <ul className="mt-4 space-y-2">
            {customFields.map((field, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded flex justify-between items-center">
                <span>{field.label} ({field.type}) {field.required && '*'}</span>
                <button type="button" onClick={() => removeField(index)} className="text-red-600 hover:underline">Remove</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#0c52a2] hover:bg-[#083d7a]'} text-white py-2 rounded`}
        >
          {loading ? 'Saving...' : 'Save Configuration'}
        </button>

        {/* Response Message */}
        {responseMsg && <p className="text-center mt-2 font-medium">{responseMsg}</p>}
      </form>
      <form action="/api/auth/signout" method="post" className="mt-8">
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition shadow-lg"
          >
            Logout
          </button>
        </form>
    </main>
  );
}
