import { login } from './actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Mock dependencies
jest.mock('@/utils/supabase/server')
jest.mock('next/navigation')
jest.mock('next/cache')

describe('Login Action', () => {
  const mockSignInWithPassword = jest.fn()
  const mockSupabase = {
    auth: {
      signInWithPassword: mockSignInWithPassword,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)
  })

  it('successfully logs in user and redirects to dashboard', async () => {
    mockSignInWithPassword.mockResolvedValue({ 
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null 
    })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('password', 'password123')

    await login(null, formData)

    expect(createClient).toHaveBeenCalledTimes(1)
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    expect(redirect).toHaveBeenCalledWith('/dashboard')
  })

  it('returns error when login fails', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('password', 'wrongpassword')

    const result = await login(null, formData)

    expect(result).toEqual({ error: 'Could not authenticate user' })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('handles missing email', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Email is required' },
    })

    const formData = new FormData()
    formData.append('password', 'password123')

    const result = await login(null, formData)

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: null,
      password: 'password123',
    })
    expect(result).toEqual({ error: 'Could not authenticate user' })
  })

  it('handles missing password', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Password is required' },
    })

    const formData = new FormData()
    formData.append('email', 'test@example.com')

    const result = await login(null, formData)

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: null,
    })
    expect(result).toEqual({ error: 'Could not authenticate user' })
  })

  it('handles network errors gracefully', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Network error' },
    })

    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('password', 'password123')

    const result = await login(null, formData)

    expect(result).toEqual({ error: 'Could not authenticate user' })
    expect(redirect).not.toHaveBeenCalled()
  })
})
