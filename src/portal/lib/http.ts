/**
 * readResponseBodySafely — avoids "Unexpected end of JSON input" when body is empty or HTML.
 */
export async function readErrorFromResponse(res: Response): Promise<string> {
  const text = (await res.text()).trim();

  if (!text) {
    if (res.status === 404) {
      return 'Ruta nije pronađena. Lokalno Netlify funkcije rade samo sa „netlify dev“, ne sa „npm run dev“.';
    }
    return `Server je vratio prazan odgovor (HTTP ${res.status}).`;
  }

  try {
    const j = JSON.parse(text) as { error?: string; message?: string };
    return j.error || j.message || text.slice(0, 400);
  } catch {
    if (text.includes('<!DOCTYPE') || text.includes('<html')) {
      return 'Server je vratio HTML umesto JSON-a — verovatno `.netlify/functions/` nije dostupan. Pokreni: npx netlify dev';
    }
    return text.slice(0, 400);
  }
}
