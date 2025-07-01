import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { developer: string } }
) {
  try {
    const { developer } = params;

    if (!developer) {
      return NextResponse.json(
        {
          success: false,
          error: "Bad request",
          message: "Developer name is required",
        },
        { status: 400 }
      );
    }

    // Decode the developer name from URL encoding
    const decodedDeveloper = decodeURIComponent(developer);

    // Get properties by developer from backend database
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const backendApiUrl = `${backendUrl}/api/properties/by-developer/${encodeURIComponent(decodedDeveloper)}`;

    console.log(`🏢 [DEVELOPER] Fetching properties by developer "${decodedDeveloper}" from backend database:`, backendApiUrl);

    const backendResponse = await fetch(backendApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error("❌ Backend developer API error:", backendResponse.status, errorText);
      
      return NextResponse.json(
        {
          success: false,
          error: "Database API error",
          message: `Failed to fetch properties by developer from database: ${backendResponse.status} ${backendResponse.statusText}`,
          details: errorText,
          apiUrl: backendApiUrl,
        },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    console.log(`✅ [DEVELOPER] Properties by "${decodedDeveloper}" fetched successfully:`, {
      success: backendData.success,
      dataLength: Array.isArray(backendData.data) ? backendData.data.length : "N/A",
    });

    return NextResponse.json(backendData);
  } catch (error) {
    console.error("❌ Developer properties API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An unexpected error occurred while fetching properties by developer.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
