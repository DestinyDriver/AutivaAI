import { supabase } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return Response.json(
        { error: "Verification token is required" },
        { status: 400 },
      );
    }

    // Find user by verification token
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("id, email, verification_token_expiry, is_email_verified")
      .eq("verification_token", token)
      .single();

    if (fetchError || !user) {
      return Response.json(
        { error: "Invalid or expired verification token" },
        { status: 400 },
      );
    }

    // Check if email already verified
    if (user.is_email_verified) {
      return Response.json(
        { error: "Email already verified" },
        { status: 400 },
      );
    }

    // Check if token expired
    const tokenExpiry = new Date(user.verification_token_expiry).getTime();
    if (Date.now() > tokenExpiry) {
      return Response.json(
        { error: "Verification token has expired. Please request a new one." },
        { status: 400 },
      );
    }

    // Mark email as verified and clear verification token
    const { error: updateError } = await supabase
      .from("users")
      .update({
        is_email_verified: true,
        verification_token: null,
        verification_token_expiry: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return Response.json(
        { error: "Failed to verify email" },
        { status: 500 },
      );
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.email.split("@")[0]);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
      // Don't fail verification if welcome email fails
    }

    return Response.json(
      {
        success: true,
        message: "Email verified successfully! You can now login.",
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verification error:", error);
    return Response.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

// GET endpoint to verify token from email link
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return Response.json(
        { error: "Verification token is required" },
        { status: 400 },
      );
    }

    // Find user by verification token
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("id, email, verification_token_expiry, is_email_verified")
      .eq("verification_token", token)
      .single();

    if (fetchError || !user) {
      return Response.json(
        { error: "Invalid or expired verification token" },
        { status: 400 },
      );
    }

    // Check if email already verified
    if (user.is_email_verified) {
      return Response.json(
        { error: "Email already verified" },
        { status: 400 },
      );
    }

    // Check if token expired
    const tokenExpiry = new Date(user.verification_token_expiry).getTime();
    if (Date.now() > tokenExpiry) {
      return Response.json(
        { error: "Verification token has expired. Please request a new one." },
        { status: 400 },
      );
    }

    // Mark email as verified and clear verification token
    const { error: updateError } = await supabase
      .from("users")
      .update({
        is_email_verified: true,
        verification_token: null,
        verification_token_expiry: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return Response.json(
        { error: "Failed to verify email" },
        { status: 500 },
      );
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.email.split("@")[0]);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
    }

    return Response.json(
      {
        success: true,
        message: "Email verified successfully! You can now login.",
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verification error:", error);
    return Response.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
