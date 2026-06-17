export type EventMap = Record<string, any>;
export type EventKey<T extends EventMap> = string & keyof T;
export type Handler<EventType> = (event: EventType) => void;
/**
 * Interface that represents a handle to a subscription that can be closed
 */
export interface Subscription {
    /**
     * Removes the associated event handler, synonymous with events.off(...);
     */
    close(): void;
}
/**
 * Excalibur's typed event emitter, this allows events to be sent with any string to Type mapping
 */
export declare class EventEmitter<TEventMap extends EventMap = any> {
    private _paused;
    private _empty;
    private _listeners;
    private _listenersOnce;
    private _pipes;
    /**
     * Removes all listeners and pipes
     */
    clear(): void;
    on<TEventName extends EventKey<TEventMap>>(eventName: TEventName, handler: Handler<TEventMap[TEventName]>): Subscription;
    on(eventName: string, handler: Handler<unknown>): Subscription;
    once<TEventName extends EventKey<TEventMap>>(eventName: TEventName, handler: Handler<TEventMap[TEventName]>): Subscription;
    once(eventName: string, handler: Handler<unknown>): Subscription;
    off<TEventName extends EventKey<TEventMap>>(eventName: TEventName, handler: Handler<TEventMap[TEventName]>): void;
    off(eventName: string, handler: Handler<unknown>): void;
    off(eventName: string): void;
    emit<TEventName extends EventKey<TEventMap>>(eventName: TEventName, event: TEventMap[TEventName]): void;
    emit(eventName: string, event?: any): void;
    /**
     * Replay events from this emitter to another
     * @param emitter
     */
    pipe(emitter: EventEmitter<any>): Subscription;
    /**
     * Remove any piped emitters
     * @param emitter
     */
    unpipe(emitter: EventEmitter<any>): void;
    /**
     * Paused event emitters do not emit events
     */
    pause(): void;
    /**
     * Unpaused event emitter do emit events
     */
    unpause(): void;
}
