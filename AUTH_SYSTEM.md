# User Authentication & Progress Tracking

This trading education platform now includes a complete user authentication system with local data persistence. Both logged-in users and guest users can use the platform and track their progress.

## Features

### 1. User Registration & Login

- **Register**: Create new account with email, password, and name
- **Login**: Sign in with email and password
- **Demo Account**: Try with `demo@jsupreme.com` / `Demo123`
- **Guest Access**: Use platform without account (progress saved locally)

### 2. Progress Tracking

- **Automatic Tracking**: Levels completed, courses finished, assessment scores
- **Local Storage**: Progress saved in browser localStorage
- **Account Sync**: When users login, their local progress persists
- **Data Migration**: Guest progress can be associated with account upon login

### 3. User Account Page

- View profile information
- See completion statistics (levels, courses, assessments)
- View assessment score history
- Download progress report as JSON
- Sign out

### 4. Navigation Integration

- Login/Register links in header (when logged out)
- User profile link with username (when logged in)
- Sign out button
- All pages responsive for mobile

## File Structure

```
lib/auth/
├── auth.ts                 # Core authentication functions
├── useUserProgress.ts      # React hook for progress tracking
└── initDemo.ts            # Demo user initialization

app/
├── login/page.tsx         # Login page
├── register/page.tsx      # Registration page
├── account/page.tsx       # User profile/account page
├── courses/               # Updated to track progress
└── levels/                # Updated to track progress

components/
└── Navigation.tsx         # Updated with auth-aware links
```

## API Reference

### Authentication Functions

#### `registerUser(email, password, name)`

Register a new user account.

```typescript
const result = registerUser('user@example.com', 'Password123', 'John Trader')
// Returns: { success: boolean, error?: string, user?: User }
```

#### `loginUser(email, password)`

Log in an existing user.

```typescript
const result = loginUser('user@example.com', 'Password123')
// Returns: { success: boolean, error?: string, user?: User }
```

#### `getCurrentSession()`

Get current logged-in user session.

```typescript
const session = getCurrentSession()
// Returns: { userId, email, name, loginTime } or null
```

#### `logoutUser()`

Log out current user.

```typescript
logoutUser()
// Clears session from localStorage
```

### Progress Tracking Functions

#### `getCurrentUserProgress()`

Get current user's progress (logged in or guest).

```typescript
const progress = getCurrentUserProgress()
// Returns: { userId, completedLevels, completedCourses, assessmentScores, lastAccessed }
```

#### `saveUserProgress(userId, progress)`

Save progress for specific user.

```typescript
saveUserProgress('user-id', { completedLevels: [1, 2], assessmentScores: {...} })
```

#### `markLevelCompleted(levelId)`

Mark a level as completed and save to user's progress.

```typescript
markLevelCompleted(1)
```

#### `markCourseCompleted(courseId)`

Mark a course as completed and save to user's progress.

```typescript
markCourseCompleted('trading-psychology')
```

#### `saveAssessmentScore(assessmentId, score, maxScore)`

Save assessment score.

```typescript
saveAssessmentScore('level-1-assessment', 4, 5) // 80%
```

### React Hook

#### `useUserProgress()`

Hook for tracking progress in components.

```typescript
const { session, progress, isLoading, trackAssessment, completedLevel, completedCourse } =
  useUserProgress()
```

## User Data Structure

### User

```typescript
interface User {
  id: string // Unique identifier
  email: string // Email address
  name: string // Full name
  createdAt: string // ISO timestamp
  lastLogin: string // ISO timestamp
}
```

### UserProgress

```typescript
interface UserProgress {
  userId: string // User ID or 'guest'
  completedLevels: number[] // Array of completed level numbers
  completedCourses: string[] // Array of completed course IDs
  assessmentScores: Record<string, number> // Assessment ID to percentage
  lastAccessed: string // ISO timestamp
}
```

## How It Works

### Guest Users

1. Users can access all course and level pages without logging in
2. Progress is stored in browser localStorage under key `j_supreme_guest_progress`
3. When they complete a lesson or assessment, it's automatically saved
4. If they navigate away and return, their progress is restored

### Logged-In Users

1. Users register or login with email/password
2. Session is stored in localStorage (remember: this is client-side auth for demo)
3. Progress is saved to user-specific localStorage key: `j_supreme_progress_{userId}`
4. User can view their account page, see all progress, and download reports

### Progress Synchronization

- When user completes a level/course/assessment, function is called
- If logged in: saves to user-specific progress storage
- If guest: saves to guest progress storage
- On page load, current user's progress is loaded and displayed
- Navigation component checks session and displays appropriate links

## Storage Keys

```
localStorage:
├── j_supreme_users                              // All registered users
├── j_supreme_session                            // Current user session
├── j_supreme_guest_progress                     // Guest user progress
└── j_supreme_progress_{userId}                  // Logged-in user progress
```

## Demo Credentials

The platform includes a demo account for testing:

- **Email**: demo@jsupreme.com
- **Password**: Demo123

This account is automatically created on first visit.

## Pages

### /login

Sign in with existing account or continue as guest.

### /register

Create a new account with email, password, and name.

### /account

View profile, progress statistics, assessment history, and download progress report.
**Note**: This page requires login. Guests are redirected to login page.

## Integration with Course Pages

Course pages should call progress tracking functions when:

- User completes a lesson (call `markLevelCompleted()`)
- User finishes a course (call `markCourseCompleted()`)
- User submits an assessment (call `saveAssessmentScore()`)

Example in course page:

```typescript
'use client'

import { useUserProgress } from '@/lib/auth/useUserProgress'

export default function CoursePagePage() {
  const { trackAssessment, completedCourse } = useUserProgress()

  const handleAssessmentSubmit = (score, maxScore) => {
    trackAssessment('course-1-assessment', score, maxScore)
  }

  return (
    // ... course content
  )
}
```

## Security Notes

**⚠️ Important**: This implementation uses client-side authentication with localStorage. This is suitable for:

- Educational/demo platforms
- Internal tools with non-sensitive data
- Development and testing

**For production with sensitive data**, implement:

- Server-side authentication (JWT, sessions, cookies)
- Password hashing with bcrypt
- Secure HTTPS-only cookies
- CSRF protection
- Database storage instead of localStorage
- Rate limiting on login attempts

## Future Enhancements

- [ ] Backend API for authentication
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social login (Google, GitHub)
- [ ] Progress export to PDF
- [ ] Progress import from JSON
- [ ] User achievements/badges
- [ ] Leaderboard
- [ ] Study groups/community
- [ ] Two-factor authentication
