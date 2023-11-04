/// <reference types="emscripten" />

import { Injectable } from '@angular/core';

/** WASM module after load */
export type WasmModule = {
  callMain: (args: string[]) => number;
  FS: typeof FS;
}

/** Module arguments for WASM */
export type WasmModuleArgs = Partial<EmscriptenModule>;

/** WASM function */
export type WasmFunction = (...args: string[]) => Promise<number>;

/** List of WASM module names */
export type WasmModuleName = 'schemaCompile' | 'schema_info';

/** Global type for DCT modules. */
export type DCT = {
  schemaCompile: WasmFunction;
};

@Injectable({
  providedIn: 'root'
})
export class WasmService {
  /** Proxy filesystem for all modules */
  public FS: null | typeof FS = null;
  /** Working directory for virtual filesystem */
  public readonly cwd = '/data';
  /** List of loaded modules (scripts) */
  private loaded = new Set<WasmModuleName>();
  /** Files in queue to be updated in the filesystem */
  private files: Record<string, string | Uint8Array> = {};

  /**
   * Load and get a WASM module.
   * @param path Path to JavaScript asset (e.g. dct/tool.js)
   * @param name Name of WASM module (e.g. schemaCompile)
   * @param moduleArgs Arguments to pass to WASM module
   * @returns Promise that resolves to the WASM module
   */
  public async get(path: string, name: WasmModuleName, moduleArgs?: WasmModuleArgs): Promise<WasmModule> {
    // Load JavaScript if needed
    if (!this.loaded.has(name)) {
      // Set flag for next call
      this.loaded.add(name);

      // Add script tag
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = path;
        script.addEventListener('load', async () => {
          this.get(path, name, moduleArgs).then(resolve, reject);
        });
        script.addEventListener('error', () => {
          reject(new Error(`Failed to load ${path}`));
        });
        document.body.appendChild(script);
      });
    }

    // Add base arguments
    moduleArgs = { ...this.baseArgs(), ...moduleArgs };

    // Load WASM module
    const module: WasmModule = await (<any>window)[name]?.(moduleArgs ?? {});
    if (!module) {
      throw new Error(`${name} is not loaded or failed to load WASM module`);
    }

    // Initialize filesystem if needed
    this.initfs(module);

    return module;
  }

  /**
   * Get a wrapped WASM module as an async function.
   * @param path Path to JavaScript asset (e.g. dct/tool.js)
   * @param name Name of WASM module (e.g. schemaCompile)
   * @param moduleArgs Arguments to pass to WASM module
   * @returns Promise that resolves to the WASM module
   */
  public wrapper(path: string, name: WasmModuleName, moduleArgs?: WasmModuleArgs): WasmFunction {
    return async (...args: string[]) => {
      const module = await this.get(path, name, moduleArgs);
      return module.callMain(args);
    };
  }

  /**
   * Write a file to the virtual filesystem.
   * This can be called before the WASM module is loaded since
   * the files are written every time the module is called.
   */
  public writeFile(path: string, data: string | Uint8Array): void {
    if (this.FS) {
      // Write file to filesystem
      this.FS.writeFile(path, data);
    } else {
      // Queue the file for when the filesystem is initialized
      this.files[path] = data;
    }
  }

  /**
   * Initialize the virtual filesystem with the IndexedDB.
   * @param module Module to sync filesystem for
   * @param populate Whether to populate the filesystem
   * @returns Whether initialization was performed
   */
  private initfs(module: WasmModule): void {
    // Create mount point
    module.FS.mkdir(this.cwd);

    // Initialize filesystem
    if (!this.FS) {
      // Save filesystem for other modules
      this.FS = module.FS;
    } else {
      // Mount filesystem to data directory
      module.FS.mount((this.FS as any).filesystems.PROXYFS, {
        root: this.cwd,
        fs: this.FS,
      }, this.cwd);
    }

    // Change working directory
    module.FS.chdir(this.cwd);

    // Write files to virtual filesystem
    for (const file in this.files) {
      module.FS.writeFile(file, this.files[file]);
      delete this.files[file];
    }
  }

  /**
   * Get base arguments for WASM module.
   */
  private baseArgs(): WasmModuleArgs {
    // Enable logging only to our console and not
    // the browser console to prevent noise.
    return {
      noInitialRun: true,
      print: window.console.log_play,
      printErr: window.console.error_play,
    };
  }
}