import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ebisacqpllyljnyjjhek.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_JIK7kSNVQt5tYYWZtgiaRA_80QgSMpj'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
