export function hintPost(message?: string): string | undefined {
  const m = (message || '').toLowerCase();
  if (!m) return undefined;
  if (
    m.includes('invalid api key')
    || m.includes('jwt expired')
    || (m.includes('jwt') && (m.includes('invalid') || m.includes('wrong') || m.includes('malformed')))
  ) {
    return 'Često je podešavanje: ceo service_role JWT u Vercelu (bez dodatnih navodnika), isti projekat kao SUPABASE_URL. Obnovi deployment posle izmene env.';
  }
  if ((m.includes('relation') || m.includes('table')) && m.includes('does not exist')) {
    return 'Tabela seo_projects ili šema — proveri da su migracije u Supabase pokrenute (public.seo_projects).';
  }
  if (m.includes('invalid input syntax for type uuid') || m.includes('22p02')) {
    return 'seo_project_id mora biti validan UUID iz seo_projects.id.';
  }
  return undefined;
}
