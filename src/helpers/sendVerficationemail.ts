const nodemailer = require("nodemailer");
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // 1. Ask the render-email API to produce HTML
    // const res = await axios.post(
    //   `${process.env.NEXT_PUBLIC_SITE_URL}/api/render-Email`,
    //   { username, otp: verifyCode },
    //   { headers: { "Content-Type": "application/json" } }
    // );

    
    
    // 2. Nodemailer send
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    
    const htmlContent = `
    <h1>Hello ${username}</h1>
    <p>Your verification code is <strong>${verifyCode}</strong></p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verification Code - MYSTRYMSG",
      html:htmlContent,
    });

    return { success: true, message: "Verification email sent" };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, message: "Failed to send email" };
  }
}
