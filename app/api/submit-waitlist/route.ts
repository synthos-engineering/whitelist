import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/app/lib/mongodb";
import Waitlist from "@/app/models/Waitlist";

// Create transporter with more detailed configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  debug: true, // Enable debug logging
  logger: true, // Enable logger
});

export async function POST(request: Request) {
  try {
    const { email, occupation, platform } = await request.json();

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    try {
      await dbConnect();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        {
          error: "Database connection error",
          details: dbError instanceof Error ? dbError.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    // Check if email already exists
    try {
      const existingEntry = await Waitlist.findOne({ email });
      if (existingEntry) {
        return NextResponse.json(
          { success: true, alreadyRegistered: true },
          { status: 200 }
        );
      }
    } catch (queryError) {
      console.error("Database query error:", queryError);
      return NextResponse.json(
        {
          error: "Database query error",
          details:
            queryError instanceof Error ? queryError.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    // Create new waitlist entry
    const waitlistEntry = new Waitlist({
      email,
      occupation,
      platform,
    });

    // Save to database
    try {
      await waitlistEntry.save();
      console.log("Saved to database:", waitlistEntry);
    } catch (saveError) {
      console.error("Database save error:", saveError);
      return NextResponse.json(
        {
          error: "Failed to save to database",
          details:
            saveError instanceof Error ? saveError.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    // Log the attempt
    console.log("Attempting to send email to:", email);
    console.log("Using email config:", {
      user: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_APP_PASSWORD,
    });

    // Send confirmation email
    const mailOptions = {
      from: {
        name: "SynthOS Team",
        address: "noreply@synthos-engineering.com", // Use a no-reply address
      },
      to: email, // This is the user's email from the form
      subject: "Welcome to SynthOS Waitlist! 🚀",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; font-size: 28px; margin-bottom: 10px;">Welcome to SynthOS! 🚀</h1>
          </div>
          
          <div style="background-color: #f9f5ff; padding: 24px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #e9d5ff;">
            <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining our waitlist! We're excited to have you on board.
            </p>

            <div style="background-color: #f3e8ff; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #6b21a8; margin: 0 0 8px 0;">Your Details:</p>
              <p style="color: #333; margin: 0; line-height: 1.6;">
                • Occupation: ${occupation}<br>
                • Preferred Platform: ${platform}
              </p>
            </div>

            <p style="color: #333; line-height: 1.6;">
              We'll keep you updated on our progress and let you know when early access becomes available.
            </p>
          </div>

          <div style="background-color: #f9f5ff; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 24px; border: 1px solid #e9d5ff;">
            <p style="color: #6b21a8; margin: 0 0 12px 0;">Stay Connected</p>
            <div>
              <a href="https://x.com/SynthOS__" style="display: inline-block; padding: 8px 20px; background-color: #9333ea; color: white; text-decoration: none; border-radius: 20px; margin: 0 8px;">Twitter</a>
              <a href="https://t.me/+x8mewakKNJNmY2Nl" style="display: inline-block; padding: 8px 20px; background-color: #9333ea; color: white; text-decoration: none; border-radius: 20px; margin: 0 8px;">Telegram</a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #9333ea; font-size: 12px; margin: 0;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError);
      return NextResponse.json(
        {
          error: "Email service configuration error",
          details:
            verifyError instanceof Error
              ? verifyError.message
              : "Unknown error",
        },
        { status: 500 }
      );
    }

    // Send the email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return NextResponse.json(
        {
          error: "Failed to send confirmation email",
          details:
            emailError instanceof Error ? emailError.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Detailed error in submission:", error);
    return NextResponse.json(
      {
        error: "Failed to process submission",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
