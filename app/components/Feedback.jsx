'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// const token = process.env.PERSONAL_ACCESS_TOKEN;
const apiBase = "https://indocsmails.onrender.com";
const apiKey = "95e6d661b2c2271df05cbc2ad72d112ecdfacea37d1f678255cc185be733d9bf"; // Replace securely in production

export function Feedback() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [formData, setFormData] = useState({});
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configRes = await fetch(`${apiBase}/config.json/${apiKey}`);
        const configData = await configRes.json();

        if (!configData.success) {
          throw new Error(configData.error || "Failed to fetch configuration.");
        }
        setConfig(configData.config);
      } catch (err) {
        console.error("Failed to load config:", err);
        setError(err.message || "Error loading configuration.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSendingFeedback(true);
    setResponseMessage(<div className="alert alert-info">Sending...</div>);

    const dataToSend = new FormData();
    for (const key in formData) {
      const value = formData[key];
      if (value instanceof File) {
        dataToSend.append(key, value);
      } else if (value !== undefined && value !== null) {
        dataToSend.append(key, value);
      }
    }

    try {
      const sendRes = await fetch(`${apiBase}/send-email`, {
        method: 'POST',
        body: dataToSend,
        headers: {
          'x-api-key': apiKey,
        },
      });

      const result = await sendRes.json();
      if (result.success) {
        setResponseMessage(<div className="alert alert-success">✅ Feedback sent!</div>);
        setFormData({});
        toast.success('Feedback sent! ✅');
      } else {
        setResponseMessage(<div className="alert alert-danger">❌ {result.error || 'Failed to send message.'}</div>);
        toast.error(`Failed to send Feedback: ${result.error || ''} ❌`);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setResponseMessage(<div className="alert alert-danger">❌ Server error.</div>);
      toast.error('Server error. ❌');
    } finally {
      setIsSendingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="form-container text-center">
        <div className="alert alert-info">Loading form configuration...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-container text-center">
        <h2>⚠️ Failed to load form</h2>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!config || !Array.isArray(config.fields) || config.fields.length === 0) {
    return (
      <div className="form-container text-center">
        <div className="alert alert-warning">⚠️ Backend Error</div>
      </div>
    );
  }

  return (
    <div className="text-center w-full">
      <h2 className="text-xl font-semibold text-purple-800 mb-4 flex items-center justify-center">
        <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5L6 11H5a1 1 0 100 2h1a1 1 0 00.867.5L10 9h1a1 1 0 100-2h-1z" clipRule="evenodd"></path>
        </svg>
        Developer Feedback
      </h2>

      <form onSubmit={handleSubmit} className="text-start mt-4">
        {config.fields.map((field) => (
          <div className="mb-3" key={field.name}>
            <label htmlFor={field.name} className="form-label font-medium text-gray-700">
              {field.label || field.name}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                className="form-control w-full p-3 border border-gray-300 rounded-lg"
                rows={4}
                required={field.required}
                placeholder={field.placeholder || 'Enter your message...'}
                value={formData[field.name] || ''}
                onChange={handleChange}
              />
            ) : (
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                className="form-control w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Enter your Email"
                accept={field.accept}
                multiple={field.multiple}
                required={field.required}
                value={field.type !== 'file' ? (formData[field.name] || '') : undefined}
                onChange={handleChange}
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSendingFeedback}
          className={`w-full font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 ${
            isSendingFeedback
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white"
          }`}
        >
          {isSendingFeedback ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Sending Feedback...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span>Send Feedback</span>
            </>
          )}
        </button>
      </form>

      <div id="response" className="mt-3 text-center font-bold">
        {responseMessage}
      </div>
      
      <div>This site is  <span className='text-red-600'>under development</span> Give your Suggestions! <span className='text-green-500'>API is working very well👌</span><br/> !! Happy Coding 😊!!</div>
      <style>{`
        .form-container {
          max-width: 600px;
          margin: auto;
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
