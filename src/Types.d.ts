/**
 * Type definitions for Fusion
 * Stores common public-facing type information for Fusion APIs.
 */

export interface Error {
    type: "Error";
    raw: string;
    message: string;
    trace: string;
    context?: string;
}

// Types that can be expressed as vectors of numbers, and so can be animated.
export type Animatable =
    number |
    CFrame |
    Color3 |
    ColorSequenceKeypoint |
    DateTime |
    NumberRange |
    NumberSequenceKeypoint |
    PhysicalProperties |
    Ray |
    Rect |
    Region3 |
    Region3int16 |
    UDim |
    UDim2 |
    Vector2 |
    Vector2int16 |
    Vector3 |
    Vector3int16;

// A task which can be accepted for cleanup.
export type Task =
    Instance |
    RBXScriptConnection |
    (() => void) |
    { destroy: (...arg0: unknown[]) => void } |
    { Destroy: (...arg0: unknown[]) => void } |
    Task[];

// A scope of tasks to clean up.
export type Scope<Constructors = any> = Task[] & Constructors;

// An object which uses a scope to dictate how long it lives.
export interface ScopedObject {
    scope?: Scope<unknown>;
    oldestTask: unknown;
}

// Script-readable version information.
export interface Version {
    major: number;
    minor: number;
    isRelease: boolean;
}

// An object which stores a value scoped in time.
export interface Contextual<T> {
    type: "Contextual";
    now: () => T;
    is: (value: T) => ContextualIsMethods;
}

interface ContextualIsMethods {
    during: <R, A extends unknown[]>(callback: (...args: A) => R, ...args: A) => R;
}

// A graph object which can have dependencies and dependents.
export interface GraphObject extends ScopedObject {
    createdAt: number;
    dependencySet: Map<GraphObject, unknown>;
    dependentSet: Map<GraphObject, unknown>;
    lastChange?: number;
    timeliness: "lazy" | "eager";
    validity: "valid" | "invalid" | "busy";
    _evaluate: () => boolean;
}

// An object which stores a piece of reactive state.
export interface StateObject<T> extends GraphObject {
    type: "State";
    kind: string;
    _EXTREMELY_DANGEROUS_usedAsValue: T;
}

// Passing values of this type to `Use` returns `T`.
export type UsedAs<T> = StateObject<T> | T;

// Function signature for use callbacks.
export type Use = <T>(target: UsedAs<T>) => T;

// A state object whose value can be set at any time by the user.
export interface Value<T, S = T> extends StateObject<T> {
    kind: "State";
    timeliness: "lazy";
    set: (self: Value<T, S>, newValue: S, force?: boolean) => S;
    ____phantom_setType: (arg0: never) => S; // phantom data so this contains S
}

export type ValueConstructor = <T>(
    scope: Scope<unknown>,
    initialValue: T
) => Value<T, any>;

// A state object whose value is derived from other objects using a callback.
export interface Computed<T> extends StateObject<T> {
    kind: "Computed";
    timeliness: "lazy";
}

export type ComputedConstructor = <T, S>(
    scope: S & Scope<unknown>,
    callback: (use: Use, scope: S) => T
) => Computed<T>;

// A state object which maps over keys and/or values in another table.
export interface For<KO, VO> extends StateObject<Map<KO, VO>> {
    kind: "For";
}

export type ForPairsConstructor = <KI, KO, VI, VO, S>(
    scope: S & Scope<unknown>,
    inputTable: UsedAs<Map<KI, VI>>,
    processor: (use: Use, scope: S, key: KI, value: VI) => [KO, VO]
) => For<KO, VO>;

export type ForKeysConstructor = <KI, KO, V, S>(
    scope: S & Scope<unknown>,
    inputTable: UsedAs<Map<KI, V>>,
    processor: (use: Use, scope: S, key: KI) => KO
) => For<KO, V>;

export type ForValuesConstructor = <K, VI, VO, S>(
    scope: S & Scope<unknown>,
    inputTable: UsedAs<Map<K, VI>>,
    processor: (use: Use, scope: S, value: VI) => VO
) => For<K, VO>;

// An object which can listen for updates on another state object.
export interface Observer extends GraphObject {
    type: "Observer";
    timeliness: "eager";
    onChange: (callback: () => void) => () => void;
    onBind: (callback: () => void) => () => void;
}

export type ObserverConstructor = (
    scope: Scope<unknown>,
    watching: unknown
) => Observer;

// A state object which follows another state object using tweens.
export interface Tween<T> extends StateObject<T> {
    kind: "Tween";
}

export type TweenConstructor = <T>(
    scope: Scope<unknown>,
    goalState: UsedAs<T>,
    tweenInfo?: UsedAs<TweenInfo>
) => Tween<T>;

// A state object which follows another state object using spring simulation.
export interface Spring<T> extends StateObject<T> {
    kind: "Spring";
    setPosition: (newPosition: T) => void;
    setVelocity: (newVelocity: T) => void;
    addVelocity: (deltaVelocity: T) => void;
}

export type SpringConstructor = <T>(
    scope: Scope<unknown>,
    goalState: UsedAs<T>,
    speed?: UsedAs<number>,
    damping?: UsedAs<number>
) => Spring<T>;

// Denotes children instances in an instance or component's property table.
export interface SpecialKey {
	type: "SpecialKey"
	kind: string
	stage: "self" | "descendants" | "ancestor" | "observer"
	apply(scope: Scope<unknown>, value: unknown, applyTo: Instance): void
}

// A collection of instances that may be parented to another instance.
export type Child = Instance | StateObject<Child> | Map<unknown, Child>

// A table that defines an instance's properties, handlers and children.
export type PropertyTable = Map<string | SpecialKey, unknown>;

export type NewConstructor = (
    scope: Scope<unknown>,
    className: string
) => (propertyTable: PropertyTable) => Instance;

export type HydrateConstructor = (
    scope: Scope<unknown>,
    target: Instance
) => (propertyTable: PropertyTable) => Instance;

// Is there a sane way to write out this type?
// ... I sure hope so.

export type DeriveScopeConstructor = <Existing extends Scope<unknown>, AddMethods extends object[]>(
	existing: Existing,
	...addMethods: AddMethods
) => Scope<{
	[Key in keyof Existing | keyof AddMethods[number]]: Key extends keyof Existing
		? Existing[Key]
		: Key extends keyof AddMethods[number]
			? AddMethods[number][Key]
			: never
}>

export type ScopedConstructor = <Methods extends object[]>(
	...methods: Methods
) => Scope<{
	[Key in keyof Methods[number]]: Methods[number][Key]
}>

export type ContextualConstructor = <T>(defaultValue: T) => Contextual<T>;

export type Safe = <Success, Fail>(callbacks: {
    try: () => Success;
    fallback: (err: unknown) => Fail;
}) => Success | Fail;

export interface Fusion {
    version: Version;
    Contextual: ContextualConstructor;
    Safe: Safe;

    doCleanup: (task: Task) => void;
    scoped: ScopedConstructor;
    deriveScope: DeriveScopeConstructor;
    innerScope: DeriveScopeConstructor;

    peek: Use;
    Value: ValueConstructor;
    Computed: ComputedConstructor;
    ForPairs: ForPairsConstructor;
    ForKeys: ForKeysConstructor;
    ForValues: ForValuesConstructor;
    Observer: ObserverConstructor;

    Tween: TweenConstructor;
    Spring: SpringConstructor;

    New: NewConstructor;
    Hydrate: HydrateConstructor;

    Child: (props: Child[]) => Child;
    Children: SpecialKey;
    Out: (propertyName: string) => SpecialKey;
    OnEvent: (eventName: string) => SpecialKey;
    OnChange: (propertyName: string) => SpecialKey;
    Attribute: (attributeName: string) => SpecialKey;
    AttributeChange: (attributeName: string) => SpecialKey;
    AttributeOut: (attributeName: string) => SpecialKey;
}

export interface ExternalProvider {
    policies: {
        allowWebLinks: boolean;
    };

    logErrorNonFatal: (errorString: string) => void;
    logWarn: (errorString: string) => void;

    doTaskImmediate: (resume: () => void) => void;
    doTaskDeferred: (resume: () => void) => void;
    startScheduler: () => void;
    stopScheduler: () => void;
}

export interface ExternalDebugger {
    startDebugging: () => void;
    stopDebugging: () => void;

    trackScope: (scope: Scope<unknown>) => void;
    untrackScope: (scope: Scope<unknown>) => void;
}
