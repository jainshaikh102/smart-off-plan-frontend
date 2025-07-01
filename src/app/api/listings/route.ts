import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  try {
    console.log("📋 Frontend listings API called");

    // Get query parameters from the request
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    // Build backend URL with query parameters
    const backendUrl = `${BACKEND_URL}/api/listings${
      queryString ? `?${queryString}` : ""
    }`;

    console.log(`🔗 Calling backend listings API: ${backendUrl}`);

    // Call the backend listings API
    const response = await axios.get(backendUrl, {
      timeout: 30000, // 30 seconds timeout
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log(
      `✅ Backend listings API response received: { success: ${
        response.data.success
      }, dataLength: ${
        response.data.data?.items?.length || response.data.data?.length || 0
      } }`
    );

    // Return the response from backend
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("❌ Error in frontend listings API:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;

      return NextResponse.json(
        {
          success: false,
          message: `Backend API error: ${message}`,
          error: "BACKEND_API_ERROR",
        },
        { status }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📋 Frontend listings refresh API called");

    // Call the backend listings refresh endpoint
    const backendUrl = `${BACKEND_URL}/api/listings/refresh`;

    console.log(`🔄 Calling backend listings refresh API: ${backendUrl}`);

    const response = await axios.post(
      backendUrl,
      {},
      {
        timeout: 60000, // 60 seconds timeout for refresh
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log(
      `✅ Backend listings refresh API response received: { success: ${response.data.success} }`
    );

    // Return the response from backend
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("❌ Error in frontend listings refresh API:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;

      return NextResponse.json(
        {
          success: false,
          message: `Backend API error: ${message}`,
          error: "BACKEND_API_ERROR",
        },
        { status }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
