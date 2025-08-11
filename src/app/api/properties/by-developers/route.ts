import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/properties/by-developers - Get properties grouped by developers with pagination
 * 
 * This endpoint returns properties organized by developers, allowing progressive loading
 * by developer instead of by individual properties. This can be efficient for map loading
 * as it groups properties by their developers.
 * 
 * Query Parameters:
 * - page: Page number for developer pagination (default: 1)
 * - limit: Number of developers per page (default: 5)
 * - properties_per_developer: Max properties per developer (default: 50)
 * - All other filtering parameters from the main properties endpoint
 * 
 * @param request - NextRequest object containing query parameters
 * @returns NextResponse with properties grouped by developers
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract developer pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const propertiesPerDeveloper = parseInt(searchParams.get("properties_per_developer") || "50", 10);
    
    // Remove developer pagination params and pass the rest to backend
    const backendParams = new URLSearchParams(searchParams);
    backendParams.delete("page");
    backendParams.delete("limit");
    backendParams.delete("properties_per_developer");
    
    // Backend URL with fallback for development
    const primaryBackendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const fallbackBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 
      "https://smart-off-plan-backend-436741085428.europe-west1.run.app";

    const primaryApiUrl = `${primaryBackendUrl}/api/properties/by-developers?${backendParams.toString()}&page=${page}&limit=${limit}&properties_per_developer=${propertiesPerDeveloper}`;
    const fallbackApiUrl = `${fallbackBackendUrl}/api/properties/by-developers?${backendParams.toString()}&page=${page}&limit=${limit}&properties_per_developer=${propertiesPerDeveloper}`;

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
        console.error("❌ Both backends failed for by-developers endpoint");
        throw fallbackError;
      }
    }

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error("❌ Backend by-developers API error:", backendResponse.status, errorText);

      return NextResponse.json(
        {
          success: false,
          error: "Backend API error",
          message: `Failed to fetch properties by developers: ${backendResponse.status} ${backendResponse.statusText}`,
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
    console.error("❌ Error in by-developers API route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch properties by developers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
