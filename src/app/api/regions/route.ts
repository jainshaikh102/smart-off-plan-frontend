import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("🌍 Frontend regions API called");

    // Reelly API configuration
    const reallyApiUrl = "https://search-listings-production.up.railway.app/v1/regions";
    const apiKey = "reelly-680ffbdd-FEuCzeraBCN5dtByJeLb8AeCesrTvlFz";

    console.log("🔗 Calling Reelly API:", reallyApiUrl);

    const response = await fetch(reallyApiUrl, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        "accept": "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour since regions don't change frequently
    });

    if (!response.ok) {
      console.error(
        "❌ Reelly API error:",
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
    console.log("✅ Successfully fetched regions from Reelly API");
    console.log("📊 Regions count:", Array.isArray(data) ? data.length : "Unknown");

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
