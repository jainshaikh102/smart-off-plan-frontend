import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;
    // console.log(`🏠 Frontend property detail API called for ID: ${propertyId}`);

    if (!propertyId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing property ID",
          message: "Property ID is required",
        },
        { status: 400 }
      );
    }

    // Validate that propertyId is a number
    const numericId = parseInt(propertyId, 10);
    if (isNaN(numericId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid property ID",
          message: "Property ID must be a valid number",
        },
        { status: 400 }
      );
    }

    // Build backend URL
    const backendUrl = `${BACKEND_URL}/api/properties/${propertyId}`;

    // console.log(`🔗 Calling backend property API: ${backendUrl}`);

    // Call the backend property API (which implements caching strategy)
    const response = await axios.get(backendUrl, {
      timeout: 30000, // 30 seconds timeout
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // console.log(
    //   `✅ Backend property API response received: { success: ${
    //     response.data.success
    //   }, hasData: ${!!response.data.data} }`
    // );

    // Return the response from backend
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("❌ Error in frontend property detail API:", error);

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
