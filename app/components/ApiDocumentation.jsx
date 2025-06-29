import React from 'react';

// This is a React functional component for displaying API documentation.
// It uses Tailwind CSS for styling, assuming Tailwind is configured in your project.
// The content mirrors the HTML structure previously provided for documentation.
export default function ApiDocumentation() {
  return (
    <div className="w-[100%] md:w-auto bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-3xl shadow-2xl max-w-4xl mx-auto md:my-10 border border-blue-200">
    <h2 className="text-2xl font-extrabold text-center text-blue-700 mb-8 pb-4 border-b-4 border-blue-300 transform transition duration-300">
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
          <h4 className="text-xl font-semibold text-blue-700 mb-2">1. HTML Example:</h4>
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
  );
}

