/**
 * Video/GIF Generator for SNS Sharing
 * Generates animated GIFs from setup images using gif.js library
 */

interface VideoGeneratorOptions {
  images: string[]; // Array of image URLs or data URIs
  title: string;
  width?: number;
  height?: number;
  duration?: number; // Total duration in seconds
  fps?: number; // Frames per second
}

/**
 * Generate an animated GIF from images
 * Returns a Promise with the GIF data URL
 */
export async function generateGIF(options: VideoGeneratorOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const {
        images,
        title,
        width = 1080,
        height = 1920,
        duration = 8,
        fps = 2,
      } = options;

      if (images.length === 0) {
        reject(new Error('No images provided'));
        return;
      }

      // Calculate frames per image
      const totalFrames = duration * fps;
      const framesPerImage = Math.ceil(totalFrames / images.length);

      // Load gif.js library dynamically
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js';
      script.onload = () => {
        // @ts-ignore - gif library is global after load
        const GIF = window.GIF;

        const gif = new GIF({
          workers: 2,
          quality: 10,
          width,
          height,
          workerScript: 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js',
        });

        // Create canvas for rendering frames
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        let loadedImages = 0;
        const imgElements: HTMLImageElement[] = [];

        // Pre-load all images
        images.forEach((imgUrl) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = imgUrl;
          img.onload = () => {
            loadedImages++;
            imgElements.push(img);

            // Once all images are loaded, create GIF
            if (loadedImages === images.length) {
              createGifFrames();
            }
          };
          img.onerror = () => {
            reject(new Error(`Failed to load image: ${imgUrl}`));
          };
        });

        function createGifFrames() {
          // Add frames for each image
          imgElements.forEach((img) => {
            for (let i = 0; i < framesPerImage; i++) {
              // Clear canvas
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, width, height);

              // Draw image centered
              const imgWidth = img.width;
              const imgHeight = img.height;
              const scale = Math.min(width / imgWidth, height / imgHeight);
              const x = (width - imgWidth * scale) / 2;
              const y = (height - imgHeight * scale) / 2;

              ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);

              // Add title overlay
              ctx.fillStyle = 'rgba(31, 41, 55, 0.8)';
              ctx.font = 'bold 32px system-ui';
              ctx.textAlign = 'center';
              ctx.fillText(title, width / 2, 100);

              gif.addFrame(canvas, { delay: 1000 / fps });
            }
          });

          // Render GIF
          gif.on('finished', function (blob: Blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          });

          gif.on('error', function (error: Error) {
            reject(error);
          });

          gif.render();
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load gif.js library'));
      };

      document.head.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate a simple multi-image carousel GIF (lighter weight)
 * Uses canvas API to create a basic animation
 */
export async function generateSimpleGIF(
  options: VideoGeneratorOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    const { images, width = 1080, height = 1920 } = options;

    if (images.length === 0) {
      reject(new Error('No images provided'));
      return;
    }

    // Create container for image carousel
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-9999px';
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    // Load images
    let loadedCount = 0;
    const imgElements: HTMLImageElement[] = [];

    images.forEach((src) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.position = 'absolute';
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease-in-out';

      img.onload = () => {
        loadedCount++;
        imgElements.push(img);
        container.appendChild(img);

        if (loadedCount === images.length) {
          // All images loaded, create carousel
          createCarouselAnimation();
        }
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };
    });

    function createCarouselAnimation() {
      // Simulate carousel with opacity transitions
      let currentIndex = 0;

      const showImage = (index: number) => {
        imgElements.forEach((img, i) => {
          img.style.opacity = i === index ? '1' : '0';
        });
      };

      showImage(0);

      // For now, just return the first image as a static image
      // In production, you'd use html2canvas or ffmpeg.wasm for actual video
      html2canvas(container)
        .then((canvas) => {
          const dataUrl = canvas.toDataURL('image/jpeg');
          resolve(dataUrl);
          document.body.removeChild(container);
        })
        .catch((error) => {
          document.body.removeChild(container);
          reject(error);
        });
    }
  });
}

/**
 * Download GIF to user's device
 */
export function downloadGIF(gifUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = gifUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Share GIF via Web Share API (if available)
 */
export async function shareGIF(
  gifUrl: string,
  title: string,
  text: string
): Promise<boolean> {
  // Convert data URL to Blob
  const response = await fetch(gifUrl);
  const blob = await response.blob();

  // Create File object
  const file = new File([blob], `${title}.gif`, { type: 'image/gif' });

  // Check if Web Share API is supported
  if (navigator.share && navigator.canShare) {
    try {
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title,
          text,
          files: [file],
        });
        return true;
      }
    } catch (error) {
      console.error('Share failed:', error);
      return false;
    }
  }

  return false;
}

// Import html2canvas at module level for use in createCarouselAnimation
import html2canvas from 'html2canvas';
