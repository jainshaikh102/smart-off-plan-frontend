import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("🛒 Frontend sale-statuses API called");

    // Backend URL
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const backendApiUrl = `${backendUrl}/api/properties/sale-statuses`;

    console.log("🔗 Calling backend API:", backendApiUrl);

    const backendResponse = await fetch(backendApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!backendResponse.ok) {
      console.error("❌ Backend API error:", backendResponse.status, backendResponse.statusText);
      return NextResponse.json(
        {
          success: false,
          error: "Backend API error",
          message: `Backend returned ${backendResponse.status}: ${backendResponse.statusText}`,
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log("✅ Successfully fetched sale statuses from backend");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error in sale-statuses API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
