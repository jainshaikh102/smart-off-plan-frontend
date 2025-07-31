import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

    console.log("🔗 [ALL-PROPERTIES] Primary backend API:", primaryApiUrl);
    console.log("🔗 [ALL-PROPERTIES] Fallback backend API:", fallbackApiUrl);

    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log("⏰ [ALL-PROPERTIES] Request timeout after 60 seconds");
      controller.abort();
    }, 60000); // 60 seconds timeout

    try {
      let backendResponse;
      let usedFallback = false;

      // Try primary backend first
      try {
        console.log("🔄 [ALL-PROPERTIES] Trying primary backend...");
        backendResponse = await fetch(primaryApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!backendResponse.ok) {
          throw new Error(`Primary backend failed: ${backendResponse.status}`);
        }
        console.log(
          "✅ [ALL-PROPERTIES] Primary backend responded successfully"
        );
      } catch (primaryError) {
        console.log(
          "⚠️ [ALL-PROPERTIES] Primary backend failed, trying fallback..."
        );
        console.log("Primary error:", primaryError);

        // Try fallback backend
        try {
          backendResponse = await fetch(fallbackApiUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            signal: controller.signal,
            next: { revalidate: 300 }, // Cache for 5 minutes
          });
          usedFallback = true;
          console.log(
            "✅ [ALL-PROPERTIES] Fallback backend responded successfully"
          );
        } catch (fallbackError) {
          console.error("❌ [ALL-PROPERTIES] Both backends failed");
          throw fallbackError;
        }
      }

      // Clear timeout if request completes successfully
      clearTimeout(timeoutId);

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
        } properties (no pagination) using ${
          usedFallback ? "fallback" : "primary"
        } backend`
      );

      return NextResponse.json(data);
    } catch (fetchError) {
      // Clear timeout in case of error
      clearTimeout(timeoutId);

      // Handle specific timeout error
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        console.error("⏰ [ALL-PROPERTIES] Request timed out after 60 seconds");
        return NextResponse.json(
          {
            success: false,
            error: "Request timeout",
            message: "The request took too long to complete. Please try again.",
          },
          { status: 408 } // Request Timeout
        );
      }

      // Re-throw other fetch errors to be handled by outer catch
      throw fetchError;
    }
  } catch (error) {
    console.error("❌ [ALL-PROPERTIES] Error in frontend API:", error);

    // Determine error type and provide appropriate message
    let errorMessage = "Failed to fetch all properties";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "Request timed out. Please try again.";
        statusCode = 408;
      } else if (error.message.includes("fetch")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
        statusCode = 503;
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
