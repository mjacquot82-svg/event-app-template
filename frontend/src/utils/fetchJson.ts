export async function parseJsonResponse<T>(response: Response, endpoint: string): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const body = await response.text();
  const snippet = body.slice(0, 120).replace(/\s+/g, ' ').trim();

  if (!response.ok) {
    throw new Error(
      `Request to ${endpoint} failed with ${response.status} ${response.statusText}. ` +
      `Response starts with: ${snippet || '<empty>'}`
    );
  }

  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error(
      `Expected JSON from ${endpoint}, received ${contentType || 'unknown content type'}. ` +
      `Response starts with: ${snippet || '<empty>'}`
    );
  }

  try {
    return JSON.parse(body) as T;
  } catch (error) {
    throw new Error(
      `Invalid JSON from ${endpoint}. Response starts with: ${snippet || '<empty>'}. ` +
      `Parse error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
