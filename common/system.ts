export * from './system/debounce';
export * from './system/defer';
export * from './system/events';
export * from './system/log';

export interface Disposable {
	dispose(): void;
}

declare global {
	interface EventTarget<EventMap = {}> {
		// Needed get EventMap<T> to work below
		readonly map?: EventMap;

		addEventListener<EventName extends keyof EventMap>(
			eventName: EventName,
			eventListener: (eventName: EventMap[EventName]) => void
		): void;
		removeEventListener<EventName extends keyof EventMap>(
			eventName: EventName,
			eventListener: (event: EventMap[EventName]) => void
		): void;
	}
}

type EventMap<T> = T extends EventTarget<infer EM> ? EM : never;

export function addEventListener<T extends EventTarget<EventMap<T>>, TEventName extends keyof EventMap<T>>(
	element: T,
	eventName: TEventName,
	eventListener: (e: EventMap<T>[TEventName]) => void
): Disposable {
	element.addEventListener(eventName, eventListener);
	return {
		dispose: () => element.removeEventListener(eventName, eventListener)
	};
}