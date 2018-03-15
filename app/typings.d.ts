declare class World {
    constructor();
    init: (width: number, height: number, input_index: number, data_index: number, platform_count: number,
        tile_index: number, tile_count: number, tile_rows: number, tile_columns: number) => void;
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
