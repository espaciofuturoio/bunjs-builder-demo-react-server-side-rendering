/**
 * Image upload controller with mock implementation
 */

type UploadResult = {
	success: boolean
	result?: {
		id: string
		url: string
		variants: string[]
	}
	error?: string
}

/**
 * Simple mock implementation of image upload
 * In a real application, this would connect to a storage service
 */
export const uploadImage = async (file: File): Promise<UploadResult> => {
	// Simulate a network delay
	await new Promise((resolve) => setTimeout(resolve, 1000))

	try {
		// Create object URL for the file (client-side only)
		const objectUrl = URL.createObjectURL(file)

		// Generate a random ID
		const id = `upload_${Math.random().toString(36).substring(2, 15)}`

		// In a real implementation, the file would be sent to a server
		// and stored in a persistent storage like S3, GCS, etc.
		return {
			success: true,
			result: {
				id,
				url: objectUrl,
				variants: [objectUrl],
			},
		}
	} catch (error) {
		console.error('Upload failed:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Upload failed',
		}
	}
}
