import type * as Types from "./Types";

declare namespace Fusion {
	// General
	const version: Types.Version;
	const Contextual: Types.ContextualConstructor;
	const Safe: Types.Safe;

	// Memory
	/** @deprecated use `doCleanup()` instead */
	const cleanup: (task: Types.Task) => void;
	const deriveScope: Types.DeriveScopeConstructor;
	const doCleanup: (task: Types.Task) => void;
	const innerScope: Types.DeriveScopeConstructor;
	const queueScope: <T extends Types.Task[]>(scope: Types.Scope<unknown>, ...tasks: T) => LuaTuple<T>;
	const scoped: Types.ScopedConstructor;

	// State
	const expect: Types.Use;
	const Computed: Types.ComputedConstructor;
	const ForKeys: Types.ForKeysConstructor;
	const ForPairs: Types.ForPairsConstructor;
	const ForValues: Types.ForValuesConstructor;
	const Observer: Types.ObserverConstructor;
	const peek: Types.Use;
	const Value: Types.ValueConstructor;

	// Roblox API
	const Attribute: (attributeName: string) => Types.SpecialKey;
	const AttributeChange: (attributeName: string) => Types.SpecialKey;
	const AttributeOut: (attributeName: string) => Types.SpecialKey;
	const Child: (children: Types.Child[]) => Types.Child;
	const Children: Types.SpecialKey;
	const Hydrate: Types.HydrateConstructor;
	const New: Types.NewConstructor;
	const OnChange: (propertyName: string) => Types.SpecialKey;
	const OnEvent: (eventName: string) => Types.SpecialKey;
	const Out: (propertyName: string) => Types.SpecialKey;

	// Animation
	const Tween: Types.TweenConstructor;
	const Spring: Types.SpringConstructor;

	// Types
	type Animatable = Types.Animatable;
	type UsedAs<T> = Types.UsedAs<T>;
	type Child = Types.Child;
	type Computed<T> = Types.Computed<T>;
	type Contextual<T> = Types.Contextual<T>;
	type For<KO, VO> = Types.For<KO, VO>;
	type Observer = Types.Observer;
	type PropertyTable = Types.PropertyTable;
	type Scope<T = any> = Types.Scope<T>;
	type ScopedObject = Types.ScopedObject;
	type SpecialKey = Types.SpecialKey;
	type Spring<T> = Types.Spring<T>;
	type StateObject<T> = Types.StateObject<T>;
	type Task = Types.Task;
	type Tween<T> = Types.Tween<T>;
	type Use = Types.Use;
	type Value<T, S = T> = Types.Value<T, S>;
	type Version = Types.Version;
}

export = Fusion;
export as namespace Fusion;
