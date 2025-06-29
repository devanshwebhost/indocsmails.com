// components/Footer.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import DeleteAccountSection from "./DeleteAccountSection"; // client-side component
import Link from "next/link";

export default async function Footer() {
  const session = await getServerSession(authOptions);

  let user = null;
  if (session?.user?.email) {
    await connectDB();
    user = await User.findOne({ email: session.user.email }).lean();
  }

  return (
    <footer className="bg-gradient-to-tr from-cyan-800 to-teal-700 text-white px-6 py-10">
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

      <div className="mt-10 border-t border-teal-600 pt-6 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} Indocs Mails · Built with 💙 by{" "}
        <span className="text-white font-semibold">Indocs <span className='text-[#08b3ca] '>Media</span> </span>
      </div>
    </footer>
  );
}
