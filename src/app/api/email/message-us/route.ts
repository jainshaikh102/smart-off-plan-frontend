import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const required = ["name", "email", "subject", "message", "inquiryType"];
    const missing = required.filter((f) => !body[f] || String(body[f]).trim().length === 0);
    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: `The following fields are required: ${missing.join(", ")}`,
          missingFields: missing,
        },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const apiUrl = `${backendUrl}/api/email/message-us`;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(body.name).trim(),
        email: String(body.email).trim(),
        phone: body.phone ? String(body.phone).trim() : "",
        subject: String(body.subject).trim(),
        message: String(body.message).trim(),
        inquiryType: String(body.inquiryType).trim(),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error || "Backend error",
          message: data?.message || `Backend returned ${res.status}`,
          details: data?.details,
        },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("❌ Error in message-us proxy API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An unexpected error occurred while sending the message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

