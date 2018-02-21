import { InjectionToken } from "@angular/core";

export type ContextType = "webgl" | "experimental-webgl" | "webgl2" | "experimental-webgl2";

export const WEBGL_CONTEXT_TYPE = new InjectionToken<ContextType[]>("Type of Webgl context");
export const WEBGL = new InjectionToken<WebGLRenderingContext>("WebGLRenderingContext");
export const WEBGL_EXTENSIONS = new InjectionToken<string[]>("List of Webgl extension to enable");
