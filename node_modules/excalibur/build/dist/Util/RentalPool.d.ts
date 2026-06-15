export declare class RentalPool<T> {
    builder: () => T;
    cleaner: (used: T) => T;
    private _pool;
    private _size;
    constructor(builder: () => T, cleaner: (used: T) => T, preAllocate?: number);
    /**
     * Grow the pool size by an amount
     * @param amount
     */
    grow(amount: number): void;
    /**
     * Rent an object from the pool, optionally clean it. If not cleaned previous state may be set.
     *
     * The pool will automatically double if depleted
     * @param clean
     */
    rent(clean?: boolean): T;
    /**
     * Return an object to the pool
     * @param object
     */
    return(object: T): void;
}
