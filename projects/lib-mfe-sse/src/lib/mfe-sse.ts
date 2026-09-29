/**
 * Event source bridge for MFE communication.
 *
 * @example
 * const bridge = inject(MfeSseBridge);
 * bridge.connect('http://localhost:8080/events');
 */
import { Injectable, signal } from '@angular/core';

export interface MfeEvent {
  type: string;
  payload: unknown;
}

@Injectable({ providedIn: 'root' })
export class MfeSseBridge {
  readonly connected = signal(false);

  connect(url: string): EventSource {
    const source = new EventSource(url);
    source.onopen = () => this.connected.set(true);
    source.onerror = () => this.connected.set(false);
    return source;
  }

  subscribe(source: EventSource, callback: (event: MfeEvent) => void): void {
    source.onmessage = (event) => callback(JSON.parse(event.data) as MfeEvent);
  }
}
