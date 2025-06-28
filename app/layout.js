import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Navbar from "./components/Navbar";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Indocs Mails | Free Mail API Keys",
  description: "Generates free mail api keys for your applications",
  icons: {
    icon: "/logo.webp", // ✅ or /favicon.png or any path in public
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
      </body>
    </html>
  );
}
