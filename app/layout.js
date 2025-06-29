import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Navbar from "./components/Navbar";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Indocs Mails | Free Email API for Developers & Internal Alerts",
   verification: {
    google: 'pZDCYRhm4DgxnB-1-n5iE0zPl9DinbP5VwfOMN1hYpU', // ✅ Correct spot
  },
  description:
    "Indocs Mails is a free and powerful email API for developers to send transactional emails, internal notifications, alerts, and reports programmatically using Python, Node.js, Java, PHP, Ruby, C#, Go, and more.",
  keywords: [
    "Email API",
    "Send email programmatically",
    "Email integration API",
    "Email sending service",
    "Transactional email API",
    "Email delivery API",
    "SMTP API",
    "Internal email notification API",
    "System alert email API",
    "Automated internal email sending",
    "API for sending internal reports",
    "Email API for documentation updates",
    "Internal communication email API",
    "Enterprise email API for alerts",
    "Email API for team notifications",
    "Send internal memos via API",
    "Email API for IT alerts",
    "Free email sending API",
    "Email API for developers",
    "Email API with free tier",
    "Low-cost email API",
    "Affordable email sending service",
    "Email API deliverability",
    "Email API analytics",
    "Email API reporting",
    "Email template API",
    "Email API for microservices",
    "Secure email API",
    "Email API with webhook support",
    "Email API rate limits",
    "Email sending solution",
    "Developer email API",
    "Email service provider API",
    "Cloud email API",
    "REST API for email",
    "Email notification service",
    "Programmatic email delivery",
    "How to send email from Python",
    "How to send email from Node.js",
    "How to send email from Java",
    "How to send email from PHP",
    "How to send email from Ruby",
    "How to send email from C#",
    "How to send email from Go",
    "How to automate internal email notifications?",
    "How to integrate email into internal application?",
    "How to send email from script?",
    "What is the best email API for internal use?",
    "What are free email sending APIs?",
    "What is transactional email API?",
    "Why use an email API for internal communications?",
    "How to improve email deliverability for internal alerts?",
    "How to track internal email opens?",
    "How to send emails without SMTP server?",
    "How to choose an email API for enterprise?",
    "Is there a free API for sending internal emails?",
    "Can I send internal documents via email API?",
    "What are the rate limits for free email APIs?",
    "How to manage email templates with an API?"
  ],
  openGraph: {
    title: "Indocs Mails | Free Email API for Developers",
    description:
      "Send transactional and internal emails easily via REST API using Indocs Mails. Built for developers. Works with Python, Node.js, PHP, Java, Ruby, and more.",
    url: "https://indocsmails.onrender.com",
    siteName: "Indocs Mails",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Indocs Mails – Email API Dashboard",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indocs Mails – Free Email API for Developers",
    description:
      "A secure and developer-first email API for sending internal notifications, transactional emails, and alerts. Free tier included.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo.webp",
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-teal-700 to-cyan-800`}>
         <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
        {/* <Navbar/> */}
        {children}
        <Footer/>
      </body>
    </html>
  );
}
