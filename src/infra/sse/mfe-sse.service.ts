import { Injectable } from '@angular/core';

import { MfeSseBridge, type MfeEvent } from 'mfe-sse';

import { environment } from '../../environments';

@Injectable({ providedIn: 'root' })
export class MfeSseService {
  private readonly bridge = new MfeSseBridge();

  readonly connected = this.bridge.connected;

  connect(url: string = environment.sseUrl): EventSource {
    return this.bridge.connect(url);
  }

  subscribe(source: EventSource, callback: (event: MfeEvent) => void): void {
    this.bridge.subscribe(source, callback);
  }
}
