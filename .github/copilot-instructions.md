# FaithStream Copilot Instructions

## Project Overview
**FaithStream** is a client-side React sermon management platform for Living Faith Church (Winner's Chapel) Agric branch. It allows congregants to browse and stream sermons/worship content, with admin capabilities for media management.

## Architecture & Data Flow

### Core Technology Stack
- **Frontend**: React 19 + TypeScript + React Router (HashRouter for client-side routing)
- **Build Tool**: Vite (dev: `npm run dev`, build: `npm run build`, preview: `npm run preview`)
- **Styling**: Tailwind CSS
- **Data Persistence**: localStorage only (no backend API)
- **AI Integration**: Google Gemini API for auto-generating media metadata

### Data Storage Pattern
All data persists in localStorage via [services/db.ts](services/db.ts):
- `faithstream_media` - Media library array
- `faithstream_admins` - Admin user accounts  
- `faithstream_auth` - Simple boolean auth flag

**Key constraint**: Data is client-only. No server synchronization. Default data initializes on first load if localStorage is empty.

### Authentication Model
Authentication is minimal:
- **Admin Login**: Email-based, stores `localStorage.setItem('faithstream_auth', 'true')`
- **Session**: Persists across page refreshes; clears on logout
- **Auth State**: Stored in `AuthState` interface (isAdmin + user object)
- **Default Admin**: Email `admin@church.com` with `FULL_ACCESS` role

## Component Architecture

### Central State Management
App.tsx manages two key pieces of shared state:
1. `auth` - User authentication (isAdmin flag + user object)
2. `currentMedia` - Currently playing media (passed to AudioPlayer)

**Pattern**: State flows DOWN via props, callbacks flow UP (`onPlay`, `onLogin`, `onLogout`)

### Core Data Types
See [types.ts](types.ts):
- `Media` - Sermon/worship content (id, title, preacher, category, fileUrl, thumbnailUrl, playCount, downloadCount)
- `Category` enum - SERMON, WORSHIP, BIBLE_STUDY, CONFERENCE, YOUTH
- `Admin` - User with role (FULL_ACCESS, EDITOR, VIEWER)
- `AuthState` - Auth context type

### Key Routes
- `/` - Home page (hero + recent media)
- `/library` - Browse all media by category
- `/admin/login` - Admin authentication (redirects to `/admin` if already logged in)
- `/admin` - Admin dashboard for media CRUD (requires login)

## File Organization

```
components/          # Shared UI components (AudioPlayer, Navbar)
pages/              # Route-specific components (Home, Library, AdminDashboard, AdminLogin)
services/           # Business logic
  ├── db.ts         # localStorage CRUD wrapper
  └── gemini.ts     # Metadata generation via Gemini API
types.ts            # Centralized type definitions
App.tsx             # Router and auth state
```

## Critical Developer Workflows

### Local Development
```bash
# Start dev server (port 3000, accessible at http://localhost:3000)
npm run dev

# Requires .env with GEMINI_API_KEY for metadata generation
```

### Environment Variables
- `GEMINI_API_KEY` - Required for automatic media metadata suggestions in admin dashboard
- Vite loads from root `.env` and injects into `process.env`

### Admin Dashboard Patterns
[pages/AdminDashboard.tsx](pages/AdminDashboard.tsx) (786 lines) contains:
- **Two-tab interface**: "Library" (media CRUD) + "Users" (admin management)
- **Media Form**: Requires title, preacher, category, date, description, audio file URL, thumbnail URL
- **Validation**: Custom form validation with error state object; specific error messages guide admins
- **Gemini Integration**: "Generate with AI" button suggests titles and tags from descriptions
- **File Upload Simulation**: Accepts URLs for both audio (100MB max) and thumbnails (5MB max)
- **Modal State Management**: Separate modal open/close logic for media and admin forms

**Form Pattern**:
```typescript
const [errors, setErrors] = React.useState<FormErrors>({});
const validate = (): boolean => {
  const newErrors: FormErrors = {};
  if (!formData.title.trim()) newErrors.title = "A message title is required";
  // ... more field validations
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## Audio Player Features
[components/AudioPlayer.tsx](components/AudioPlayer.tsx) provides:
- Play/pause toggle with progress bar
- Volume control
- Download button (increments downloadCount via db.incrementDownload)
- Auto-tracking play count (db.incrementPlay on media load)
- Fixed bottom player (z-index 100) with responsive layout

## Adding Features

### Adding a New Category
1. Add to `Category` enum in [types.ts](types.ts)
2. Use in Media objects and form dropdowns
3. Filter displays in [pages/Library.tsx](pages/Library.tsx) use category matching

### Adding Admin Functionality
1. Add to `AdminRole` enum in [types.ts](types.ts)
2. Add validation/logic in [pages/AdminDashboard.tsx](pages/AdminDashboard.tsx)
3. Update db methods in [services/db.ts](services/db.ts) if needed

### Media Metadata Generation with Gemini
Call `geminiService.generateMediaMetadata(description)` with a description string. Returns:
```json
{ "suggestedTitle": "...", "tags": ["...", "...", "..."] }
```
Used to auto-suggest titles from sermon descriptions in admin dashboard.

## Testing & Validation Notes
- No automated test suite currently. Manual testing required.
- localStorage clears in incognito/private mode; test with persistent storage.
- Default admin credentials (`admin@church.com`) initialize on first load if no admins exist.
- Gemini API errors return null; fallback gracefully without blocking the form.

## Styling Conventions
- Tailwind CSS utility classes (no separate CSS files or CSS-in-JS)
- **Brand colors**: Red theme (`bg-red-700`, `text-red-900`) reflecting Winners Chapel branding
- Church name "LFC AGRIC, GREATER GLORY" appears in footer and marketing copy
- Responsive design: sm, md breakpoints for mobile/tablet/desktop
- Icons from lucide-react library

## Deployment Notes
- Pure client-side app—deploy built output to any static host
- `npm run build` outputs to `dist/` directory
- HashRouter ensures no 404s on refresh (no server routing needed)
- Vite serves on `0.0.0.0:3000` during development (accessible on network)
