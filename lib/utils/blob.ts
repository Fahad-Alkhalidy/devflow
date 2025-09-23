import { del } from "@vercel/blob";

export interface BlobDeleteResult {
  url: string;
  success: boolean;
  error?: string;
}

/**
 * Delete multiple images from Vercel Blob storage
 * @param imageUrls Array of image URLs to delete
 * @returns Promise with results of each deletion attempt
 */
export async function deleteImagesFromBlob(
  imageUrls: string[]
): Promise<BlobDeleteResult[]> {
  if (!imageUrls || imageUrls.length === 0) {
    return [];
  }

  console.log("Deleting images from blob:", imageUrls);

  const deletePromises = imageUrls.map(async (imageUrl: string) => {
    try {
      await del(imageUrl);
      console.log(`Successfully deleted image: ${imageUrl}`);
      return { url: imageUrl, success: true };
    } catch (error) {
      console.error(`Failed to delete image ${imageUrl}:`, error);
      return {
        url: imageUrl,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });

  const results = await Promise.all(deletePromises);
  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(
    `Blob cleanup: ${successful.length} images deleted, ${failed.length} failed`
  );

  if (failed.length > 0) {
    console.warn("Some images could not be deleted from blob:", failed);
  }

  return results;
}

/**
 * Delete a single image from Vercel Blob storage
 * @param imageUrl URL of the image to delete
 * @returns Promise with deletion result
 */
export async function deleteImageFromBlob(
  imageUrl: string
): Promise<BlobDeleteResult> {
  try {
    await del(imageUrl);
    console.log(`Successfully deleted image: ${imageUrl}`);
    return { url: imageUrl, success: true };
  } catch (error) {
    console.error(`Failed to delete image ${imageUrl}:`, error);
    return {
      url: imageUrl,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
