import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly messages = signal<string[]>([]);

  readonly messagesSignal = this.messages;

  notify(message: string): void {
    this.messages.update((current) => [message, ...current].slice(0, 5));
  }

  clear(): void {
    this.messages.set([]);
  }
}
