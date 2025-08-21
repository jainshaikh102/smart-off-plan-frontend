import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["name", "email", "message"];
    const missingFields = requiredFields.filter((field) => !body[field] || String(body[field]).trim().length === 0);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: `The following fields are required: ${missingFields.join(", ")}`,
          missingFields,
        },
        { status: 400 }
      );
    }

    // Backend URL (server-side; avoids browser CORS)
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const backendApiUrl = `${backendUrl}/api/email/contact-us`;

    // Forward the request to the backend
    const backendResponse = await fetch(backendApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: String(body.name).trim(),
        email: String(body.email).trim(),
        phone: body.phone ? String(body.phone).trim() : "",
        message: String(body.message).trim(),
      }),
    });

    const data = await backendResponse.json().catch(() => ({}));

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error || "Backend error",
          message: data?.message || `Backend returned ${backendResponse.status}`,
          details: data?.details,
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("❌ Error in contact-us proxy API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An unexpected error occurred while sending the contact email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

