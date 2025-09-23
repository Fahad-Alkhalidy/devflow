import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteImagesFromBlob } from "@/lib/utils/blob";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageUrls } = await request.json();

    if (!imageUrls || !Array.isArray(imageUrls)) {
      return NextResponse.json(
        { error: "Invalid image URLs provided" },
        { status: 400 }
      );
    }

    // Delete images from Vercel Blob
    const results = await deleteImagesFromBlob(imageUrls);
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    return NextResponse.json({
      success: true,
      deleted: successful.length,
      failed: failed.length,
      results: results,
    });
  } catch (error) {
    console.error("Delete images error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
