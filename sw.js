/// <reference lib="WebWorker" />

interface ExtendableEvent {
  waitUntil(promise: Promise<any>): void;
}

interface FetchEvent extends ExtendableEvent {
  request: Request;
  respondWith(response: Response): void;
  preloadResponse: Promise<Response> | null;
}

interface ExtendableMessageEvent extends ExtendableEvent {
  data: any;
}

interface ServiceWorkerGlobalScope {
  clients: any;
  location: Location;
  caches: any;
  addEventListener<K extends keyof ServiceWorkerGlobalScopeEventMap>(
    type: K,
    listener: (this: ServiceWorker, ev: ServiceWorkerGlobalScopeEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
}

interface ServiceWorkerGlobalScopeEventMap {
  fetch: FetchEvent;
  message: ExtendableMessageEvent;
  install: ExtendableEvent;
  activate: ExtendableEvent;
}

const self = <ServiceWorkerGlobalScope>_;
const origin = self.location.origin;
const cacheName = "167e1f07-b59a-474
