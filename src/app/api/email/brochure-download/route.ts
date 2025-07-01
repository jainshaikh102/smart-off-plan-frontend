import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("📧 Frontend brochure download API called");

    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'propertyId', 'propertyName'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: `The following fields are required: ${missingFields.join(', ')}`,
          missingFields,
        },
        { status: 400 }
      );
    }

    // Backend URL
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const backendApiUrl = `${backendUrl}/api/email/brochure-download`;

    console.log("🔗 Calling backend brochure download API:", backendApiUrl);
    console.log("📧 Brochure download data:", {
      propertyId: body.propertyId,
      propertyName: body.propertyName,
      customerEmail: body.email,
    });

    // Forward the request to the backend
    const backendResponse = await fetch(backendApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        propertyId: parseInt(body.propertyId),
        propertyName: body.propertyName,
      }),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error("❌ Backend brochure download API error:", backendResponse.status, errorText);
      
      return NextResponse.json(
        {
          success: false,
          error: "Backend API error",
          message: `Failed to send brochure download notification: ${backendResponse.status} ${backendResponse.statusText}`,
          details: errorText,
        },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    console.log("✅ Brochure download notification sent successfully:", {
      success: backendData.success,
      propertyId: backendData.data?.propertyId,
      propertyName: backendData.data?.propertyName,
    });

    return NextResponse.json(backendData);
  } catch (error) {
    console.error("❌ Error in brochure download API:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An unexpected error occurred while sending the brochure download notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
