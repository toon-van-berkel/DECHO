import { RenderSource } from './render-source';
declare global {
    interface WebGL2RenderingContext {
        /**
         * Experimental only in chrome
         */
        drawingBufferFormat?: number;
    }
}
export interface RenderTargetOptions {
    gl: WebGL2RenderingContext;
    width: number;
    height: number;
    transparency: boolean;
    /**
     * Optionally enable render buffer multisample anti-aliasing
     *
     * By default false
     */
    antialias?: boolean;
    /**
     * Optionally specify number of anti-aliasing samples to use
     *
     * By default the max for the platform is used if antialias is on.
     */
    samples?: number;
}
export declare class RenderTarget {
    width: number;
    height: number;
    transparency: boolean;
    antialias: boolean;
    samples: number;
    private _gl;
    readonly bufferFormat: number;
    constructor(options: RenderTargetOptions);
    setResolution(width: number, height: number): void;
    private _renderBuffer;
    get renderBuffer(): WebGLRenderbuffer;
    private _renderFrameBuffer;
    get renderFrameBuffer(): WebGLFramebuffer;
    private _frameBuffer;
    get frameBuffer(): WebGLFramebuffer;
    private _frameTexture;
    get frameTexture(): WebGLTexture;
    private _setupRenderBuffer;
    private _setupFramebuffer;
    toRenderSource(): RenderSource;
    blitToScreen(): void;
    blitRenderBufferToFrameBuffer(): void;
    copyToTexture(texture: WebGLTexture): void;
    /**
     * When called, all drawing gets redirected to this render target
     */
    use(): void;
    /**
     * When called, all drawing is sent back to the canvas
     */
    disable(): void;
}
