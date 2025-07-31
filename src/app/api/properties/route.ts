import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    // Backend URL
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const backendApiUrl = `${backendUrl}/api/properties${
      queryString ? `?${queryString}` : ""
    }`;

    // console.log("🔗 Calling backend API:", backendApiUrl);

    const backendResponse = await fetch(backendApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!backendResponse.ok) {
      // console.log("⚠️ Backend API failed with status:", backendResponse.status);
      // return NextResponse.json(
      //   {
      //     success: false,
      //     error: "Backend API error",
      //     message: `Failed to fetch properties: ${backendResponse.status}`,
      //   },
      //   { status: backendResponse.status }
      // );
    }

    const backendData = await backendResponse.json();
    // console.log("✅ Backend API response received:", {
    //   success: backendData.success,
    //   dataLength: Array.isArray(backendData.data)
    //     ? backendData.data.length
    //     : "N/A",
    // });

    return NextResponse.json(backendData);
  } catch (error) {
    console.error("❌ Properties API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An unexpected error occurred while fetching properties.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
