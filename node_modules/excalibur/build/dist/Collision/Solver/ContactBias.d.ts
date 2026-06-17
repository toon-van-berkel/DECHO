/**
 * Tells the Arcade collision solver to prefer certain contacts over others
 */
export declare enum ContactSolveBias {
    None = "none",
    VerticalFirst = "vertical-first",
    HorizontalFirst = "horizontal-first"
}
/**
 * Contact bias values
 */
export interface ContactBias {
    vertical: number;
    horizontal: number;
}
/**
 * Vertical First contact solve bias Used by the {@apilink ArcadeSolver} to sort contacts
 */
export declare const VerticalFirst: ContactBias;
/**
 * Horizontal First contact solve bias Used by the {@apilink ArcadeSolver} to sort contacts
 */
export declare const HorizontalFirst: ContactBias;
/**
 * None value, {@apilink ArcadeSolver} sorts contacts using distance by default
 */
export declare const None: ContactBias;
