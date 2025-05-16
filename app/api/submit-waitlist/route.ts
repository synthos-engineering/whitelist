import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
})

export async function POST(request: Request) {
  try {
    const { email, occupation, platform } = await request.json()

    // Store in database (you can replace this with your actual database logic)
    // For now, we'll just log it
    console.log("Storing submission:", { email, occupation, platform })

    // Send confirmation email
    const mailOptions = {
      from: {
        name: "SynthOS Team",
        address: process.env.EMAIL_USER as string
      },
      to: email,
      subject: "Welcome to SynthOS Waitlist! 🚀",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a103c; color: white;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; font-size: 28px; margin-bottom: 10px;">Welcome to SynthOS! 🚀</h1>
            <p style="color: #e9d5ff; font-size: 16px;">AI Agents for DeFi</p>
          </div>
          
          <div style="background-color: #2a1b4a; padding: 24px; border-radius: 12px; margin-bottom: 24px; border: 1px solid rgba(147, 51, 234, 0.3);">
            <p style="color: white; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining our waitlist! We're excited to have you on board.
            </p>

            <div style="background-color: rgba(147, 51, 234, 0.1); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #e9d5ff; margin: 0 0 8px 0;">Your Details:</p>
              <p style="color: white; margin: 0; line-height: 1.6;">
                • Occupation: ${occupation}<br>
                • Preferred Platform: ${platform}
              </p>
            </div>

            <p style="color: white; line-height: 1.6;">
              We'll keep you updated on our progress and let you know when early access becomes available.
            </p>
          </div>

          <div style="background-color: #2a1b4a; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 24px; border: 1px solid rgba(147, 51, 234, 0.3);">
            <p style="color: #e9d5ff; margin: 0 0 12px 0;">Stay Connected</p>
            <div>
              <a href="https://x.com/SynthOS__" style="display: inline-block; padding: 8px 20px; background-color: rgba(147, 51, 234, 0.2); color: white; text-decoration: none; border-radius: 20px; margin: 0 8px;">Twitter</a>
              <a href="https://t.me/+x8mewakKNJNmY2Nl" style="display: inline-block; padding: 8px 20px; background-color: rgba(147, 51, 234, 0.2); color: white; text-decoration: none; border-radius: 20px; margin: 0 8px;">Telegram</a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #a855f7; font-size: 12px; margin: 0;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing submission:", error)
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    )
  }
} 