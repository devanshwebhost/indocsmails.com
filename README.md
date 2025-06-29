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
    <main className="min-h-screen bg-gray-100 p-6  items-center justify-center ">
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
      <form action="/api/auth/signout" method="post" className="mt-8 flex justify-center mb-2">
          <button
  type="submit"
  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold shadow-md hover:bg-red-700 transition duration-200"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
  </svg>
  Logout
</button>

        </form>
    </main>
  );








}



















<!-- seee -->




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
    logo_path = config.get('logoPath', '')
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


<!-- footer =---  -->
'use client';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-tr from-cyan-800 to-teal-700 text-white px-6 py-10 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Indocs Mails Branding */}
        <div>
          <h2 className="text-2xl font-bold text-white">Indocs Mails</h2>
          <p className="text-gray-200 mt-2 text-sm">
            Fast, secure & developer-friendly email API for apps, forms, and alerts.
          </p>
          <p className="mt-4 text-sm">
            Powered by{" "}
            <Link
              href="https://indocsmedia.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className=" font-semibold hover:underline"
            >
              Indocs <span className='text-[#08b3ca] '>Media</span> 🚀
            </Link>
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li><Link href="/error" className="hover:text-white">Documentation</Link></li>
            <li><Link href="/blogs" className="hover:text-white">Blogs</Link></li>
            <li><Link href="/error" className="hover:text-white">Developer Feedback</Link></li>
            <li><Link href="https://indocsmedia.onrender.com" className="hover:text-white">Indocs<span className='text-[#08b3ca] '>Media</span></Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li><Link href="mailto:indocsmedia@gmail.com" className="hover:text-white">support@indocs<span className='text-[#08b3ca] '>media</span>.com</Link></li>
            <li><Link href="/error" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link href="/error" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/error" className="hover:text-white">API Status</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect</h3>
          <div className="flex space-x-4 mt-2">
            <Link href="#" className="hover:text-yellow-300" title="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20c7.547 0 11.675-6.155 11.675-11.49 0-.175 0-.35-.012-.522A8.18 8.18 0 0022 5.92a8.19 8.19 0 01-2.357.637A4.077 4.077 0 0021.448 4.1a8.224 8.224 0 01-2.605.973 4.103 4.103 0 00-6.993 3.738A11.65 11.65 0 013.292 4.81a4.077 4.077 0 001.27 5.476A4.07 4.07 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.093 4.093 0 01-1.085.144 3.9 3.9 0 01-.77-.074 4.108 4.108 0 003.834 2.825A8.233 8.233 0 012 18.407 11.616 11.616 0 008.29 20" />
              </svg>
            </Link>
            <Link href="#" className="hover:text-yellow-300" title="GitHub">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297C5.375.297 0 5.67 0 12.297c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.084-.729.084-.729 1.205.084 1.84 1.23 1.84 1.23 1.07 1.835 2.81 1.305 3.495.997.108-.773.418-1.305.76-1.605-2.665-.3-5.467-1.33-5.467-5.93 0-1.31.47-2.38 1.235-3.22-.125-.303-.535-1.523.115-3.176 0 0 1.005-.322 3.3 1.23a11.49 11.49 0 013.005-.405c1.02.005 2.045.138 3.005.405 2.28-1.552 3.285-1.23 3.285-1.23.655 1.653.245 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.625-5.485 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.21.694.825.576C20.565 22.092 24 17.594 24 12.297 24 5.67 18.627.297 12 .297z" />
              </svg>
            </Link>
            <Link href="#" className="hover:text-yellow-300" title="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.8 0-5 2.2-5 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5v-14c0-2.8-2.2-5-5-5zM8 19h-3v-9h3v9zM6.5 8.7c-1 0-1.7-.8-1.7-1.7 0-1 .8-1.7 1.7-1.7 1 0 1.7.8 1.7 1.7s-.7 1.7-1.7 1.7zM20 19h-3v-4.6c0-1.1-.4-1.9-1.5-1.9-.8 0-1.3.5-1.6 1.1-.1.2-.1.5-.1.8v4.6h-3v-9h3v1.2c.4-.6 1.1-1.5 2.7-1.5 2 0 3.5 1.3 3.5 4.1v5.2z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-10 border-t border-teal-600 pt-6 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} Indocs Mails · Built with 💙 by{" "}
        <span className="text-white font-semibold">Indocs <span className='text-[#08b3ca] '>Media</span> </span>
      </div>
    </footer>
  );
};

export default Footer;
