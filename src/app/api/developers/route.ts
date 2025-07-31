import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // console.log("🏢 Frontend developers API called");

    // Backend URL
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const backendApiUrl = `${backendUrl}/api/developers`;

    // console.log("🔗 Calling backend developers API:", backendApiUrl);

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
        "❌ Backend developers API error:",
        backendResponse.status,
        errorText
      );

      return NextResponse.json(
        {
          success: false,
          error: "Database API error",
          message: `Failed to fetch developers from database: ${backendResponse.status} ${backendResponse.statusText}`,
          details: errorText,
          apiUrl: backendApiUrl,
        },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    // console.log(`✅ Developers fetched successfully:`, {
    //   success: backendData.success,
    //   dataLength: Array.isArray(backendData.data)
    //     ? backendData.data.length
    //     : "N/A",
    // });

    return NextResponse.json(backendData);
  } catch (error) {
    console.error("❌ Error in frontend developers API:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch developers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
