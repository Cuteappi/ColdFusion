import type * as Types from "./Types";


export = ColdFusion;
export as namespace ColdFusion;

declare namespace ColdFusion {
	// General
	const version: Types.Version;
	export const Contextual: Types.ContextualConstructor;
	export const Safe: Types.Safe;

	// Memory
	/** @deprecated use `doCleanup()` instead */
	export const cleanup: (task: Types.Task) => void;
	export const deriveScope: Types.DeriveScopeConstructor;
	export const doCleanup: (task: Types.Task) => void;
	export const innerScope: Types.DeriveScopeConstructor;
	export const queueScope: <T extends Types.Task[]>(scope: Types.Scope<unknown>, ...tasks: T) => LuaTuple<T>;
	export const scoped: Types.ScopedConstructor;

	// State
	export const expect: Types.Use;
	export const Computed: Types.ComputedConstructor;
	export const ForKeys: Types.ForKeysConstructor;
	export const ForPairs: Types.ForPairsConstructor;
	export const ForValues: Types.ForValuesConstructor;
	export const Observer: Types.ObserverConstructor;
	export const peek: Types.Use;
	export const Value: Types.ValueConstructor;

	// Roblox API
	export const Attribute: (attributeName: string) => Types.SpecialKey;
	export const AttributeChange: (attributeName: string) => Types.SpecialKey;
	export const AttributeOut: (attributeName: string) => Types.SpecialKey;
	export const Child: (children: Types.Child[]) => Types.Child;
	export const Children: Types.SpecialKey;
	export const Hydrate: Types.HydrateConstructor;
	export const New: Types.NewConstructor;
	export const OnChange: (propertyName: string) => Types.SpecialKey;
	export const OnEvent: (eventName: string) => Types.SpecialKey;
	export const Out: (propertyName: string) => Types.SpecialKey;

	// Animation
	export const Tween: Types.TweenConstructor;
	export const Spring: Types.SpringConstructor;

	// Types
	export type Animatable = Types.Animatable;
	export type UsedAs<T> = Types.UsedAs<T>;
	export type Child = Types.Child;
	export type Computed<T> = Types.Computed<T>;
	export type Constructors = Types.Constructors;
	export type Contextual<T> = Types.Contextual<T>;
	export type For<KO, VO> = Types.For<KO, VO>;
	export type Observer = Types.Observer;
	export type PropertyTable = Types.PropertyTable<Instance>;
	export type Scope<Constructors> = Types.Scope<Constructors>;
	export type ScopedObject = Types.ScopedObject;
	export type SpecialKey = Types.SpecialKey;
	export type Spring<T> = Types.Spring<T>;
	export type StateObject<T> = Types.StateObject<T>;
	export type Task = Types.Task;
	export type Tween<T> = Types.Tween<T>;
	export type Use = Types.Use;
	export type Value<T, S = T> = Types.Value<T, S>;
	export type Version = Types.Version;
}

