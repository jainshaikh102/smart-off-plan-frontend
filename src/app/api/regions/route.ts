import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    // Backend URL - using database-only approach
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const backendApiUrl = `${backendUrl}/api/regions`;

    const response = await fetch(backendApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour since regions don't change frequently
    });

    if (!response.ok) {
      console.error(
        "❌ Backend API error:",
        response.status,
        response.statusText
      );
      return NextResponse.json(
        {
          success: false,
          error: "Reelly API error",
          message: `Reelly API returned ${response.status}: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    // console.log("✅ Successfully fetched regions from Reelly API");
    // console.log(
    //   "📊 Regions count:",
    //   Array.isArray(data) ? data.length : "Unknown"
    // );

    // Return the data directly as it comes from Reelly API
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error in regions API:", error);
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
