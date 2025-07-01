import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { area: string } }
) {
  try {
    const { area } = params;

    if (!area) {
      return NextResponse.json(
        {
          success: false,
          error: "Bad request",
          message: "Area name is required",
        },
        { status: 400 }
      );
    }

    // Decode the area name from URL encoding
    const decodedArea = decodeURIComponent(area);

    // Get properties by area from backend database
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const backendApiUrl = `${backendUrl}/api/properties/by-area/${encodeURIComponent(decodedArea)}`;

    console.log(`🏙️ [AREA] Fetching properties in area "${decodedArea}" from backend database:`, backendApiUrl);

    const backendResponse = await fetch(backendApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error("❌ Backend area API error:", backendResponse.status, errorText);
      
      return NextResponse.json(
        {
          success: false,
          error: "Database API error",
          message: `Failed to fetch properties by area from database: ${backendResponse.status} ${backendResponse.statusText}`,
          details: errorText,
          apiUrl: backendApiUrl,
        },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    console.log(`✅ [AREA] Properties in "${decodedArea}" fetched successfully:`, {
      success: backendData.success,
      dataLength: Array.isArray(backendData.data) ? backendData.data.length : "N/A",
    });

    return NextResponse.json(backendData);
  } catch (error) {
    console.error("❌ Area properties API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An unexpected error occurred while fetching properties by area.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
