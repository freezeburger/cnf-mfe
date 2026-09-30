import { MfeSseBridge, type MfeEvent } from './mfe-sse';

describe('MfeSseBridge', () => {
  it('parses and forwards messages from an event source', () => {
    const bridge = new MfeSseBridge();
    const source = { onmessage: null } as EventSource;
    let received: MfeEvent | undefined;

    bridge.subscribe(source, (event) => (received = event));
    source.onmessage?.({
      data: JSON.stringify({ type: 'product.updated', payload: { id: 'p-1' } }),
    } as MessageEvent);

    expect(received).toEqual({ type: 'product.updated', payload: { id: 'p-1' } });
  });
});
