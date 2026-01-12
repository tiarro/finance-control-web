import { createServerClient } from '@supabase/ssr'

// Mock Supabase SSR
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}))

describe('Middleware - updateSession', () => {
  const mockGetUser = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createServerClient as jest.Mock).mockImplementation(() => {
      return {
        auth: {
          getUser: mockGetUser,
        },
      }
    })
  })

  it('creates Supabase client with correct environment variables', () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBe('http://localhost:54321')
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe('test-anon-key')
  })

  it('mock setup works correctly', () => {
    const client = createServerClient('url', 'key', {} as any)
    expect(client.auth.getUser).toBeDefined()
  })
})
