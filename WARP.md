# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Commands
```bash
# Start development server with hot reload at http://localhost:5173
npm run dev

# Create optimized production build in /dist folder
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality checks
npm run lint
```

### Testing & Debugging
```bash
# Run dev server on different port if 5173 is in use
npm run dev -- --port 3000

# Clear Vite cache if build issues occur
Remove-Item -Recurse -Force .vite
npm run dev

# Kill process on port 5173 (Windows)
npx kill-port 5173
```

## Architecture Overview

### Tech Stack
- **Framework**: React 18 with modern Hooks API
- **Build Tool**: Vite 7.x for fast HMR and optimized builds
- **Routing**: React Router DOM v7 with lazy-loaded routes
- **State Management**: Context API with useReducer pattern
- **Styling**: Modern CSS with custom properties (CSS variables)
- **Icons**: Heroicons React components

### State Management Architecture

The application uses a **dual-context pattern** for separation of concerns:

1. **AuthContext** (`src/contexts/AuthContext.jsx`)
   - Manages authentication state (user, loading, error)
   - Provides `useAuth()` hook with: `login()`, `register()`, `logout()`, `isAuthenticated`
   - Currently uses mock authentication (simulated API calls)
   - User object structure: `{ id, name, email, role: 'teacher'|'student' }`

2. **AppContext** (`src/contexts/AppContext.jsx`)
   - Manages application data using useReducer pattern
   - Handles assignments and submissions state
   - Provides `useApp()` hook with: `createAssignment()`, `submitAssignment()`
   - Reducer actions: `SET_LOADING`, `SET_ERROR`, `SET_ASSIGNMENTS`, `ADD_ASSIGNMENT`, `SET_SUBMISSIONS`, `ADD_SUBMISSION`

### Route Protection System

Protected routes use `ProtectedRoute` component (`src/components/ProtectedRoute.jsx`) with:
- Role-based access control via `requiredRole` prop
- Automatic redirect to `/login` for unauthenticated users
- Role mismatch redirects to home page
- Location state preservation for post-login redirects

Route structure:
- Public routes: `/`, `/login`, `/register`
- Teacher-only routes: `/teacher/*` (requires `role: 'teacher'`)
- Student-only routes: `/student/*` (requires `role: 'student'`)
- Shared protected routes: `/assignment/:id`, `/profile`

### Component Organization

```
src/
├── components/          # Reusable components
│   ├── ErrorBoundary.jsx    # Error handling wrapper
│   ├── LoadingSpinner.jsx   # Loading state UI
│   └── ProtectedRoute.jsx   # Route authentication guard
├── contexts/           # Global state providers
│   ├── AuthContext.jsx      # Authentication state
│   └── AppContext.jsx       # Application data state
├── pages/              # Route components (lazy loaded)
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── TeacherDashboard.jsx
│   ├── StudentDashboard.jsx
│   ├── AssignmentDetails.jsx
│   ├── ProfilePage.jsx
│   └── NotFoundPage.jsx
├── App.jsx             # Main app component with routing
├── App.css             # Component-specific styles
└── index.css           # Global styles and design system
```

### CSS Design System

The project uses a comprehensive CSS custom property system defined in `src/index.css`:

**Color palette**: Primary (blue shades 50-900), Secondary (gray shades 50-900), Success (green), Warning (orange), Error (red)

**Spacing scale**: 4px-based system (`--spacing-1` through `--spacing-16`)

**Typography**: Inter font family with fluid scaling using `clamp()` for responsive text

**Shadows**: Four levels (`--shadow-sm` through `--shadow-xl`)

**Transitions**: Three speeds (`--transition-fast`, `--transition-normal`, `--transition-slow`)

Access variables in CSS: `background-color: var(--primary-500);`

### Code Splitting & Performance

All pages are lazy-loaded using `React.lazy()` and `Suspense` in `App.jsx`:
```javascript
const HomePage = lazy(() => import('./pages/HomePage'));
```

This enables automatic code splitting and faster initial load times. The `LoadingSpinner` component provides fallback UI during lazy loading.

## Development Guidelines

### React Patterns Used

1. **Functional Components Only** - No class components
2. **Custom Hooks** - Extract reusable logic (see `useAuth()`, `useApp()`)
3. **Context + useReducer** - For complex state management instead of Redux
4. **Error Boundaries** - Wrap components for graceful error handling
5. **Lazy Loading** - All route components are code-split

### Adding New Features

**To add a new protected page:**
1. Create component in `src/pages/`
2. Add lazy import in `App.jsx`
3. Add route with `<ProtectedRoute>` wrapper if authentication required
4. Specify `requiredRole` prop if role-specific

**To add global state:**
1. Add action types to `appReducer` in `AppContext.jsx`
2. Add corresponding dispatch functions to the context value
3. Access via `useApp()` hook in components

**To modify authentication:**
- Edit `AuthContext.jsx` login/register functions
- Currently uses mock data; replace with real API calls
- User role determines dashboard access: 'teacher' or 'student'

### Styling Conventions

- Use CSS custom properties for all colors, spacing, and design tokens
- Mobile-first responsive design with `@media (min-width: ...)` queries
- Semantic HTML elements preferred (header, nav, main, section, article)
- Utility classes follow convention: `.btn-primary`, `.btn-secondary`, `.btn-outline`
- Component-specific styles go in `App.css`, global styles in `index.css`

### ESLint Configuration

Custom rules in `eslint.config.js`:
- Ignores capital letter variables (React components)
- Enforces React Hooks rules
- Uses React Refresh for HMR
- ECMAScript 2020+ features enabled

## Testing Approach

Currently uses manual testing. Before submitting code:

1. **Cross-browser**: Test in Chrome, Firefox, Safari, Edge
2. **Responsive**: Test on mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
3. **Authentication flows**: Test login/logout for both teacher and student roles
4. **Route protection**: Verify unauthorized access is blocked
5. **Error states**: Test network failures and invalid inputs

## Important Notes

- This is an **academic project** (Frontend Development Frameworks course)
- Authentication is **simulated** - uses mock data, not real API
- No backend integration - all state is client-side only
- Test credentials: `teacher@test.com` for teacher role, any other email for student role
- The project emphasizes modern React patterns and responsive design for educational purposes

## Git Workflow

Project uses feature branch workflow:
- `main` - production-ready code
- `feature/*` - new features (e.g., `feature/frontend-design`, `feature/react-functionality`)
- Commit messages follow conventional commits format: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`

## Troubleshooting

**Port already in use**: Use `npx kill-port 5173` or start on different port with `npm run dev -- --port 3000`

**Build errors**: Clear cache with `Remove-Item -Recurse -Force node_modules, package-lock.json` then `npm install`

**Vite cache issues**: Delete `.vite` directory and restart dev server

**React Hook errors**: Ensure hooks are called at component top level, not conditionally

**Context errors**: Verify components are wrapped by appropriate Provider (AuthProvider or AppProvider)
