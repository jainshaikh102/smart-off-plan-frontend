import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    // Backend URL
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const backendApiUrl = `${backendUrl}/api/properties/unit-types`;

    const backendResponse = await fetch(backendApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(
        "❌ Backend unit types API error:",
        backendResponse.status,
        errorText
      );

      return NextResponse.json(
        {
          success: false,
          error: "Backend API error",
          message: `Failed to fetch unit types from backend: ${backendResponse.status} ${backendResponse.statusText}`,
          details: errorText,
        },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    // console.log("✅ Unit types fetched successfully:", {
    //   success: backendData.success,
    //   dataLength: Array.isArray(backendData.data)
    //     ? backendData.data.length
    //     : "N/A",
    // });

    return NextResponse.json(backendData);
  } catch (error) {
    console.error("❌ Frontend unit types API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
