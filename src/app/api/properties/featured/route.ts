import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    // Get featured properties from backend database
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const backendApiUrl = `${backendUrl}/api/properties/featured${
      queryString ? `?${queryString}` : ""
    }`;

    console.log(
      "🌟 [FEATURED] Fetching featured properties from backend database:",
      backendApiUrl
    );

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
        "❌ Backend featured properties API error:",
        backendResponse.status,
        errorText
      );

      return NextResponse.json(
        {
          success: false,
          error: "Database API error",
          message: `Failed to fetch featured properties from database: ${backendResponse.status} ${backendResponse.statusText}`,
          details: errorText,
          apiUrl: backendApiUrl,
        },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    console.log("✅ [FEATURED] Featured properties fetched successfully:", {
      success: backendData.success,
      dataLength: Array.isArray(backendData.data)
        ? backendData.data.length
        : "N/A",
    });

    return NextResponse.json(backendData);
  } catch (error) {
    console.error("❌ Featured properties API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message:
          "An unexpected error occurred while fetching featured properties.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
