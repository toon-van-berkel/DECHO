export interface State<TData> {
    name?: string;
    transitions: string[];
    onEnter?: (context: {
        from: string;
        eventData?: any;
        data: TData;
    }) => boolean | void;
    onState?: () => any;
    onExit?: (context: {
        to: string;
        data: TData;
    }) => boolean | void;
    onUpdate?: (data: TData, elapsed: number) => any;
}
export interface StateMachineDescription<TData = any> {
    start: string;
    states: {
        [name: string]: State<TData>;
    };
}
export type PossibleStates<TMachine> = TMachine extends StateMachineDescription ? Extract<keyof TMachine['states'], string> : never;
export interface StateMachineState<TData> {
    data: TData;
    currentState: string;
}
export declare class StateMachine<TPossibleStates extends string, TData> {
    startState: State<TData>;
    private _currentState;
    get currentState(): State<TData>;
    set currentState(state: State<TData>);
    states: Map<string, State<TData>>;
    data: TData;
    static create<TMachine extends StateMachineDescription<TData>, TData>(machineDescription: TMachine, data?: TData): StateMachine<PossibleStates<TMachine>, TData>;
    in(state: TPossibleStates): boolean;
    go(stateName: TPossibleStates, eventData?: any): boolean;
    update(elapsed: number): void;
    save(saveKey: string): void;
    restore(saveKey: string): void;
}
