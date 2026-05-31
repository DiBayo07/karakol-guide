import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xxhskmmdpsmpdcbfwngk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4aHNrbW1kcHNtcGRjYmZ3bmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDQzMjQsImV4cCI6MjA5NTMyMDMyNH0.eV_b_ee2DwmHWUp2guw_TbnDkaiOvQX7MgDo8V5134s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
