import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // console.log("📧 Frontend property inquiry API called");

    // Parse the request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "interest",
      "propertyId",
      "propertyName",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: `The following fields are required: ${missingFields.join(
            ", "
          )}`,
          missingFields,
        },
        { status: 400 }
      );
    }

    // Backend URL
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const backendApiUrl = `${backendUrl}/api/email/property-inquiry`;

    // console.log("🔗 Calling backend email API:", backendApiUrl);
    // console.log("📧 Property inquiry data:", {
    //   propertyId: body.propertyId,
    //   propertyName: body.propertyName,
    //   customerEmail: body.email,
    //   interest: body.interest,
    // });

    // Forward the request to the backend
    const backendResponse = await fetch(backendApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        interest: body.interest,
        message: body.message || "",
        referralName: body.referralName || "",
        propertyId: parseInt(body.propertyId),
        propertyName: body.propertyName,
        propertyLocation: body.propertyLocation,
        propertyPrice: body.propertyPrice,
      }),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(
        "❌ Backend email API error:",
        backendResponse.status,
        errorText
      );

      return NextResponse.json(
        {
          success: false,
          error: "Backend API error",
          message: `Failed to send property inquiry email: ${backendResponse.status} ${backendResponse.statusText}`,
          details: errorText,
        },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    // console.log("✅ Property inquiry email sent successfully:", {
    //   success: backendData.success,
    //   propertyId: backendData.data?.propertyId,
    //   propertyName: backendData.data?.propertyName,
    // });

    return NextResponse.json(backendData);
  } catch (error) {
    console.error("❌ Error in property inquiry API:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message:
          "An unexpected error occurred while sending the property inquiry email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
