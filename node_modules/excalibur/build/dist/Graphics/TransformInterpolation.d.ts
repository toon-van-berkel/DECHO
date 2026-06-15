import { Transform } from '../Math/transform';
/**
 * Blend 2 transforms for interpolation, will interpolate from the context of newTx's parent if it exists
 */
export declare function blendTransform(oldTx: Transform, newTx: Transform, blend: number, target?: Transform): Transform;
/**
 *
 */
export declare function blendGlobalTransform(oldTx: Transform, newTx: Transform, blend: number, target?: Transform): Transform;
