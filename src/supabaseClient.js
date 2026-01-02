import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://siccammkprztjdrhhmyp.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_vC9FhTMNqW7va29LXb4BLg_hvQTJHXO'

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
