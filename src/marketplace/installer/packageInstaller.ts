import { InstallationStatus, MarketplaceItem } from '../types';
import { PackageDownloader } from '../downloader/packageDownloader';
import { PackageExtractor } from '../extractor/packageExtractor';

const INSTALLED_PACKS_KEY = 'youmi_installed_packs_registry';

export class PackageInstaller {
  public static getInstalledRegistry(): Record<string, InstallationStatus> {
    try {
      const stored = localStorage.getItem(INSTALLED_PACKS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse installed packs registry', e);
    }
    // Default installed items
    return {
      'pack-auth-pro': {
        itemId: 'pack-auth-pro',
        installedVersion: '2.1.0',
        enabled: true,
        installedAt: '2026-07-01T10:00:00Z',
        status: 'installed',
      },
      'pack-ai-copilot': {
        itemId: 'pack-ai-copilot',
        installedVersion: '3.0.4',
        enabled: true,
        installedAt: '2026-07-05T12:30:00Z',
        status: 'installed',
      },
    };
  }

  public static saveInstalledRegistry(registry: Record<string, InstallationStatus>): void {
    try {
      localStorage.setItem(INSTALLED_PACKS_KEY, JSON.stringify(registry));
    } catch (e) {
      console.error('Failed to save installed packs registry', e);
    }
  }

  public static async installItem(
    item: MarketplaceItem,
    onProgress?: (msg: string) => void
  ): Promise<InstallationStatus> {
    const registry = this.getInstalledRegistry();
    
    if (onProgress) onProgress('Downloading package payload...');
    const payload = await PackageDownloader.downloadPackage(item);

    if (onProgress) onProgress('Extracting and validating manifest...');
    const extractResult = await PackageExtractor.extractAndValidate(payload);

    if (!extractResult.success || !extractResult.manifest) {
      throw new Error(extractResult.errors?.[0] || 'Installation failed due to invalid manifest.');
    }

    if (onProgress) onProgress('Registering pack files & components...');
    const statusObj: InstallationStatus = {
      itemId: item.id,
      installedVersion: item.version,
      enabled: true,
      installedAt: new Date().toISOString(),
      status: 'installed',
    };

    registry[item.id] = statusObj;
    this.saveInstalledRegistry(registry);

    if (onProgress) onProgress('Successfully installed!');
    return statusObj;
  }

  public static toggleItemEnabled(itemId: string, enable: boolean): InstallationStatus | null {
    const registry = this.getInstalledRegistry();
    if (!registry[itemId]) return null;

    registry[itemId].enabled = enable;
    this.saveInstalledRegistry(registry);
    return registry[itemId];
  }

  public static uninstallItem(itemId: string): boolean {
    const registry = this.getInstalledRegistry();
    if (!registry[itemId]) return false;

    delete registry[itemId];
    this.saveInstalledRegistry(registry);
    return true;
  }
}
