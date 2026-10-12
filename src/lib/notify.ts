/* One-line confirmations ("Filed: PAN card."), announced politely and shown briefly. */

type Listener = (message: string) => void;

const listeners = new Set<Listener>();

export function notify(message: string) {
  listeners.forEach((listener) => listener(message));
}

export function onNotify(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
