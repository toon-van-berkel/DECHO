/**
 * Asserts will throw in `process.env.NODE_ENV === 'development'` builds if the expression evaluates false
 */
export declare function assert(message: string, expression: () => boolean): void;
