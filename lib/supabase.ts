
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// @ts-ignore
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadImage(file:any) {
  const { data, error } = await supabase.storage.from('ofiempleo').upload('/profileImages', file)
  if (error) {
    console.error(error)
  } else {
    return data;
  }
}