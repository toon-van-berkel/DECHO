export interface Context<TValue> {
    /**
     * Run the callback before popping the context value
     * @param value
     * @param cb
     */
    scope: <TReturn>(value: TValue, cb: () => TReturn) => TReturn;
    value: TValue;
}
/**
 * Creates a injectable context that can be retrieved later with `useContext(context)`
 *
 * Example
 * ```typescript
 *
 * const AppContext = createContext({some: 'value'});
 * context.scope(val, () => {
 *    const value = useContext(AppContext);
 * })
 *
 * ```
 */
export declare function createContext<TValue>(): Context<TValue>;
/**
 * Retrieves the value from the current context
 */
export declare function useContext<TValue>(context: Context<TValue>): TValue;
