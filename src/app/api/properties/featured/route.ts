import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/properties/featured - Get featured properties
 *
 * This endpoint specifically fetches properties marked as featured=true
 * Useful for debugging and ensuring featured properties are properly filtered
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Add featured=true to the query parameters
    const params = new URLSearchParams(searchParams);
    params.set("featured", "true");

    const queryString = params.toString();

    // Backend URL with fallback for development
    const primaryBackendUrl =
      process.env.BACKEND_URL || "http://localhost:5000";
    const fallbackBackendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://smart-off-plan-backend-436741085428.europe-west1.run.app";

    const primaryApiUrl = `${primaryBackendUrl}/api/properties${
      queryString ? `?${queryString}` : "?featured=true"
    }`;
    const fallbackApiUrl = `${fallbackBackendUrl}/api/properties${
      queryString ? `?${queryString}` : "?featured=true"
    }`;

    console.log("🌟 [FEATURED] Primary backend API:", primaryApiUrl);
    console.log("🌟 [FEATURED] Fallback backend API:", fallbackApiUrl);

    try {
      let backendResponse;
      let usedFallback = false;

      // Try primary backend first
      try {
        console.log("🔄 [FEATURED] Trying primary backend...");
        backendResponse = await fetch(primaryApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store", // No caching for featured properties
        });

        if (!backendResponse.ok) {
          throw new Error(`Primary backend failed: ${backendResponse.status}`);
        }
      } catch (primaryError) {
        console.log("⚠️ [FEATURED] Primary backend failed, trying fallback...");
        console.log("Primary error:", primaryError);

        // Try fallback backend
        backendResponse = await fetch(fallbackApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!backendResponse.ok) {
          throw new Error(
            `Fallback backend also failed: ${backendResponse.status}`
          );
        }

        usedFallback = true;
      }

      const data = await backendResponse.json();

      console.log(
        `✅ [FEATURED] Successfully fetched ${
          data.data?.length || 0
        } featured properties using ${
          usedFallback ? "fallback" : "primary"
        } backend`
      );

      // Add debug information to response
      return NextResponse.json({
        ...data,
        debug: {
          usedFallback,
          apiUrl: usedFallback ? fallbackApiUrl : primaryApiUrl,
          queryParams: Object.fromEntries(params.entries()),
        },
      });
    } catch (fetchError) {
      console.error("❌ [FEATURED] Fetch error:", fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error("❌ [FEATURED] Featured properties API error:", error);
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
