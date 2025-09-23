# Image Upload Setup with Vercel Blob

This document explains how to set up image upload functionality for the document system using Vercel Blob.

## Prerequisites

1. **Vercel Account**: You need a Vercel account to use Vercel Blob storage.
2. **Vercel Blob Token**: Get your blob storage token from the Vercel dashboard.

## Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

## How to Get Vercel Blob Token

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Go to Settings → Environment Variables
4. Add a new variable:
   - Name: `BLOB_READ_WRITE_TOKEN`
   - Value: Your blob storage token
   - Environment: All (Production, Preview, Development)

## Features Implemented

### 1. Image Upload API (`/api/upload`)

- **Authentication**: Only authenticated users can upload images
- **File Validation**:
  - Allowed formats: JPEG, PNG, GIF, WebP
  - Maximum file size: 5MB per image
- **Storage**: Images are stored in Vercel Blob with organized folder structure
- **Security**: Files are validated before upload

### 2. Image Upload Component (`ImageUpload.tsx`)

- **Drag & Drop**: Users can select multiple images at once
- **Preview**: Real-time preview of uploaded images
- **Management**: Remove individual images or clear all
- **Limits**: Maximum 5 images per document
- **Progress**: Upload progress indication

### 3. Document Form Integration

- **Seamless Integration**: Image upload is integrated into the document creation/editing form
- **Validation**: Form validation includes image URLs
- **Persistence**: Images are saved with the document

### 4. Database Schema Updates

- **Images Field**: Added `images` array to document model
- **Validation**: Image URLs are validated as proper URLs
- **Optional**: Images are optional for documents

## Usage

1. **Create Document**:
   - Go to `/docs/create`
   - Fill in title and content
   - Upload images using the image upload section
   - Publish the document

2. **Edit Document**:
   - Go to your document's edit page
   - Modify images as needed
   - Save changes

## File Structure

```
app/api/upload/route.ts          # Upload API endpoint
components/forms/ImageUpload.tsx # Image upload component
components/forms/DocForm.tsx     # Updated document form
database/doc.model.ts            # Updated document model
lib/actions/doc.action.ts        # Updated document actions
lib/validations.ts               # Updated validation schemas
```

## Security Features

- **Authentication Required**: Only logged-in users can upload
- **File Type Validation**: Only image files are allowed
- **Size Limits**: 5MB maximum per image
- **User Isolation**: Images are organized by user ID
- **URL Validation**: Image URLs are validated before saving

## Error Handling

The system handles various error scenarios:

- Unauthorized access
- Invalid file types
- File size exceeded
- Upload failures
- Network errors

## Performance Considerations

- **Multiple Uploads**: Supports uploading multiple images simultaneously
- **Optimized Storage**: Images are stored efficiently in Vercel Blob
- **CDN Delivery**: Vercel Blob provides global CDN for fast image delivery
- **Lazy Loading**: Images are loaded on demand

## Troubleshooting

### Common Issues

1. **Upload Fails**: Check your `BLOB_READ_WRITE_TOKEN` environment variable
2. **File Too Large**: Ensure images are under 5MB
3. **Invalid File Type**: Only image files (JPEG, PNG, GIF, WebP) are allowed
4. **Authentication Error**: Make sure you're logged in

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are set
3. Check Vercel Blob dashboard for storage usage
4. Ensure proper authentication

## Future Enhancements

Potential improvements for the image upload system:

- Image compression before upload
- Image resizing options
- Image editing capabilities
- Bulk image operations
- Image galleries
- Image search functionality
