import { logout } from './actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Mock dependencies
jest.mock('@/utils/supabase/server')
jest.mock('next/navigation')
jest.mock('next/cache')

describe('Logout Action', () => {
  const mockSignOut = jest.fn()
  const mockSupabase = {
    auth: {
      signOut: mockSignOut,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)
  })

  it('successfully logs out user and redirects to login', async () => {
    mockSignOut.mockResolvedValue({ error: null })

    await logout()

    expect(createClient).toHaveBeenCalledTimes(1)
    expect(mockSignOut).toHaveBeenCalledTimes(1)
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    expect(redirect).toHaveBeenCalledWith('/login')
  })

  it('logs out even if signOut returns an error', async () => {
    mockSignOut.mockResolvedValue({ 
      error: { message: 'Session already expired' } 
    })

    await logout()

    expect(mockSignOut).toHaveBeenCalledTimes(1)
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    expect(redirect).toHaveBeenCalledWith('/login')
  })

  it('handles network errors during logout', async () => {
    mockSignOut.mockRejectedValue(new Error('Network error'))

    await expect(logout()).rejects.toThrow('Network error')
    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })
})
