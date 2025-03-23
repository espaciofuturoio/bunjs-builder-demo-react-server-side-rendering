import * as React from 'react';
import { useState } from 'react'
import { uploadImage } from '../controllers/upload'
import {
  compressImage,
  convertToWebP,
  optimizeImageServer,
  isHeicOrHeifImage,
  convertHeicToJpeg,
  isAvifImage,
  convertAvifToWebP,
} from '../utils/image/imageCompressionUtil'

// Define accepted file types
const ACCEPTED_FILE_TYPES = "image/jpeg,image/png,image/gif,image/webp,image/avif,image/heic,image/heif"
const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.heic', '.heif']

// Default configuration values
const DEFAULT_QUALITY = 75
const DEFAULT_MAX_SIZE_MB = 1
const DEFAULT_MAX_RESOLUTION = 2048
const DEFAULT_FORMAT = 'webp'
const MAX_FILE_SIZE_MB = 40 // 40MB file size limit

// Utility function to format bytes into KB and MB
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 KB'
  const k = 1024
  const kb = (bytes / k).toFixed(2)
  const mb = (bytes / (k * k)).toFixed(2)
  return bytes < k * k ? `${kb} KB` : `${mb} MB`
}

// Utility function to validate file
const validateFile = (file: File): { valid: boolean; message: string } => {
  // Check file size (40MB limit)
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return {
      valid: false,
      message: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`
    };
  }

  // Validate MIME type
  const validMimeType = ACCEPTED_FILE_TYPES.includes(file.type);

  // Check if it's a likely video file based on common video MIME types
  if (file.type.startsWith('video/')) {
    return {
      valid: false,
      message: 'Videos are not supported. Please upload an image file.'
    };
  }

  // Double-check file extension as fallback
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ACCEPTED_EXTENSIONS.some(ext => fileName.endsWith(ext));

  // Check for common video extensions, even if MIME type wasn't detected correctly
  const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.webm', '.mkv', '.m4v'];
  if (VIDEO_EXTENSIONS.some(ext => fileName.endsWith(ext))) {
    return {
      valid: false,
      message: 'Videos are not supported. Please upload an image file.'
    };
  }

  if (!validMimeType && !hasValidExtension) {
    return {
      valid: false,
      message: 'Invalid file type. Only images are accepted.'
    };
  }

  return { valid: true, message: '' };
};

// Read the first few bytes of a file to check its signature
const readFileHeader = async (file: File): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arr = new Uint8Array(reader.result as ArrayBuffer);
      resolve(arr.slice(0, 16)); // Increased to 16 bytes to better detect video formats
    };
    reader.onerror = () => reject(new Error('Failed to read file header'));

    // Read only the beginning of the file
    const blob = file.slice(0, 16);
    reader.readAsArrayBuffer(blob);
  });
};

// Check if the file header corresponds to a valid image format
const isValidImageHeader = (header: Uint8Array): boolean => {
  // First check for video/document formats that should be rejected

  // Check for MP4/QuickTime formats ('ftyp' at bytes 4-7 and common subtypes)
  const isFtyp = header[4] === 0x66 && header[5] === 0x74 && header[6] === 0x79 && header[7] === 0x70;
  if (isFtyp) {
    // Check for common video format subtypes
    const subtype = String.fromCharCode.apply(null, Array.from(header.slice(8, 12)));
    const videoSubtypes = ['mp4', 'avc', 'iso', 'MP4', 'qt', 'mov', 'M4V', 'm4v'];
    if (videoSubtypes.some(type => subtype.includes(type))) {
      return false; // This is a video file, not an image
    }
  }

  // Check for WebM video signature (bytes 0-3: 0x1A 0x45 0xDF 0xA3)
  if (header[0] === 0x1A && header[1] === 0x45 && header[2] === 0xDF && header[3] === 0xA3) {
    return false; // WebM video file
  }

  // Check for AVI format (starts with "RIFF" and then has "AVI")
  if (header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46 &&
    header[8] === 0x41 && header[9] === 0x56 && header[10] === 0x49) {
    return false; // AVI video file
  }

  // Now check for valid image formats

  // JPEG signature: starts with FF D8
  if (header[0] === 0xFF && header[1] === 0xD8) return true;

  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47) return true;

  // GIF signature: "GIF87a" (47 49 46 38 37 61) or "GIF89a" (47 49 46 38 39 61)
  if (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x38 &&
    (header[4] === 0x37 || header[4] === 0x39) && header[5] === 0x61) return true;

  // WebP: starts with "RIFF" and later contains "WEBP"
  if (header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46 &&
    header[8] === 0x57 && header[9] === 0x45 && header[10] === 0x42 && header[11] === 0x50) return true;

  // HEIC/HEIF can be harder to detect, often start with "ftyp"
  // Basic check for AVIF/HEIF containers, but make sure it's not a video subtype
  if (isFtyp) {
    const subtype = String.fromCharCode.apply(null, Array.from(header.slice(8, 12)));
    const imageSubtypes = ['heic', 'mif1', 'msf1', 'avif', 'hevc'];
    if (imageSubtypes.some(type => subtype.includes(type))) {
      return true; // This is a HEIC/AVIF image
    }
  }

  return false;
};

interface SimpleImageUploaderProps {
  onClientSide?: boolean;
}

type ImageFormat = 'jpeg' | 'png' | 'webp' | 'avif';

interface ImageInfo {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

export function SimpleImageUploader({ onClientSide = false }: SimpleImageUploaderProps) {
  // States for managing file, previews, and UI
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [imageInfo, setImageInfo] = React.useState<ImageInfo | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [optimizedImageUrl, setOptimizedImageUrl] = React.useState<string | null>(null);
  const [optimizationFormat, setOptimizationFormat] = React.useState<ImageFormat>('webp');
  const [optimizationQuality, setOptimizationQuality] = React.useState(80);
  const [sliderPosition, setSliderPosition] = React.useState(50);
  const [isOptimizing, setIsOptimizing] = React.useState(false);
  const [optimizedSize, setOptimizedSize] = React.useState<number | null>(null);
  const [compressionRatio, setCompressionRatio] = React.useState<number | null>(null);

  // Reference for the comparison slider
  const imageCompareContainerRef = React.useRef<HTMLDivElement>(null);
  const sliderHandleRef = React.useRef<HTMLDivElement>(null);
  const isDraggingRef = React.useRef(false);

  // Reset all state when format or quality changes
  React.useEffect(() => {
    if (selectedFile) {
      setOptimizedImageUrl(null);
      setOptimizedSize(null);
      setCompressionRatio(null);
    }
  }, [optimizationFormat, optimizationQuality]);

  // Reset error message when a new file is selected
  React.useEffect(() => {
    if (selectedFile) setError(null);
  }, [selectedFile]);

  // Function to handle file selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setError(null);
    setOptimizedImageUrl(null);
    setOptimizedSize(null);
    setCompressionRatio(null);

    try {
      const file = files[0];

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/heic', 'image/heif'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Unsupported file type. Please upload a JPEG, PNG, GIF, WebP, AVIF, or HEIC image.');
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File is too large. Maximum size is 10MB.');
      }

      setSelectedFile(file);

      // Create object URL for preview
      const previewUrl = URL.createObjectURL(file);

      // Get image dimensions
      const img = new Image();
      img.src = previewUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          setImageInfo({
            file,
            previewUrl,
            width: img.width,
            height: img.height,
            size: file.size,
            format: file.type.split('/')[1].toUpperCase(),
          });
          resolve();
        };
        img.onerror = () => {
          reject(new Error('Failed to load image.'));
        };
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setSelectedFile(null);
      setImageInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle image optimization
  const handleOptimize = async () => {
    if (!imageInfo || !selectedFile) return;

    setIsOptimizing(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('format', optimizationFormat);
      formData.append('quality', optimizationQuality.toString());

      const response = await fetch('/api/upload/optimize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to optimize image');
      }

      const result = await response.json();

      // Calculate compression ratio
      const originalSize = imageInfo.size;
      const newSize = result.size;
      const ratio = ((originalSize - newSize) / originalSize) * 100;

      setOptimizedImageUrl(result.url);
      setOptimizedSize(newSize);
      setCompressionRatio(ratio);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to optimize image');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Mouse and touch event handlers for the slider
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    window.addEventListener('touchmove', handleTouchMove as unknown as EventListener);
    window.addEventListener('touchend', handleTouchEnd);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !imageCompareContainerRef.current) return;
    const rect = imageCompareContainerRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    updateSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDraggingRef.current || !imageCompareContainerRef.current || !e.touches[0]) return;
    const rect = imageCompareContainerRef.current.getBoundingClientRect();
    const position = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    updateSliderPosition(position);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    window.removeEventListener('touchmove', handleTouchMove as unknown as EventListener);
    window.removeEventListener('touchend', handleTouchEnd);
  };

  const updateSliderPosition = (position: number) => {
    const clampedPosition = Math.max(0, Math.min(100, position));
    setSliderPosition(clampedPosition);
  };

  // Clean up event listeners on unmount
  React.useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove as unknown as EventListener);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Format file size in human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Server-side rendering safe check
  if (!onClientSide) {
    return (
      <div className="flex flex-col items-center p-4">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Upload Image</span>
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/avif,image/heic,image/heif"
            className="file-input w-full"
          />
          <label className="label">
            <span className="label-text-alt">Supported: JPEG, PNG, GIF, WebP, AVIF, HEIC</span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {/* File Input Section */}
      <div className="form-control w-full max-w-xs mb-4">
        <label className="label">
          <span className="label-text">Upload Image</span>
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/avif,image/heic,image/heif"
          onChange={handleFileChange}
          className="file-input w-full"
          disabled={isLoading || isOptimizing}
        />
        <label className="label">
          <span className="label-text-alt">Supported: JPEG, PNG, GIF, WebP, AVIF, HEIC</span>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error w-full max-w-md mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64 w-full">
          <div className="loading loading-lg"></div>
        </div>
      )}

      {/* Image Preview with Info */}
      {imageInfo && !isLoading && (
        <div className="card bg-base-100 shadow-lg w-full max-w-2xl mb-4">
          <div className="card-body">
            <h2 className="card-title">Image Preview</h2>

            <div className="flex flex-col lg:flex-row gap-4">
              {/* Image Preview */}
              <div className="flex-1 text-center">
                <div className="relative mb-2 max-h-64 overflow-hidden rounded-lg">
                  <img
                    src={imageInfo.previewUrl}
                    alt="Preview"
                    className="object-contain mx-auto max-h-64"
                  />
                </div>
                <p className="text-sm">Original</p>
              </div>

              {/* Image Info */}
              <div className="flex-1">
                <p><strong>Size:</strong> {formatFileSize(imageInfo.size)}</p>
                <p><strong>Dimensions:</strong> {imageInfo.width} × {imageInfo.height}</p>
                <p><strong>Format:</strong> {imageInfo.format}</p>

                {/* Optimization Options */}
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Target Format</span>
                  </label>
                  <div className="btn-group">
                    {(['webp', 'jpeg', 'png', 'avif'] as const).map((format) => (
                      <button
                        key={format}
                        className={`btn btn-sm ${optimizationFormat === format ? 'btn-active' : 'btn-outline'}`}
                        onClick={() => setOptimizationFormat(format)}
                        disabled={isOptimizing}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-control mt-2">
                  <label className="label">
                    <span className="label-text">Quality: {optimizationQuality}%</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={optimizationQuality}
                    onChange={(e) => setOptimizationQuality(Number(e.target.value))}
                    className="range range-primary"
                    disabled={isOptimizing}
                  />
                  <div className="flex justify-between text-xs px-1">
                    <span>10%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <button
                  className="btn btn-primary mt-4 w-full"
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                >
                  {isOptimizing ? (
                    <>
                      <div className="loading loading-spinner loading-sm mr-2"></div>
                      Optimizing...
                    </>
                  ) : 'Optimize Image'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optimization Results */}
      {optimizedImageUrl && (
        <div className="card bg-base-100 shadow-lg w-full max-w-2xl mb-4">
          <div className="card-body">
            <h2 className="card-title">
              Optimization Results
              {compressionRatio && (
                <span className="badge badge-info ml-2">
                  {compressionRatio.toFixed(1)}% Smaller
                </span>
              )}
            </h2>

            {/* Image Comparison Slider */}
            <div
              className="relative w-full h-64 overflow-hidden rounded-lg mb-2"
              ref={imageCompareContainerRef}
            >
              {/* Original Image (Background) */}
              <img
                src={imageInfo?.previewUrl}
                alt="Original"
                className="absolute inset-0 w-full h-full object-contain"
              />

              {/* Optimized Image (Foreground with clip) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={optimizedImageUrl}
                  alt="Optimized"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ width: `${100 / (sliderPosition / 100)}%` }}
                />
              </div>

              {/* Slider Handle */}
              <div
                ref={sliderHandleRef}
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg cursor-ew-resize select-none z-10"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-4 h-4 flex items-center justify-center">
                      ◀
                    </div>
                    <div className="w-4 h-4 flex items-center justify-center">
                      ▶
                    </div>
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs p-2 rounded">
                Original
              </div>
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs p-2 rounded">
                Optimized
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <p className="font-medium">Original</p>
                <p><strong>Size:</strong> {formatFileSize(imageInfo?.size || 0)}</p>
                <p><strong>Format:</strong> {imageInfo?.format}</p>
              </div>

              <div className="flex-1">
                <p className="font-medium text-primary">Optimized</p>
                {optimizedSize && (
                  <>
                    <p><strong>Size:</strong> {formatFileSize(optimizedSize)}</p>
                    <p><strong>Format:</strong> {optimizationFormat.toUpperCase()}</p>
                    <p><strong>Quality:</strong> {optimizationQuality}%</p>
                  </>
                )}
              </div>
            </div>

            <a
              href={optimizedImageUrl}
              download={`optimized-image.${optimizationFormat}`}
              className="btn btn-primary mt-4 w-full"
            >
              Download Optimized Image
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 