import { Uint8Array } from 'buffer';

export declare function getPersonalBundleDownloadUrl(namespace: string, id: string, bundleUrl: string): string;
export declare function uploadPersonalBundle(namespace: string, id: string, bundleUrl: string, data: Uint8Array): Promise<void>;
