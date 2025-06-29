"use client";
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify'; // Assuming toast is available for notifications

const apiBase = "https://indocsmails.onrender.com";

export default function DynamicContactForm1({ user }) {
  const apiKey = user?.apiKey; // Ensure apiKey is safely accessed
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);
  const logoRef = useRef();
  const formRef = useRef();

  useEffect(() => {
    let interval;

    async function fetchConfig() {
      if (!apiKey) {
        setResponseMsg({
          type: 'danger',
          text: '❌ API key missing. Please ensure you are logged in.',
        });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${apiBase}/config.json/${apiKey}`);
        const data = await res.json();
        if (data.success) {
          setConfig(data.config);
          setResponseMsg(null); // Clear any previous error messages on successful fetch
        } else {
          throw new Error(data.error || "Unknown error fetching config.");
        }
      } catch (err) {
        console.error("Failed to load config:", err);
        setResponseMsg({
          type: 'danger',
          text: '⚠️ Failed to load form: ' + (err.message || 'Server error'),
        });
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
    // Live preview: Fetch config every 5 seconds
    interval = setInterval(fetchConfig, 5000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [apiKey]); // Depend on apiKey to refetch if it changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setResponseMsg({ type: 'info', text: 'Sending...' });
    toast.info('Sending message... 📨'); // Toast notification for sending

    const formData = new FormData(formRef.current);

    if (!apiKey) {
      setResponseMsg({ type: 'danger', text: '❌ API key missing for submission.' });
      toast.error('API key missing for submission! 🔑');
      setSending(false);
      return;
    }

    try {
      const res = await fetch(`${apiBase}/send-email`, {
        method: 'POST',
        body: formData,
        headers: {
          'x-api-key': apiKey,
        },
      });

      const result = await res.json();
      if (result.success) {
        setResponseMsg({ type: 'success', text: '✅ Message sent!' });
        formRef.current.reset(); // Reset form fields
        toast.success('Message sent successfully! 🎉');
      } else {
        setResponseMsg({
          type: 'danger',
          text: result.error || '❌ Failed to send message.',
        });
        toast.error(`Failed to send: ${result.error || 'Unknown error'} 😞`);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setResponseMsg({ type: 'danger', text: '❌ Server error.' });
      toast.error('Server error during submission. 🚨');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen w-[70%] py-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-white p-8 rounded-3xl shadow-2xl border border-gray-200 animate-fade-in">
        <h1 className="text-2xl font-extrabold text-center text-blue-700 tracking-wide mb-6 pb-4 border-b-4 border-blue-300 transform transition duration-300 hover:scale-105">
          Live Form Preview 👁️
        </h1>

        {config?.logoPath && (
          <img
            ref={logoRef}
            src={`${apiBase}${config.logoPath}`}
            alt="Company Logo"
            className="mx-auto mb-6 h-24 object-contain rounded-full shadow-md"
            // Optional: Add error handling for image loading
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/96x96/E2E8F0/64748B?text=Logo"; e.target.alt="Image failed to load"; }}
          />
        )}

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {config?.formTitle || 'Your Form'}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="ml-3 text-lg text-gray-600">Loading form...</p>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-6 mt-4"
          >
            {config?.fields?.length > 0 ? (
              config.fields.map((field, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    {field.label || field.name}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      rows={4}
                      placeholder={field.placeholder || ''}
                      required={!!field.required}
                      className="input-field resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder || ''}
                      required={!!field.required}
                      accept={field.accept || undefined}
                      multiple={field.multiple || undefined}
                      className="input-field"
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="bg-yellow-100 text-yellow-800 text-base font-medium px-6 py-4 rounded-xl border border-yellow-400 text-center shadow-sm">
                ⚠️ No fields configured in backend. Please configure fields in the Control Panel.
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className={`w-full font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 ${
                sending
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white"
              }`}
            >
              {sending ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        )}

        {responseMsg && (
          <div
            className={`mt-6 px-6 py-3 rounded-xl text-base font-medium border text-center shadow-sm ${
              responseMsg.type === 'success'
                ? 'bg-green-100 text-green-700 border-green-300'
                : responseMsg.type === 'danger'
                ? 'bg-red-100 text-red-700 border-red-300'
                : 'bg-blue-100 text-blue-700 border-blue-300'
            }`}
          >
            {responseMsg.text}
          </div>
        )}
      </div>

      <p className="text-center text-white mt-8 font-semibold text-lg animate-bounce">
        👇 Scroll down to copy the code for embedding this form.
      </p>
      {/* Local styling for input fields to match the consistent design */}
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
    </div>
  );
}
