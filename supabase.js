
import { createClient } from '@supabase/supabase-js'


//console.log(process.env.EXPO_PUBLIC_SUPABASE_URL)
//console.log(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY)
//console.log('//')
export const supabase = createClient('https://nvotthybnzbynsvvvdfx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52b3R0aHlibnpieW5zdnZ2ZGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjI0MzUsImV4cCI6MjA1OTkzODQzNX0.vCFzboCMgwIenSlOuIwxiFRIoYTtbhUo5_cR2p3aJOE', {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})


///Teachers Panel database

const supabaseUrlTeach = `https://fitzygwmvtezlixlvnmn.supabase.co`
const supabaseAnonKeyTeach = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpdHp5Z3dtdnRlemxpeGx2bm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjM5OTQsImV4cCI6MjA1OTkzOTk5NH0.CHEIerVMmTfI83a7dZoj6Wc_JnbyjX7IbTgpm740VDk`

export const supabaseTeach = createClient(supabaseUrlTeach, supabaseAnonKeyTeach, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})