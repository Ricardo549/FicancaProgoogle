
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = 'https://orkzfgmkwjoxsjlvyzwh.supabase.co';
// Em um ambiente real, a chave anon seria injetada via variável de ambiente.
// Aqui usaremos um placeholder que representa a chave pública do seu projeto.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
