// app/page.jsx (server component)
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import ClientDashboard from "../components/ClientDashboard"; // your current form UI
import ControlPanelClient from "../ControlPanel/ControlPanelClient"; 
import DynamicContactForm1 from "../DynamicContactForms(users)/DynamicContactForm1";
import CodePreviewer from "../components/CodePreviewer"; // your code preview component
import ApiDocumentation from "../components/ApiDocumentation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 to-cyan-800 text-white text-center p-6">
        <div className="bg-white shadow-md p-6 rounded-xl text-center max-w-sm w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-sm text-gray-500 mb-4">You must be logged in to view this page.</p>
          <a href="/login" className="text-green-900 hover:underline text-sm">Go to Login</a>
        </div>
      </div>
    );
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email }).lean();

  return (
  <div className=" overflow-hidden min-h-screen bg-gradient-to-br from-teal-700 to-cyan-800 flex flex-col items-center py-5 justify-center mb:py-10">
    <ClientDashboard user={user} />
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen py-2 md:py-10 gap-6">
    <ControlPanelClient user={user} />
    <DynamicContactForm1 user={user} />
    </div>
    <div className="w-[100%] md:w-auto flex flex-col md:flex-row items-center justify-center min-h-screen md:py-5" >
    <CodePreviewer defaultLanguage="html" />
    {/* <ApiDocumentation/> */}
    </div>

  </div>
);

}
