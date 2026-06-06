import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ncfupknjtossgggiayca.supabase.co'
const SUPABASE_KEY = 'sb_publishable_R7DcxyM0txjzo-WGt9zlYA_CDuvoPpX'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)