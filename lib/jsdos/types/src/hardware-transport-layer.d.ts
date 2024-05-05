import { TransportLayer } from "emulators/dist/types/protocol/protocol";

export interface Hardware {
    readConfig(): string;
    sendMessage(payload: string): void;
    addKey(key: number, pressed: number, timeMs: number): void;
    mouseMove(x: number, y: number, relative: boolean, timeMs: number): void;
    mouseButton(button: number, pressed: number, timeMs: number): void;
    getFramePayload(): string;
    createFile(path: string): string;
    appendFile(blob: string): string;
    closeFile(): string;
    readFile(path: string): string;
}

export declare class HardwareTransportLayerFactory {
    protected static instance: HardwareTransportLayerFactory;
    protected serverMessageHandler: any;

    private constructor() {}

    static getInstance(): HardwareTransportLayerFactory {
        if (!HardwareTransportLayerFactory.instance) {
            HardwareTransportLayerFactory.instance = new HardwareTransportLayerFactory();
        }

        return HardwareTransportLayerFactory.instance;
    }

    createTransportLayer(realtime: Hardware): TransportLayer {
        // implementation here
    }
}

export const hardwareTransportLayerFactory = HardwareTransportLayerFactory.getInstance();
