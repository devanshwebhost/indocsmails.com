// app/page.jsx (server component)
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import ClientDashboard from "../components/ClientDashboard"; // your current form UI

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-md p-6 rounded-xl text-center max-w-sm w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-sm text-gray-500 mb-4">You must be logged in to view this page.</p>
          <a href="/login" className="text-blue-600 hover:underline text-sm">Go to Login</a>
        </div>
      </div>
    );
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email }).lean();

  return <ClientDashboard user={user} />;
}
