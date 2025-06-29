"use client";
import React, { useState } from 'react';
import { toast } from 'react-toastify';

// Placeholder for sampleCodes. In a real application, these would be
// defined elsewhere or imported. For this example, we assume they exist.
// This is crucial for the CodePreviewer to function.
const sampleCodes = {
  html: `<!DOCTYPE html>
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
  javascript: `function greet(name) {\n  return "Hello " + name + "!";\n}`,
  css: `body {\n  background: #f0f0f0;\n  font-family: sans-serif;\n}`,
  react: `'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Assuming toast is available for notifications

const apiBase = "https://indocsmails.onrender.com";
const apiKey = "Your_API_KEY"; // Replace with your actual API key

export function DynamicContactFormReact() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [formData, setFormData] = useState({}); // To store form input values

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configRes = await fetch(\`\${apiBase}/config.json/\${apiKey}\`);
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
  }, []); // Run once on component mount

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] })); // Assuming single file for simplicity, needs adjustment for multiple
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage(<div className="alert alert-info">Sending...</div>);

    const dataToSend = new FormData();
    for (const key in formData) {
      // Ensure that if a file input has no file, we don't append a FileList object
      if (formData[key] instanceof File) {
          dataToSend.append(key, formData[key]);
      } else if (formData[key] !== undefined && formData[key] !== null) {
          dataToSend.append(key, formData[key]);
      }
    }


    try {
      const sendRes = await fetch(\`\${apiBase}/send-email\`, {
        method: 'POST',
        body: dataToSend,
        headers: {
          'x-api-key': apiKey,
        },
      });

      const result = await sendRes.json();
      if (result.success) {
        setResponseMessage(<div className="alert alert-success">✅ Message sent!</div>);
        setFormData({}); // Clear form
        toast.success('Message sent! ✅');
      } else {
        setResponseMessage(<div className="alert alert-danger">❌ {result.error || 'Failed to send message.'}</div>);
        toast.error(\`Failed to send message: \${result.error || ''} ❌\`);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setResponseMessage(<div className="alert alert-danger">❌ Server error.</div>);
      toast.error('Server error. ❌');
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
        <h2 id="formTitle">⚠️ Failed to load form.</h2>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!config || !Array.isArray(config.fields) || config.fields.length === 0) {
    return (
      <div className="form-container text-center">
        <div className="alert alert-warning text-center">⚠️ No fields configured in backend.</div>
      </div>
    );
  }

  return (
    <div className="form-container text-center">
      {config.logoPath && (
        <img id="logo" src={\`\${apiBase}\${config.logoPath}\`} className="logo" alt="Company Logo" />
      )}
      <h2 id="formTitle">{config.formTitle || 'Contact Us'}</h2>
      <form onSubmit={handleSubmit} className="text-start mt-4">
        {config.fields.map((field) => (
          <div className="mb-3" key={field.name}>
            <label htmlFor={field.name} className="form-label">
              {field.label || field.name}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                className="form-control"
                name={field.name}
                rows={4}
                required={!!field.required}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={handleChange}
              ></textarea>
            ) : (
              <input
                id={field.name}
                type={field.type}
                className="form-control"
                name={field.name}
                required={!!field.required}
                placeholder={field.placeholder}
                accept={field.accept}
                multiple={field.multiple}
                value={field.type !== 'file' ? (formData[field.name] || '') : undefined}
                onChange={handleChange}
              />
            )}
          </div>
        ))}
        <button type="submit" className="btn btn-custom w-100">
          Send Message
        </button>
      </form>
      <div id="response" className="mt-3 text-center fw-bold">
        {responseMessage}
      </div>
      <style>{\`
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
      \`}</style>
    </div>
  );
}`,
  python: `# Python Flask backend for the contact form
# Save this as 'app.py' and run with 'flask run' (install Flask and requests: pip install Flask requests)

from flask import Flask, render_template_string, request, jsonify
import requests # To make requests to the external API
import json
import os

app = Flask(__name__)

# This would typically come from a file or database in a real app
# Simulating the config.json for rendering purposes
MOCK_CONFIG = {
    "success": True,
    "config": {
        "logoPath": "/images/logo.png", # Example path, you might serve this statically
        "formTitle": "Contact Us (Python/Flask)",
        "fields": [
            {"name": "name", "label": "Your Name", "type": "text", "required": True, "placeholder": "Enter your name"},
            {"name": "email", "label": "Your Email", "type": "email", "required": True, "placeholder": "Enter your email"},
            {"name": "subject", "label": "Subject", "type": "text", "required": True, "placeholder": "Subject of your message"},
            {"name": "message", "label": "Your Message", "type": "textarea", "required": True, "placeholder": "Type your message here"},
            {"name": "attachment", "label": "Attach File", "type": "file", "accept": ".pdf,.doc", "multiple": False},
        ]
    }
}

API_BASE = "https://indocsmails.onrender.com"
API_KEY = "Your_API_KEY" # Replace with your actual API key

# HTML template for the form, using Jinja2 for dynamic fields
# Note: The JavaScript part of the original HTML form that fetches config
# and dynamically builds the form fields is replaced here by Flask rendering
# the form using the MOCK_CONFIG directly on the server side.
FORM_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>{{ form_title }}</title>
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
    {% if logo_path %}
        <img src="{{ logo_path }}" class="logo" alt="Company Logo" />
    {% endif %}
    <h2 id="formTitle">{{ form_title }}</h2>
    <form id="dynamicForm" method="POST" action="/submit-form" enctype="multipart/form-data" class="text-start mt-4">
        {% if not fields %}
            <div class="alert alert-warning text-center">⚠️ No fields configured in backend.</div>
        {% else %}
            {% for field in fields %}
                <div class="mb-3">
                    <label for="{{ field.name }}" class="form-label">
                        {{ field.label or field.name }}
                    </label>
                    {% if field.type == 'textarea' %}
                        <textarea id="{{ field.name }}" class="form-control" name="{{ field.name }}" rows="4"
                                  {% if field.required %}required{% endif %}
                                  placeholder="{{ field.placeholder or '' }}"
                        ></textarea>
                    {% else %}
                        <input id="{{ field.name }}" type="{{ field.type }}" class="form-control" name="{{ field.name }}"
                               {% if field.required %}required{% endif %}
                               placeholder="{{ field.placeholder or '' }}"
                               {% if field.accept and field.type == 'file' %}accept="{{ field.accept }}"{% endif %}
                               {% if field.multiple and field.type == 'file' %}multiple{% endif %}
                        />
                    {% endif %}
                </div>
            {% endfor %}
            <button type="submit" class="btn btn-custom w-100">
                Send Message
            </button>
        {% endif %}
    </form>
    <div id="response" class="mt-3 text-center fw-bold">
        {% if message %}
            <div class="alert alert-{{ message_type }}">{{ message }}</div>
        {% endif %}
    </div>
</div>

</body>
</html>
"""


@app.route('/')
def index():
    config = MOCK_CONFIG.get('config', {})
    # For a real app, 'logoPath' would point to a static file served by Flask
    # or an external URL. Here it's mocked to show where it would be used.
    logo_path = config.get('logoPath', '')
    if logo_path.startswith('/'): # If it's a relative path, prepend API_BASE for display in browser
        logo_path = f"{API_BASE}{logo_path}"
    return render_template_string(
        FORM_TEMPLATE,
        form_title=config.get('formTitle', 'Contact Us'),
        fields=config.get('fields', []),
        logo_path=logo_path
    )

@app.route('/submit-form', methods=['POST'])
def submit_form():
    # Flask's request.form gets non-file fields
    form_data = request.form.to_dict()
    # Flask's request.files gets file fields
    files = request.files.to_dict()

    # Prepare data for the external API
    uploaded_files = {}
    for name, file_storage in files.items():
        if file_storage.filename:
            # requests.post expects a tuple: (filename, file_object, content_type)
            uploaded_files[name] = (file_storage.filename, file_storage.stream, file_storage.content_type)

    try:
        # requests.post will automatically set Content-Type to multipart/form-data
        # when 'files' parameter is used.
        response = requests.post(
            f"{API_BASE}/send-email",
            data=form_data, # Use 'data' for form fields
            files=uploaded_files, # Use 'files' for file uploads
            headers={'x-api-key': API_KEY}
        )
        response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
        result = response.json()

        if result.get('success'):
            message = "✅ Message sent!"
            message_type = "success"
        else:
            message = f"❌ {result.get('error', 'Failed to send message.')}"
            message_type = "danger"

    except requests.exceptions.RequestException as e:
        message = f"❌ Server error during API call: {str(e)}"
        message_type = "danger"
    except json.JSONDecodeError:
        message = "❌ External API responded with invalid JSON."
        message_type = "danger"
    except Exception as e:
        message = f"❌ An unexpected error occurred: {str(e)}"
        message_type = "danger"


    # Re-render the form with the submission message
    config = MOCK_CONFIG.get('config', {})
    logo_path = config.get('logo', '')
    if logo_path.startswith('/'):
        logo_path = f"{API_BASE}{logo_path}"

    return render_template_string(
        FORM_TEMPLATE,
        form_title=config.get('formTitle', 'Contact Us'),
        fields=config.get('fields', []),
        logo_path=logo_path,
        message=message,
        message_type=message_type
    )

if __name__ == '__main__':
    # To run this Flask app:
    # 1. Save this code as 'app.py'
    # 2. Open your terminal/command prompt in the same directory
    # 3. Install Flask and requests: pip install Flask requests
    # 4. Set the FLASK_APP environment variable:
    #    On Windows: set FLASK_APP=app.py
    #    On macOS/Linux: export FLASK_APP=app.py
    # 5. Run the app: flask run
    # It will typically run on http://127.0.0.1:5000/
    app.run(debug=True) # debug=True will restart the server on code changes
`
};

export default function CodePreviewer() {
  const [language, setLanguage] = useState('html');
  const [copied, setCopied] = useState(false);
  const [showQuestionInput, setShowQuestionInput] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [geminiAnswer, setGeminiAnswer] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleCodes[language]).then(() => {
      toast.success('Copied to clipboard ✅');
      setCopied(true); // Set copied to true on successful copy
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy! ❌');
    });
  };

  const handleAskQuestion = async () => {
    if (!userQuestion.trim()) {
      toast.warn('Please enter your question! 🤔');
      return;
    }

    setIsAnswering(true);
    setGeminiAnswer(''); // Clear previous answer
    toast.info('Asking Gemini... 🧠');

    try {
      let chatHistory = [];
      chatHistory.push({
        role: "user",
        parts: [{ text: `Regarding the following ${language} code:\n\n\`\`\`${language}\n${sampleCodes[language]}\n\`\`\`\n\nMy question is: ${userQuestion}` }]
      });

      const payload = { contents: chatHistory };
      const apiKey = ""; // Canvas will automatically provide this
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setGeminiAnswer(text);
        toast.success('Answer received! 🎉');
      } else {
        setGeminiAnswer('Sorry, I could not get an answer for that question. Please try again or rephrase. 😔');
        toast.error('Failed to get answer. 😞');
      }
    } catch (err) {
      console.error("Gemini API error:", err);
      setGeminiAnswer('An error occurred while connecting to Gemini. Please try again later. 🚧');
      toast.error('API connection error. 🚨');
    } finally {
      setIsAnswering(false);
    }
  };


  return (
    <div className=" w-[100%] md:w-auto bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-3xl shadow-2xl max-w-4xl mx-auto my-6 sm:my-10 border border-blue-200">
  <h2 className="text-xl sm:text-2xl font-extrabold text-center text-green-700 mb-6 sm:mb-8 pb-4 border-b-4 border-green-900 transition duration-300">
    Ready-to-Use Code Snippets ✨
  </h2>

  {/* Controls */}
  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
    <select
      className="w-full sm:w-auto border border-green-400 p-3 rounded-xl bg-white text-green-800 text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 cursor-pointer"
      value={language}
      onChange={(e) => {
        setLanguage(e.target.value);
        setGeminiAnswer('');
        setShowQuestionInput(false);
      }}
    >
      <option value="html">HTML</option>
      <option value="react">React</option>
      <option value="python">Python</option>
    </select>

    <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
      <button
        onClick={handleCopy}
        className="w-full sm:w-auto bg-gradient-to-tr from-cyan-800 to-teal-700 text-white text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 flex items-center justify-center gap-2"
      >
        {copied ? (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
            <span>Copied!</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path></svg>
            <span>Copy Code</span>
          </>
        )}
      </button>

      <button
        onClick={() => {
          setShowQuestionInput(prev => !prev);
          setGeminiAnswer('');
          setUserQuestion('');
        }}
        className="w-full sm:w-auto bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-purple-700 active:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5L6 11H5a1 1 0 100 2h1a1 1 0 00.867.5L10 9h1a1 1 0 100-2h-1z" clipRule="evenodd"></path></svg>
        <span>Ask a Question</span>
      </button>
    </div>
  </div>

  {/* Code Block */}
  <div className="rounded-2xl overflow-x-auto shadow-xl border border-gray-300 bg-gray-900 text-gray-200 max-h-[500px]">
    <pre className="p-4 sm:p-6 text-sm leading-relaxed" style={{ fontFamily: 'Fira Code, monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      <code>{sampleCodes[language]}</code>
    </pre>
  </div>

  {/* Question Input */}
  {showQuestionInput && (
    <div className="mt-8 p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9.247a1.25 1.25 0 00-1.242 1.242l1.242 1.242a1.25 1.25 0 001.242-1.242l-1.242-1.242zm0 0L21 3m-12 9v5h5"></path></svg>
        Ask Gemini about the Code
      </h3>

      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
        rows="4"
        placeholder="Ask about the code (e.g., 'How to validate input?')"
        value={userQuestion}
        onChange={(e) => setUserQuestion(e.target.value)}
        disabled={isAnswering}
      ></textarea>

      <button
        onClick={handleAskQuestion}
        disabled={isAnswering}
        className={`w-full bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md ${isAnswering ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700 active:bg-purple-800'} focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 flex items-center justify-center gap-2`}
      >
        {isAnswering ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Getting Answer...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM8 9H7a1 1 0 000 2h1a1 1 0 100-2zm6 0h-1a1 1 0 100 2h1a1 1 0 100-2zm-3 0h-1a1 1 0 100 2h1a1 1 0 100-2z" clipRule="evenodd"></path></svg>
            <span>Submit Question</span>
          </>
        )}
      </button>

      {geminiAnswer && (
        <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
          <h4 className="text-lg font-semibold text-purple-800 mb-2">Gemini's Answer:</h4>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{geminiAnswer}</p>
        </div>
      )}
    </div>
  )}
  <div className="w-[100%] md:w-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-3xl shadow-2xl max-w-4xl mx-auto md:my-10 border border-blue-200">
    <h2 className="text-2xl font-extrabold text-center text-green-700 mb-8 pb-4 border-b-4 border-blue-300 transform transition duration-300">
        API Documentation 🚀
      </h2>
    <div className="rounded-2xl overflow-auto shadow-xl border border-gray-300 p-2 text-gray-200" style={{maxHeight: '500px'}}>
      {/* Overview Section */}
      
      <section className="">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0l-5.25 5.25M21 3h-6.75"></path></svg>
          Overview
        </h3>
        <p className="text-gray-700 leading-relaxed">
          This documentation outlines the usage of the dynamic contact form API endpoint. It allows you to submit form data, including files, to an external service for email handling.
        </p>
      </section>

      {/* API Endpoint Section */}
      <section className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"></path></svg>
          API Endpoint
        </h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li className="mb-2">
            <strong>Base URL:</strong> <code className="bg-gray-200 p-1 rounded">https://indocsmails.onrender.com</code>
          </li>
          <li className="mb-2">
            <strong>Config Endpoint:</strong> <code className="bg-gray-200 p-1 rounded">/config.json/{"{Your_API_KEY}"}</code>
            <p className="text-sm text-gray-600 ml-4">Retrieves the dynamic form fields configuration.</p>
          </li>
          <li>
            <strong>Submission Endpoint:</strong> <code className="bg-gray-200 p-1 rounded">/send-email</code>
            <p className="text-sm text-gray-600 ml-4">Used for submitting form data and attachments.</p>
          </li>
        </ul>
      </section>

      {/* Authentication Section */}
      <section className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2v5a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6z"></path></svg>
          Authentication (API Key)
        </h3>
        <p className="text-gray-700 leading-relaxed mb-3">
          Authentication is done via an API key, which must be included in the request headers for submissions, and as part of the URL for config requests.
        </p>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded" role="alert">
          <p className="font-bold">Important Security Note:</p>
          <p className="text-sm">
            For client-side code (HTML/React), exposing your API key directly in the frontend can be a security risk. For production applications, it's highly recommended to proxy requests through your own backend server to keep the API key secure.
          </p>
        </div>
      </section>

      {/* Submit Form Data Section */}
      <section className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
          Submit Form Data (<code className="bg-gray-200 p-1 rounded">POST /send-email</code>)
        </h3>
        <p className="text-gray-700 mb-2">
          This endpoint accepts <code className="bg-gray-200 p-1 rounded">multipart/form-data</code>.
        </p>
        <h4 className="text-xl font-semibold text-gray-700 mt-4 mb-2">Headers:</h4>
        <ul className="list-disc pl-5 text-gray-700 mb-4">
          <li><code className="bg-gray-200 p-1 rounded">Content-Type: multipart/form-data</code> (automatically set by browsers for FormData / Flask's request handling for file uploads)</li>
          <li><code className="bg-gray-200 p-1 rounded">x-api-key: {"{Your_API_KEY}"}</code> (<strong>Required</strong>)</li>
        </ul>

        <h4 className="text-xl font-semibold text-gray-700 mt-4 mb-2">Request Body (Form Data):</h4>
        <p className="text-gray-700 mb-2">
          The form fields are dynamic and determined by the <code className="bg-gray-200 p-1 rounded">/config.json</code> endpoint.
          Common fields typically include:
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li><code className="bg-gray-200 p-1 rounded">name</code> (text)</li>
          <li><code className="bg-gray-200 p-1 rounded">email</code> (email)</li>
          <li><code className="bg-gray-200 p-1 rounded">subject</code> (text)</li>
          <li><code className="bg-gray-200 p-1 rounded">message</code> (text/textarea)</li>
          <li><code className="bg-gray-200 p-1 rounded">attachment</code> (file, if configured)</li>
          {/* Add more based on your config.json structure */}
        </ul>

        <h4 className="text-xl font-semibold text-gray-700 mt-4 mb-2">Success Response (HTTP 200 OK):</h4>
        <pre className="bg-gray-900 text-white p-3 rounded-lg overflow-x-auto text-sm"><code>{`{
    "success": true,
    "message": "Email sent successfully!"
}`}</code></pre>

        <h4 className="text-xl font-semibold text-gray-700 mt-4 mb-2">Error Response (HTTP 400 Bad Request / 500 Internal Server Error):</h4>
        <pre className="bg-gray-900 text-white p-3 rounded-lg overflow-x-auto text-sm"><code>{`{
    "success": false,
    "error": "Error message details (e.g., 'Missing API Key', 'Invalid input')"
}`}</code></pre>
      </section>

      {/* How to Use This Template in Your Code Section */}
      <section className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          How to Use This Template in Your Code
        </h3>
        <p className="text-gray-700 mb-3">
          The provided code snippets (HTML, React, Python) already incorporate the logic to interact with this API. The key is to correctly set the <code className="bg-gray-200 p-1 rounded">apiBase</code> and <code className="bg-gray-200 p-1 rounded">apiKey</code> variables.
        </p>

        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="text-xl font-semibold text-green-700 mb-2">1. HTML Example:</h4>
          <p className="text-gray-700 mb-2">
            In your HTML file, locate the <code className="bg-gray-200 p-1 rounded">&lt;script&gt;</code> block and ensure these lines are correctly set:
          </p>
          <pre className="bg-gray-900 text-white p-3 rounded-lg overflow-x-auto text-sm"><code>{`
<script>
  const apiBase = "https://indocsmails.onrender.com";
  const apiKey = "Your_API_KEY"; // <-- ✅ Replace with your actual API key!

  // ... rest of the loadForm() and event listener logic
</script>`}</code></pre>
          <p className="text-gray-700 mt-2">
            The <code className="bg-gray-200 p-1 rounded">fetch</code> calls inside <code className="bg-gray-200 p-1 rounded">loadForm()</code> and the <code className="bg-gray-200 p-1 rounded">submit</code> event listener use these variables.
          </p>
        </div>

        <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="text-xl font-semibold text-green-700 mb-2">2. React Example:</h4>
          <p className="text-gray-700 mb-2">
            In your `DynamicContactFormReact` component, ensure these constants are defined at the top of the component file (or passed as props/context in larger applications):
          </p>
          <pre className="bg-gray-900 text-white p-3 rounded-lg overflow-x-auto text-sm"><code>{`
const apiBase = "https://indocsmails.onrender.com";
const apiKey = "Your_API_KEY"; // <-- ✅ Replace with your actual API key!

export function DynamicContactFormReact() {
  // ... rest of the component logic (useState, useEffect, handleChange, handleSubmit)
}`}</code></pre>
          <p className="text-gray-700 mt-2">
            The <code className="bg-gray-200 p-1 rounded">fetch</code> calls within the <code className="bg-gray-200 p-1 rounded">useEffect</code> and <code className="bg-gray-200 p-1 rounded">handleSubmit</code> function will automatically use these constants.
          </p>
        </div>

        <div className="mb-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 className="text-xl font-semibold text-purple-700 mb-2">3. Python (Flask) Example:</h4>
          <p className="text-gray-700 mb-2">
            In your `app.py` Flask file, locate and set the following constants:
          </p>
          <pre className="bg-gray-900 text-white p-3 rounded-lg overflow-x-auto text-sm"><code>{`
API_BASE = "https://indocsmails.onrender.com"
API_KEY = "Your_API_KEY" # <-- ✅ Replace with your actual API key!

# ... rest of your Flask app routes and logic`}</code></pre>
          <p className="text-gray-700 mt-2">
            The <code className="bg-gray-200 p-1 rounded">requests.post</code> call in the <code className="bg-gray-200 p-1 rounded">/submit-form</code> route uses these for interaction.
          </p>
        </div>

        <p className="text-gray-700 mt-5 leading-relaxed">
          Remember to always replace <code className="bg-gray-200 p-1 rounded">"Your_API_KEY"</code> with your actual API key for the form to function correctly. Happy coding! 💻
        </p>
      </section>
    </div>
    </div>
</div>

  );
}

