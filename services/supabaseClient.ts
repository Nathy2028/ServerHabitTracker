import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'
import type { Database } from '../types.js'

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  throw new Error('Faltan las variables de entorno de Supabase')
}

export const supabase = createClient<Database>(url, key)