import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Here you would:
    // 1. Store the email in your database
    // 2. Send a welcome email using a service like SendGrid, Mailchimp, etc.

    // For demonstration, we're just returning a success response
    // In a real application, you would integrate with an email service

    console.log(`Subscription request for: ${email}`)

    return NextResponse.json({ success: true, message: "Subscription successful" }, { status: 200 })
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({ error: "Failed to process subscription" }, { status: 500 })
  }
}
