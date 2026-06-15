/**
 * Describes the different image wrapping modes
 */
export declare enum ImageWrapping {
    Clamp = "Clamp",
    Repeat = "Repeat",
    Mirror = "Mirror"
}
/**
 *
 */
export declare function parseImageWrapping(val: string): ImageWrapping;
