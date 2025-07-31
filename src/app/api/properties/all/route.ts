import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 900; // 15 minutes maximum duration (increased for large datasets)
export const fetchCache = "force-no-store"; // Disable all caching

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

    // Backend URL with fallback for development
    const primaryBackendUrl =
      process.env.BACKEND_URL || "http://localhost:5000";
    const fallbackBackendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://smart-off-plan-backend-436741085428.europe-west1.run.app";

    const primaryApiUrl = `${primaryBackendUrl}/api/properties/all${
      queryString ? `?${queryString}` : ""
    }`;
    const fallbackApiUrl = `${fallbackBackendUrl}/api/properties/all${
      queryString ? `?${queryString}` : ""
    }`;

    // console.log("🔗 [ALL-PROPERTIES] Primary backend API:", primaryApiUrl);
    // console.log("🔗 [ALL-PROPERTIES] Fallback backend API:", fallbackApiUrl);

    // No timeout - let the request take as long as needed
    // console.log("⏳ [ALL-PROPERTIES] No timeout set - waiting for response...");

    try {
      let backendResponse;
      let usedFallback = false;

      // Try primary backend first
      try {
        // console.log("🔄 [ALL-PROPERTIES] Trying primary backend...");
        backendResponse = await fetch(primaryApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store", // No caching
        });

        if (!backendResponse.ok) {
          throw new Error(`Primary backend failed: ${backendResponse.status}`);
        }
        // console.log(
        //   "✅ [ALL-PROPERTIES] Primary backend responded successfully"
        // );
      } catch (primaryError) {
        // console.log(
        //   "⚠️ [ALL-PROPERTIES] Primary backend failed, trying fallback..."
        // );
        console.log("Primary error:", primaryError);

        // Try fallback backend
        try {
          backendResponse = await fetch(fallbackApiUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store", // No caching
          });
          usedFallback = true;
          // console.log(
          //   "✅ [ALL-PROPERTIES] Fallback backend responded successfully"
          // );
        } catch (fallbackError) {
          console.error("❌ [ALL-PROPERTIES] Both backends failed");
          throw fallbackError;
        }
      }

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

      // console.log(
      //   `✅ [ALL-PROPERTIES] Successfully fetched ${
      //     data.data?.length || 0
      //   } properties (no pagination) using ${
      //     usedFallback ? "fallback" : "primary"
      //   } backend`
      // );

      return NextResponse.json(data);
    } catch (fetchError) {
      console.error("❌ [ALL-PROPERTIES] Fetch error:", fetchError);

      // Re-throw fetch errors to be handled by outer catch
      throw fetchError;
    }
  } catch (error) {
    console.error("❌ [ALL-PROPERTIES] Error in frontend API:", error);

    // Determine error type and provide appropriate message
    let errorMessage = "Failed to fetch all properties";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("fetch")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
        statusCode = 503;
      } else {
        errorMessage = error.message || "Unknown error occurred";
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: errorMessage,
      },
      { status: statusCode }
    );
  }
}
