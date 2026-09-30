/**
 * Event source bridge for MFE communication.
 *
 * @example
 * const bridge = inject(MfeSseBridge);
 * bridge.connect('http://localhost:8080/events');
 */
import { computed, Injectable, signal } from '@angular/core';

export interface MfeEvent {
  id: string;
  type: string;
  source: string;
  timestamp: string;
  payload: unknown;
}

export function getMfeEventMessage(event: MfeEvent | undefined): string {
  if (
    event &&
    typeof event.payload === 'object' &&
    event.payload !== null &&
    'message' in event.payload &&
    typeof event.payload.message === 'string'
  ) {
    return event.payload.message;
  }

  return event ? `${event.type} reçu depuis ${event.source}.` : 'En attente du serveur SSE…';
}

@Injectable({ providedIn: 'root' })
export class MfeSseBridge {
  private source?: EventSource;
  private unsubscribe?: () => void;
  private readonly receivedEvents = signal<MfeEvent[]>([]);
  private readonly connectionError = signal('');

  readonly connected = signal(false);
  readonly events = this.receivedEvents.asReadonly();
  readonly error = this.connectionError.asReadonly();
  readonly latestEvent = computed(() => this.events()[0]);

  connect(url: string): EventSource {
    if (this.source) {
      return this.source;
    }

    this.connectionError.set('');
    this.source = new EventSource(url);
    this.source.onopen = () => this.connected.set(true);
    this.source.onerror = () => this.connected.set(false);
    this.unsubscribe = this.subscribe(
      this.source,
      (event) => {
        this.connectionError.set('');
        this.receivedEvents.update((events) => [event, ...events].slice(0, 5));
      },
      (error) => this.connectionError.set(error.message),
    );
    return this.source;
  }

  subscribe(
    source: EventSource,
    callback: (event: MfeEvent) => void,
    onError: (error: Error) => void = console.error,
  ): () => void {
    const listener = (message: MessageEvent<string>) => {
      try {
        callback(this.parse(message.data));
      } catch (error: unknown) {
        onError(error instanceof Error ? error : new Error('Invalid SSE event.'));
      }
    };

    source.addEventListener('message', listener);
    return () => source.removeEventListener('message', listener);
  }

  disconnect(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.source?.close();
    this.source = undefined;
    this.connected.set(false);
  }

  private parse(data: string): MfeEvent {
    const value: unknown = JSON.parse(data);
    if (
      typeof value !== 'object' ||
      value === null ||
      !('id' in value) ||
      typeof value.id !== 'string' ||
      !('type' in value) ||
      typeof value.type !== 'string' ||
      !('source' in value) ||
      typeof value.source !== 'string' ||
      !('timestamp' in value) ||
      typeof value.timestamp !== 'string' ||
      !('payload' in value)
    ) {
      throw new Error('The SSE payload does not match the MfeEvent contract.');
    }

    return {
      id: value.id,
      type: value.type,
      source: value.source,
      timestamp: value.timestamp,
      payload: value.payload,
    };
  }
}
