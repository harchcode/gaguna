// See: https://gameprogrammingpatterns.com/observer.html

export type SubscriberFn<T> = (newVal: T, oldVal: T) => void;

export class Observable<T> {
  private _val: T;
  private _subs = new Set<SubscriberFn<T>>();

  get val(): T {
    return this._val;
  }

  set val(value: T) {
    const oldVal = this._val;
    this._val = value;

    for (const sub of this._subs) {
      sub(value, oldVal);
    }
  }

  constructor(initialValue: T) {
    this._val = initialValue;
  }

  subscribe(fn: SubscriberFn<T>): () => void {
    this._subs.add(fn);

    return () => {
      this._subs.delete(fn);
    };
  }
}

export function createObservable<T>(initialValue: T): Observable<T> {
  return new Observable<T>(initialValue);
}
