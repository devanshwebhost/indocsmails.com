import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, phone, address, agree } = body;

    if (!email || !password || !firstName || !agree) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate API key securely
    const apiKey = crypto.randomBytes(32).toString("hex");

    // ✅ Save user with API key
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      address,
      emailVerified: false,
      apiKey, // <-- store it
    });

    // 🔐 Email Verification Token
    const token = jwt.sign(
      { email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const url = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;

    // 📧 Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your email",
      html: `<p>Click below to verify your email:</p><a href="${url}">Verify Email</a>`,
    });

    return Response.json({
      message: "Signup successful, verify your email",
      apiKey, // (optional) return it temporarily for dev testing
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
