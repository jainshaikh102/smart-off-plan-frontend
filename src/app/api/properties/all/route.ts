import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/properties/all - Get all properties without pagination
 * 
 * This endpoint returns ALL properties from the database without pagination.
 * Useful for cases where you need all properties at once (e.g., for maps, exports, analytics, etc.)
 * 
 * Query Parameters:
 * - All the same filtering parameters as the main /api/properties endpoint
 * - NO pagination parameters (page, limit) - returns all matching results
 * 
 * @param request - NextRequest object containing query parameters
 * @returns NextResponse with all matching properties (no pagination)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    // Backend URL
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const backendApiUrl = `${backendUrl}/api/properties/all${
      queryString ? `?${queryString}` : ""
    }`;

    console.log("🔗 [ALL-PROPERTIES] Calling backend API:", backendApiUrl);

    const backendResponse = await fetch(backendApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!backendResponse.ok) {
      console.error(
        `❌ Backend API error: ${backendResponse.status} ${backendResponse.statusText}`
      );
      return NextResponse.json(
        {
          success: false,
          error: "Backend API error",
          message: `Failed to fetch properties: ${backendResponse.status} ${backendResponse.statusText}`,
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();

    console.log(
      `✅ [ALL-PROPERTIES] Successfully fetched ${
        data.data?.length || 0
      } properties (no pagination)`
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ [ALL-PROPERTIES] Error in frontend API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch all properties",
      },
      { status: 500 }
    );
  }
}
