import { MfeSseBridge, type MfeEvent } from './mfe-sse';

describe('MfeSseBridge', () => {
  it('parses and forwards messages from an event source', () => {
    const bridge = new MfeSseBridge();
    let listener: ((event: MessageEvent<string>) => void) | undefined;
    const source = {
      addEventListener: (_type: string, callback: (event: MessageEvent<string>) => void) => {
        listener = callback;
      },
      removeEventListener: vi.fn(),
    } as unknown as EventSource;
    let received: MfeEvent | undefined;

    bridge.subscribe(source, (event) => (received = event));
    listener?.({
      data: JSON.stringify({
        id: 'evt-1',
        type: 'product.updated',
        source: 'mfe-products',
        timestamp: '2026-09-30T06:00:00.000Z',
        payload: { id: 'p-1' },
      }),
    } as MessageEvent<string>);

    expect(received).toEqual({
      id: 'evt-1',
      type: 'product.updated',
      source: 'mfe-products',
      timestamp: '2026-09-30T06:00:00.000Z',
      payload: { id: 'p-1' },
    });
  });

  it('reports malformed messages without forwarding them', () => {
    const bridge = new MfeSseBridge();
    let listener: ((event: MessageEvent<string>) => void) | undefined;
    const source = {
      addEventListener: (_type: string, callback: (event: MessageEvent<string>) => void) => {
        listener = callback;
      },
    } as unknown as EventSource;
    const callback = vi.fn();
    const onError = vi.fn();

    bridge.subscribe(source, callback, onError);
    listener?.({ data: '{"type":"product.updated"}' } as MessageEvent<string>);

    expect(callback).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });
});
