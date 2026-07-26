import { DownloadProgress, MarketplaceItem } from '../types';

export type DownloadProgressCallback = (progress: DownloadProgress) => void;

export class PackageDownloader {
  private static activeDownloads: Map<string, DownloadProgress> = new Map();

  public static async downloadPackage(
    item: MarketplaceItem,
    onProgress?: DownloadProgressCallback
  ): Promise<ArrayBuffer | string> {
    const itemId = item.id;
    const totalBytes = 1024 * 1024 * 2.5; // Simulate 2.5MB payload
    let bytesDownloaded = 0;

    const progress: DownloadProgress = {
      itemId,
      bytesDownloaded: 0,
      totalBytes,
      percentage: 0,
      status: 'downloading',
    };

    this.activeDownloads.set(itemId, progress);
    if (onProgress) onProgress(progress);

    // Simulate chunked downloading
    for (let step = 1; step <= 5; step++) {
      await new Promise((r) => setTimeout(r, 120));
      bytesDownloaded = Math.min(totalBytes, Math.round((totalBytes / 5) * step));
      progress.bytesDownloaded = bytesDownloaded;
      progress.percentage = Math.round((bytesDownloaded / totalBytes) * 100);

      if (onProgress) onProgress({ ...progress });
    }

    progress.status = 'completed';
    this.activeDownloads.delete(itemId);
    if (onProgress) onProgress({ ...progress });

    // Return dummy serialized payload representation
    return JSON.stringify({
      manifestVersion: '1.0',
      packId: item.id,
      name: item.displayName,
      version: item.version,
      entryPoint: './index.js',
      assets: ['/icon.png', '/styles.css'],
      permissions: item.permissions,
    });
  }

  public static getProgress(itemId: string): DownloadProgress | undefined {
    return this.activeDownloads.get(itemId);
  }
}
