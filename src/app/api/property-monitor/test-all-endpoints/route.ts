import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/property-monitor/test-all-endpoints`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(
      "Error proxying PropertyMonitor test-all-endpoints request:",
      error
    );
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to backend API",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
