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
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-3xl shadow-2xl max-w-4xl mx-auto my-10 border border-blue-200">
      <h2 className="text-2xl font-extrabold text-center text-blue-700 mb-8 pb-4 border-b-4 border-blue-300 transform transition duration-300">
        Ready-to-Use Code Snippets ✨
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Language Selector */}
        <select
          className="flex-grow w-full sm:w-auto border border-blue-400 p-3 rounded-xl bg-white text-blue-800 text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out cursor-pointer"
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            setGeminiAnswer(''); // Clear answer when language changes
            setShowQuestionInput(false); // Hide question input
          }}
        >
          <option value="html">HTML</option>
          <option value="react">React</option>
          <option value="python">Python</option>
        </select>

        {/* Action Buttons */}
        <div className="flex w-full sm:w-auto space-x-4">
          <button
            onClick={handleCopy}
            className="flex-1 sm:flex-none bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path></svg>
                <span>Copy Code</span>
              </>
            )}
          </button>
          <button
            onClick={() => {
              setShowQuestionInput(prev => !prev); // Toggle visibility
              setGeminiAnswer(''); // Clear previous answer
              setUserQuestion(''); // Clear previous question
            }}
            className="flex-1 sm:flex-none bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-purple-700 active:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5L6 11H5a1 1 0 100 2h1a1 1 0 00.867.5L10 9h1a1 1 0 100-2h-1z" clipRule="evenodd"></path></svg>
            <span>Ask a Question</span>
          </button>
        </div>
      </div>

      {/* Code Preview Area - Now using <pre><code> for raw code display */}
      <div className="rounded-2xl overflow-auto shadow-xl border border-gray-300 bg-gray-900 text-gray-200" style={{maxHeight: '500px'}}>
        <pre className="p-6 text-sm leading-relaxed" style={{ fontFamily: 'Fira Code, monospace', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          <code>
            {sampleCodes[language]}
          </code>
        </pre>
      </div>

      {/* Question and Answer Section */}
      {showQuestionInput && (
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9.247a1.25 1.25 0 00-1.242 1.242l1.242 1.242a1.25 1.25 0 001.242-1.242l-1.242-1.242zm0 0L21 3m-12 9v5h5"></path></svg>
            Ask Gemini about the Code
          </h3>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out mb-4"
            rows="4"
            placeholder="Type your question about the code here (e.g., 'What does the handleSubmit function do?', 'How can I add validation to this form?')"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            disabled={isAnswering}
          ></textarea>
          <button
            onClick={handleAskQuestion}
            disabled={isAnswering}
            className={`w-full bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md ${isAnswering ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700 active:bg-purple-800'} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2`}
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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM8 9H7a1 1 0 000 2h1a1 1 0 100-2zm6 0h-1a1 1 0 100 2h1a1 1 0 100-2zm-3 0h-1a1 1 0 100 2h1a1 1 0 100-2z" clipRule="evenodd"></path></svg>
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

    </div>
  );
}

