// Initialize demo user if first time visiting
export function initializeDemoUser() {
  if (typeof window === 'undefined') return

  const USERS_KEY = 'j_supreme_users'
  const existing = localStorage.getItem(USERS_KEY)

  if (!existing) {
    // Create demo user
    const demoUser = {
      id: 'demo-user-001',
      email: 'demo@jsupreme.com',
      name: 'Demo Trader',
      passwordHash: hashPassword('Demo123'),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    }

    localStorage.setItem(USERS_KEY, JSON.stringify([demoUser]))
  }
}

function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}
