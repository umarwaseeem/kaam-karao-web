/**
 * Reads an SSE response stream and calls handler for each parsed event.
 * Uses fetch (not EventSource) so we can send Authorization headers.
 *
 * @param {Response} response  Raw fetch Response with stream body
 * @param {(event: {type:string, [key:string]: any}) => void} onEvent
 * @returns {Promise<void>}
 */
export async function readSSEStream(response, onEvent) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep incomplete last line

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === ':') continue; // heartbeat / empty
      if (trimmed.startsWith('data:')) {
        const raw = trimmed.slice(5).trim();
        if (raw === '[DONE]') { onEvent({ type: 'done' }); return; }
        try {
          const parsed = JSON.parse(raw);
          onEvent(parsed);
        } catch {
          // non-JSON data line — ignore
        }
      }
    }
  }
}
