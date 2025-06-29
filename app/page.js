'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

export default function StartPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [html, setHtml] = useState('starter');

  const sampleCodes = {
  starter: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Dynamic Contact Form</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body {
      background-color: #f5f7fa;
      padding: 2rem;
      font-family: Arial, sans-serif;
    }
    .form-container {
      max-width: 600px;
      margin: auto;
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .logo {
      max-width: 150px;
      margin-bottom: 1rem;
    }
    .btn-custom {
      background-color: #0c52a2;
      color: white;
    }
  </style>
</head>
<body>

<div class="form-container text-center">
  <img id="logo" class="logo d-none" />
  <h2 id="formTitle">Contact Us</h2>
  <form id="dynamicForm" enctype="multipart/form-data" class="text-start mt-4"></form>
  <div id="response" class="mt-3 text-center fw-bold"></div>
</div>

<script>
  const apiBase = "https://indocsmails.onrender.com";
  const apiKey = "Your_API_KEY"; // Replace with your actual API key

  async function loadForm() {
    try {
      const configRes = await fetch(\`\${apiBase}/config.json/\${apiKey}\`);
      const configData = await configRes.json();

      if (!configData.success) throw new Error(configData.error);
      const config = configData.config;

      const form = document.getElementById('dynamicForm');
      const logo = document.getElementById('logo');
      const responseDiv = document.getElementById('response');

      if (config.logoPath) {
        logo.src = apiBase + config.logoPath;
        logo.classList.remove('d-none');
      }

      if (!Array.isArray(config.fields) || config.fields.length === 0) {
        form.innerHTML = \`<div class="alert alert-warning text-center">⚠️ No fields configured in backend.</div>\`;
        return;
      }

      config.fields.forEach((field, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'mb-3';

        const label = document.createElement('label');
        label.innerText = field.label || field.name;
        label.className = 'form-label';

        let input;
        if (field.type === 'textarea') {
          input = document.createElement('textarea');
          input.rows = 4;
        } else {
          input = document.createElement('input');
          input.type = field.type;
        }

        input.className = 'form-control';
        input.name = field.name;
        input.required = !!field.required;
        if (field.placeholder) input.placeholder = field.placeholder;
        if (field.accept && field.type === 'file') input.accept = field.accept;
        if (field.multiple && field.type === 'file') input.multiple = true;

        if (index === 0) input.focus();

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        form.appendChild(wrapper);
      });

      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.innerText = 'Send Message';
      submitBtn.className = 'btn btn-custom w-100';
      form.appendChild(submitBtn);

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        responseDiv.innerHTML = '<div class="alert alert-info">Sending...</div>';
        const formData = new FormData(form);

        try {
          const sendRes = await fetch(\`\${apiBase}/send-email\`, {
            method: 'POST',
            body: formData,
            headers: {
              'x-api-key': apiKey
            }
          });

          const result = await sendRes.json();
          if (result.success) {
            responseDiv.innerHTML = '<div class="alert alert-success">✅ Message sent!</div>';
            form.reset();
          } else {
            responseDiv.innerHTML = \`<div class="alert alert-danger">❌ \${result.error || 'Failed to send message.'}</div>\`;
          }
        } catch (err) {
          console.error("Form error:", err);
          responseDiv.innerHTML = '<div class="alert alert-danger">❌ Server error.</div>';
        }
      });

    } catch (error) {
      console.error("Failed to load config:", error);
      document.getElementById('formTitle').innerText = "⚠️ Failed to load form.";
      document.getElementById('response').innerHTML = \`<div class="alert alert-danger">\${error.message || 'Error loading configuration'}</div>\`;
    }
  }

  loadForm();
</script>

</body>
</html>`,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-700 to-cyan-800 flex flex-col items-center justify-center text-white text-center animate-fade-in-splash">
        <img
          src="/logo.webp"
          alt="Indocs Media Logo"
          className="h-32 w-32 rounded-full mb-6 shadow-lg animate-zoom-in"
        />
        <h1 className="text-5xl font-extrabold tracking-wider animate-pulse">
          Indocs Mails
        </h1>
        <p className="mt-4 text-xl animate-fade-in-text">Loading...</p>
        <style>{`
          @keyframes fade-in-splash {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes zoom-in {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes fade-in-text {
            0% { opacity: 0; }
            50% { opacity: 0; }
            100% { opacity: 1; }
          }
          .animate-fade-in-splash { animation: fade-in-splash 1s ease-out forwards; }
          .animate-zoom-in { animation: zoom-in 1s ease-out forwards; }
          .animate-pulse { animation: pulse 2s infinite; }
          .animate-fade-in-text { animation: fade-in-text 2s ease-out forwards; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-cyan-800 to-teal-700 text-white flex items-center justify-center px-4 py-12">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 text-center lg:text-left">
  {/* Centered Logo */}
  <div className="flex justify-center lg:justify-start">
    <img
      src="/logo.webp"
      alt="Indocs Media Logo"
      className="h-24 w-24 rounded-full mb-6 shadow-lg animate-zoom-in"
    />
  </div>

  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4">
  Welcome to {' '}
  <span className="bg-gradient-to-tr from-cyan-800 to-teal-700 bg-clip-text text-transparent">
    Indocs Mails
  </span>{' '}
  📬
</h1>

  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
    A simple and secure authentication system <br />
    Powered by{' '}
    <Link
      href="https://indocsmedia.onrender.com"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 font-medium underline hover:text-blue-700"
    >
      Indocs Media
    </Link>
  </p>

  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
    <button
      onClick={() => handleNavigation('/login')}
      className="bg-gradient-to-tr from-cyan-800 to-teal-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md transition"
    >
      Login
    </button>
    <button
      onClick={() => handleNavigation('/signup')}
      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl text-lg font-semibold shadow-md transition"
    >
      Sign Up
    </button>
  </div>
</div>


        {/* Right Side */}
        <div className="w-full lg:w-1/2 bg-gray-50 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center lg:text-left">
            👨‍💻 Get Started with the Code
          </h2>
          <p className="text-gray-600 text-base mb-4 text-center lg:text-left">
            See how it works with a live code snippet preview.
          </p>

          <div className="bg-white rounded-xl border border-gray-300 shadow-inner max-h-[400px] overflow-y-auto p-4">
            <div className="rounded-2xl overflow-x-auto shadow-xl border border-gray-300 bg-gray-900 text-gray-200 max-h-[500px]">
              <pre
                className="p-4 sm:p-6 text-sm leading-relaxed"
                style={{
                  fontFamily: 'Fira Code, monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                <code>{sampleCodes[html]}</code>
              </pre>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4 text-center lg:text-left">
            🔒 Sign up or log in to interact with the code securely.
          </p>
        </div>
      </div>
    </div>
  );
}
