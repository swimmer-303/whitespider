import { DosInstance, DosOptions } from 'emulators-ui/dist/types/js-dos';
import { Hardware } from './hardware-transport-layer';

export interface ClientId {
    namespace: string;
    id: string;
}

export type ClientIdSupplier = (userGesture: boolean) => Promise<ClientId | null>;

export interface DosPlayerOptions extends DosOptions {
    style?: 'default' | 'none' | 'hidden';
    hardware?: Hardware;
    clientIdSupplier?: ClientIdSupplier;
    onBeforeExit?: () => Promise<void>;
    onExit?: () => void;
    noSideBar?: boolean;
    noFullscreen?: boolean;
    noSocialLinks?: boolean;
    preventUnload?: boolean;
    withNetworkingApi?: boolean;
    withExperimentalApi?: boolean;
    windowOpen?: (url: string, target?: string) => void;
}

export interface DosPlayerOptionsWithDefaults extends DosPlayerOptions {
    windowOpen: (url: string, target?: string) => void;
}

export type DosPlayerFactoryType = (root: HTMLDivElement, options?: DosPlayerOptions) => DosPlayer;

export function createDosPlayer(
    root: HTMLDivElement,
    options: DosPlayerOptions = {}
): DosPlayer {
    const defaultOptions: DosPlayerOptionsWithDefaults = {
        ...options,
        windowOpen: (url: string, target?: string) => window.open(url, target),
    };

    return new DosPlayerImpl(root, defaultOptions);
}

class DosPlayerImpl implements DosPlayer {
    bundleUrl: string | null;

    constructor(
        private readonly root: HTMLDivElement,
        private readonly options: DosPlayerOptionsWithDefaults
    ) {
        // initialize DosPlayer
    }

    // implement DosInstance methods
}
