import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/properties/market-data - Get minimal property data for market calculations
 *
 * This endpoint returns only essential fields needed for MarketInfo component:
 * - id, name, min_price, area
 *
 * This reduces payload size and improves performance while allowing
 * all market calculations to be done on the frontend.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Add fields parameter to get only essential fields
    const params = new URLSearchParams(searchParams);
    params.set("fields", "id,name,min_price,area"); // Only essential fields for market calculations

    const queryString = params.toString();

    // Backend URL with fallback for development
    const primaryBackendUrl =
      process.env.BACKEND_URL || "http://localhost:5000";
    const fallbackBackendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://smart-off-plan-backend-436741085428.europe-west1.run.app";

    // Use the optimized /all endpoint which now uses getAllPropertiesForMarketInfo internally
    const primaryApiUrl = `${primaryBackendUrl}/api/properties/all`;
    const fallbackApiUrl = `${fallbackBackendUrl}/api/properties/all`;

    console.log("📊 [MARKET-DATA] Primary backend API:", primaryApiUrl);
    console.log("📊 [MARKET-DATA] Fallback backend API:", fallbackApiUrl);

    try {
      let backendResponse;
      let usedFallback = false;

      // Try primary backend first
      try {
        console.log("🔄 [MARKET-DATA] Trying primary backend...");
        backendResponse = await fetch(primaryApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // No timeout - let it complete
        });

        if (!backendResponse.ok) {
          throw new Error(`Primary backend failed: ${backendResponse.status}`);
        }
      } catch (primaryError) {
        console.log(
          "⚠️ [MARKET-DATA] Primary backend failed, trying fallback..."
        );
        console.log("Primary error:", primaryError);

        // Try fallback backend
        backendResponse = await fetch(fallbackApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // No timeout - let it complete
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
        `✅ [MARKET-DATA] Successfully fetched ${
          data.data?.length || 0
        } properties with minimal fields using ${
          usedFallback ? "fallback" : "primary"
        } backend`
      );

      // Add debug information to response
      return NextResponse.json({
        ...data,
        debug: {
          usedFallback,
          apiUrl: usedFallback ? fallbackApiUrl : primaryApiUrl,
          fieldsRequested: "id,name,min_price,area",
          optimizedForMarketCalculations: true,
        },
      });
    } catch (fetchError) {
      console.error("❌ [MARKET-DATA] Fetch error:", fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error("❌ [MARKET-DATA] Market data API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An unexpected error occurred while fetching market data.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
