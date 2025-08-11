import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/properties/by-areas - Get properties grouped by areas with pagination
 * 
 * This endpoint returns properties organized by areas, allowing progressive loading
 * by area instead of by individual properties. This can be more efficient for map loading
 * as it reduces the number of API calls needed.
 * 
 * Query Parameters:
 * - page: Page number for area pagination (default: 1)
 * - limit: Number of areas per page (default: 5)
 * - properties_per_area: Max properties per area (default: 50)
 * - All other filtering parameters from the main properties endpoint
 * 
 * @param request - NextRequest object containing query parameters
 * @returns NextResponse with properties grouped by areas
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract area pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const propertiesPerArea = parseInt(searchParams.get("properties_per_area") || "50", 10);
    
    // Remove area pagination params and pass the rest to backend
    const backendParams = new URLSearchParams(searchParams);
    backendParams.delete("page");
    backendParams.delete("limit");
    backendParams.delete("properties_per_area");
    
    // Backend URL with fallback for development
    const primaryBackendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const fallbackBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 
      "https://smart-off-plan-backend-436741085428.europe-west1.run.app";

    const primaryApiUrl = `${primaryBackendUrl}/api/properties/by-areas?${backendParams.toString()}&page=${page}&limit=${limit}&properties_per_area=${propertiesPerArea}`;
    const fallbackApiUrl = `${fallbackBackendUrl}/api/properties/by-areas?${backendParams.toString()}&page=${page}&limit=${limit}&properties_per_area=${propertiesPerArea}`;

    let backendResponse: Response;
    let usedFallback = false;

    try {
      backendResponse = await fetch(primaryApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
    } catch (primaryError) {
      console.log("Primary backend failed, trying fallback...");
      
      try {
        backendResponse = await fetch(fallbackApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
        usedFallback = true;
      } catch (fallbackError) {
        console.error("❌ Both backends failed for by-areas endpoint");
        throw fallbackError;
      }
    }

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error("❌ Backend by-areas API error:", backendResponse.status, errorText);

      return NextResponse.json(
        {
          success: false,
          error: "Backend API error",
          message: `Failed to fetch properties by areas: ${backendResponse.status} ${backendResponse.statusText}`,
          details: errorText,
          apiUrl: usedFallback ? fallbackApiUrl : primaryApiUrl,
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();

    // Add metadata about which backend was used
    if (data.success) {
      data.metadata = {
        ...data.metadata,
        backend_used: usedFallback ? "fallback" : "primary",
        api_url: usedFallback ? fallbackApiUrl : primaryApiUrl,
      };
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error in by-areas API route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch properties by areas",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
