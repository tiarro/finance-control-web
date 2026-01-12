import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Polyfill for TextEncoder/TextDecoder (needed for Next.js server components)
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

// Polyfill for Request, Response, Headers (needed for Next.js middleware)
if (typeof global.Request === 'undefined') {
  global.Request = class Request {} as any
}
if (typeof global.Response === 'undefined') {
  global.Response = class Response {} as any
}
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {} as any
}

// Mock environment variables for testing
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return ''
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  redirect: jest.fn(),
}))
