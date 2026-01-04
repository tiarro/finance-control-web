'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  // Assuming email confirmation is disabled for development or handling standard flow
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // If email confirmation is enabled, they won't be logged in yet.
  // Ideally show a message. For now, redirect to login with query param.
  
  // Note: if auto-confirm is on, they are logged in.
  // We'll redirect to login, if it bounces back to login it means they need to confirm email.
  
  revalidatePath('/', 'layout')
  redirect('/login')
}
