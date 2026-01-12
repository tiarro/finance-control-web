# Testing Documentation

## Overview
This project uses **Jest** and **React Testing Library** for unit and integration testing.

## Test Structure

```
finance-control-web/
├── components/
│   └── auth/
│       ├── auth-form.tsx
│       ├── auth-form.test.tsx          # Component tests
│       ├── logout-button.tsx
│       └── logout-button.test.tsx      # Component tests
├── app/
│   └── (auth)/
│       ├── login/
│       │   ├── actions.ts
│       │   └── actions.test.ts         # Server action tests
│       └── logout/
│           ├── actions.ts
│           └── actions.test.ts         # Server action tests
├── utils/
│   └── supabase/
│       ├── middleware.ts
│       └── middleware.test.ts          # Middleware tests
├── jest.config.ts                      # Jest configuration
└── jest.setup.ts                       # Test setup & mocks
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (auto-rerun on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test auth-form.test.tsx
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="login"
```

## Test Coverage

Current test files cover:

### ✅ Components
- **AuthForm** - Form rendering, field validation, user interactions
- **LogoutButton** - Button rendering, click handlers

### ✅ Server Actions
- **Login Action** - Authentication flow, error handling, redirects
- **Logout Action** - Sign out flow, session cleanup

### ✅ Middleware
- **updateSession** - Route protection, authentication redirects

## Writing New Tests

### Component Test Example
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { YourComponent } from './your-component'

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const user = userEvent.setup()
    render(<YourComponent />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(screen.getByText('Result')).toBeInTheDocument()
  })
})
```

### Server Action Test Example
```typescript
import { yourAction } from './actions'
import { createClient } from '@/utils/supabase/server'

jest.mock('@/utils/supabase/server')

describe('yourAction', () => {
  it('performs action successfully', async () => {
    const mockClient = { /* mock methods */ }
    ;(createClient as jest.Mock).mockResolvedValue(mockClient)
    
    const result = await yourAction()
    
    expect(result).toBeDefined()
  })
})
```

## Mocking

### Supabase Client
Automatically mocked in `jest.setup.ts` for all tests.

### Next.js Navigation
- `redirect()` - Mocked globally
- `useRouter()` - Mocked globally
- `usePathname()` - Mocked globally

### Environment Variables
Set in `jest.setup.ts`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Best Practices

1. **Test user behavior, not implementation details**
   - Use `screen.getByRole()` instead of `getByTestId()`
   - Test what users see and do

2. **Keep tests isolated**
   - Use `beforeEach()` to reset mocks
   - Don't rely on test execution order

3. **Use descriptive test names**
   - Good: `it('redirects to dashboard after successful login')`
   - Bad: `it('works')`

4. **Test edge cases**
   - Empty inputs
   - Network errors
   - Invalid data

5. **Maintain high coverage**
   - Aim for >80% coverage
   - Focus on critical paths first

## Troubleshooting

### Tests fail with "Cannot find module"
- Check `moduleNameMapper` in `jest.config.ts`
- Ensure path aliases match `tsconfig.json`

### "ReferenceError: fetch is not defined"
- Update to Node.js 18+ (has native fetch)
- Or install `whatwg-fetch` polyfill

### Tests timeout
- Increase timeout: `jest.setTimeout(10000)`
- Check for unresolved promises

### Mock not working
- Ensure mock is called before importing the module
- Use `jest.clearAllMocks()` in `beforeEach()`

## CI/CD Integration

Add to your CI pipeline:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test -- --ci --coverage --maxWorkers=2
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)
