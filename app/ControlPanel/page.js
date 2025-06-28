// app/ControlPanel/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import ControlPanelClient from "./ControlPanelClient";

export default async function ControlPanelPage() {
  await connectDB();
  const session = await getServerSession(authOptions);

  const user = await User.findOne({ email: session?.user?.email }).lean();

  return <ControlPanelClient user={user} />;
}
