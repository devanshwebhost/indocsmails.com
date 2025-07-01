'use client';

import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-green-600">
      <h1 className="text-3xl font-bold text-center mb-6">📜 Terms and Conditions – Indocs Mails</h1>

      <div className="space-y-6 text-black-200 leading-relaxed">
        <p>
          By using <strong>Indocs Mails</strong>, you agree to the following terms and conditions related to email delivery, authentication, and usage of third-party credentials such as <strong>App Passwords</strong>.
        </p>

        <h2 className="text-xl font-semibold text-teal-300">🔐 App Password Handling</h2>
        <p>
          Indocs Mails allows you to use your own email's <strong>App Password</strong> (for example, Gmail app password) to send emails from your account using our API or services. This app password is provided by you and used solely for authenticating your sender identity.
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>We never store your app password in plain text.</li>
          <li>Passwords are encrypted and used only for sending your emails.</li>
          <li>You may update or remove your credentials at any time.</li>
        </ul>

        <h2 className="text-xl font-semibold text-teal-300">⚠️ Responsibility and Liability</h2>
        <p>
          <strong>Indocs Mails is not responsible</strong> for any misuse, abuse, or leakage of your provided App Passwords. You are solely responsible for maintaining the confidentiality of your email account and its credentials.
        </p>
        <p className="text-red-300 font-medium">
          If your app password is compromised and someone sends unauthorized emails through Indocs Mails or directly through your account — we are not liable in any way.
        </p>
        <p>
          It is your responsibility to:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>Keep your email and password safe.</li>
          <li>Monitor your email account activity regularly.</li>
          <li>Immediately revoke the app password if you suspect any misuse.</li>
        </ul>

        <h2 className="text-xl font-semibold text-teal-300">📤 How We Use Your App Password</h2>
        <p>
          The app password is used behind the scenes to authenticate with your email provider (like Gmail SMTP) using the <code>nodemailer</code> library or equivalent. Here’s what happens:
        </p>
        <ol className="list-decimal pl-6 mt-2">
          <li>You provide your email and app password in the control panel.</li>
          <li>The app password is encrypted and stored securely on our server.</li>
          <li>When your form or alert triggers an email, we decrypt your password and send the email on your behalf.</li>
        </ol>

        <p>
          This is similar to using SMTP directly — you’re in full control. We are just a bridge.
        </p>

        <h2 className="text-xl font-semibold text-teal-300">📅 Updates and Changes</h2>
        <p>
          These terms may be updated periodically. You are encouraged to review them regularly. Continued use of the service constitutes acceptance of any changes.
        </p>

        <h2 className="text-xl font-semibold text-teal-300">📩 Contact</h2>
        <p>
          If you have any questions about these terms, please contact us at{" "}
          <a href="mailto:indocsmedia@gmail.com" className="text-cyan-300 underline">indocsmedia@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
