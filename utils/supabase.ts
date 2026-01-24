
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

/**
 * IMPORTANTE:
 * O Supabase requer chaves PRÓPRIAS que você encontra no Dashboard do Supabase
 * em Settings > API. A Gemini API Key (process.env.API_KEY) NÃO funciona aqui.
 * 
 * Usamos placeholders caso as variáveis de ambiente não estejam definidas para 
 * evitar que a aplicação quebre no carregamento inicial (erro "supabaseKey is required").
 */

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'orkzfgmkwjoxsjlvyzwh';

if (supabaseAnonKey === 'no-key-provided-check-env-vars') {
  console.warn("Supabase Warning: SUPABASE_ANON_KEY não encontrada. As funcionalidades de banco de dados estarão inoperantes.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
