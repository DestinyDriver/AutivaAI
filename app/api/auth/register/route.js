import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { sendVerificationEmail } from "@/lib/email";

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate password length
function isValidPassword(password) {
  return password.length >= 8;
}

// Generate verification token
function generateVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword } = body;

    // Validate input
    if (!email || !password || !confirmPassword) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!isValidPassword(password)) {
      return Response.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return Response.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 means "no rows found" which is what we want
      console.error("Database error:", fetchError);
      return Response.json(
        { error: "An error occurred while checking your email" },
        { status: 500 },
      );
    }

    if (existingUser) {
      return Response.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    // Hash password with bcryptjs (10 salt rounds for security)
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user in Supabase
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email: email.toLowerCase(),
          password_hash: passwordHash,
          is_email_verified: false,
          verification_token: verificationToken,
          verification_token_expiry: new Date(
            verificationTokenExpiry,
          ).toISOString(),
        },
      ])
      .select("id, email");

    if (insertError) {
      console.error("Insert error:", insertError);
      return Response.json(
        { error: "Failed to create user account" },
        { status: 500 },
      );
    }

    // Send verification email
    try {
      await sendVerificationEmail(email.toLowerCase(), verificationToken);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the registration if email sending fails
      // The user can request a resend later
    }

    // Return success (do NOT return password hash or any sensitive data)
    return Response.json(
      {
        success: true,
        message:
          "User registered successfully. Check your email to verify your account.",
        user: {
          id: newUser[0].id,
          email: newUser[0].email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return Response.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
