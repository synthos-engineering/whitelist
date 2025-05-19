import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Waitlist from "@/app/models/Waitlist";

const MAX_WAITLIST_SPOTS = 50; // Set your desired maximum number of spots

export async function GET() {
  try {
    await dbConnect();

    // Get the total count of waitlist entries
    const totalEntries = await Waitlist.countDocuments();

    // Calculate remaining spots
    const remainingSpots = Math.max(0, MAX_WAITLIST_SPOTS - totalEntries);

    return NextResponse.json({ remainingSpots });
  } catch (error) {
    console.error("Error fetching waitlist count:", error);
    return NextResponse.json(
      { error: "Failed to fetch waitlist count" },
      { status: 500 }
    );
  }
}
