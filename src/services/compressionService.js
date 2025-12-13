import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

/**
 * Compression Service
 * Handles video compression using FFmpeg (WASM) directly in the browser.
 * Reduces file size before upload to save bandwidth and improve upload speed.
 */
class CompressionService {
  constructor() {
    this.ffmpeg = new FFmpeg();
    this.isLoaded = false;
  }

  async load() {
    if (this.isLoaded) return;

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

    await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    this.isLoaded = true;
  }

  async compressVideo(file, onProgress) {
    if (!this.isLoaded) await this.load();

    const { name } = file;
    const outputName = `compressed_${name}`;

    try {
      await this.ffmpeg.writeFile(name, await fetchFile(file));

      this.ffmpeg.on('progress', ({ progress }) => {
        if (onProgress) onProgress(Math.round(progress * 100));
      });

      // Compress video: scale to 720p, CRF 28 (good balance of quality/size for mobile)
      await this.ffmpeg.exec([
        '-i', name,
        '-vf', 'scale=-2:720',
        '-c:v', 'libx264',
        '-crf', '28',
        '-preset', 'faster',
        outputName
      ]);

      const data = await this.ffmpeg.readFile(outputName);

      const compressedBlob = new Blob([data.buffer], { type: 'video/mp4' });
      return new File([compressedBlob], outputName, { type: 'video/mp4' });
    } catch (error) {
      console.error('Compression failed:', error);
      throw error;
    } finally {
      // Cleanup
      try {
        await this.ffmpeg.deleteFile(name);
        await this.ffmpeg.deleteFile(outputName);
      } catch (e) {
        console.warn('Cleanup failed:', e);
      }
    }
  }
}

export const compressionService = new CompressionService();
