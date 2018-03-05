declare class World {
    constructor();
    init: (width: number, height: number, input_index: number,
        data_index: number, platform_count: number) => void;
    tick: (dt: number) => void;
}

interface Module {
    HEAPF32: Float32Array;
    HEAPU8: Uint8Array;
    World: { new(): World; prototype: World };
    _malloc: (bytes: number) => number;
    _free: (ptr: number) => void;
    print?: (text: string) => void;
    onRuntimeInitialized?: () => void;
}

declare var Module: Module;

interface Window {
    Module: Module;
}
