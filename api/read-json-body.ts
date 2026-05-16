/**
 * Vercel Node: `request.body` je getter — pogrešan JSON baca bez try/catch.
 * Ne dodiruj `req.body` van try bloka kad je payload JSON.
 */
export async function readJsonBody(req: { body?: unknown } & Partial<AsyncIterable<Buffer | string>>): Promise<Record<string, unknown>> {
  try {
    const raw = req.body;
    if (raw != null) {
      if (typeof raw === 'object' && !Buffer.isBuffer(raw)) return raw as Record<string, unknown>;
      if (typeof raw === 'string') {
        const t = raw.trim();
        return t === '' ? {} : JSON.parse(t) as Record<string, unknown>;
      }
      if (Buffer.isBuffer(raw)) {
        const t = raw.toString('utf8').trim();
        return t === '' ? {} : JSON.parse(t) as Record<string, unknown>;
      }
    }
  } catch (e: unknown) {
    const m = e instanceof Error ? e.message : String(e);
    throw new Error(`Neuspelo čitanje tela (JSON?): ${m}`);
  }

  if (typeof (req as AsyncIterable<Buffer | string>)[Symbol.asyncIterator] === 'function') {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req as AsyncIterable<Buffer | string>)
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      const t = Buffer.concat(chunks).toString('utf-8').trim();
      return t === '' ? {} : JSON.parse(t) as Record<string, unknown>;
    } catch {
      throw new Error('Neispravan JSON u telu zahteva');
    }
  }
  return {};
}
