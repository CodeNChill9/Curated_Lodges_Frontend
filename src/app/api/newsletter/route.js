import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";

// ── POST /api/newsletter  →  subscribe to newsletter ──────────────────
export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({
      email: email.trim().toLowerCase()
    });

    if (existingSubscription) {
      if (existingSubscription.active) {
        return NextResponse.json(
          { success: false, error: "This email is already subscribed" },
          { status: 409 }
        );
      } else {
        // Reactivate inactive subscription
        existingSubscription.active = true;
        await existingSubscription.save();
        return NextResponse.json({
          success: true,
          message: "Welcome back! Your subscription has been reactivated"
        });
      }
    }

    // Create new subscription
    await Newsletter.create({
      email: email.trim().toLowerCase(),
      source: 'footer'
    });

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "This email is already subscribed" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}
