/**
 * Describes the different image filtering modes
 */
export declare enum ImageFiltering {
    /**
     * Pixel is useful when you do not want smoothing aka antialiasing applied to your graphics.
     *
     * Useful for Pixel art aesthetics.
     */
    Pixel = "Pixel",
    /**
     * Blended is useful when you have high resolution artwork and would like it blended and smoothed
     */
    Blended = "Blended"
}
/**
 * Parse the image filtering attribute value, if it doesn't match returns null
 */
export declare function parseImageFiltering(val: string): ImageFiltering | undefined;
