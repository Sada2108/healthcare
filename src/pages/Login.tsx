import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase'
import PageShell from '../components/PageShell'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const provider = new GoogleAuthProvider()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const friendlyError = (code: string) => {
    switch (code) {
      case 'auth/wrong-password':
        return t('login.errorWrongPassword')
      case 'auth/email-already-in-use':
        return t('login.errorEmailInUse')
      case 'auth/user-not-found':
        return t('login.errorUserNotFound')
      case 'auth/invalid-email':
        return t('login.errorInvalidEmail')
      case 'auth/network-request-failed':
        return t('login.errorNetwork')
      default:
        return errMessage(code)
    }
  }

  const errMessage = (code: string) => code.replace(/^auth\//, '')

  const handleGoogleSignIn = async () => {
    setError('')
    try {
      await signInWithPopup(auth, provider)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      setError(friendlyError(err.code))
    }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name })
      }
    } catch (err: any) {
      setError(friendlyError(err.code))
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await sendPasswordResetEmail(auth, email)
      setError(t('login.passwordResetSent'))
    } catch (err: any) {
      setError(friendlyError(err.code))
    }
  }

  const handleSignOut = async () => {
    setError('')
    try {
      await signOut(auth)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const homePath = '/'

  const handleRedirect = (path: string) => {
    setError('')
    navigate(path)
  }

  return (
    <PageShell>
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-ink mb-6 text-center">
          {t('login.title')}
        </h1>

        {loading ? (
          <div className="glass-card p-6 text-center">
            <p className="text-sm text-ink/60">{t('login.loading')}</p>
          </div>
        ) : (
          <>
            {!user ? (
              <>
                <div className="glass-card p-6 mb-6">
                  <h2 className="text-lg font-semibold text-ink mb-4">
                    {t('login.signIn')}
                  </h2>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full min-h-11 rounded-xl border border-pink-border bg-white/60 flex items-center justify-center gap-2 text-brand-pink font-semibold transition hover:bg-pink-hover"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66v-2.77c-2.52-1.13-5.49-1.91-8.59-1.91-3.21 0-6.08 1.45-8.19 3.79v2.36c4.05-1.19 7.01-3.88 7.9-3.79v2.18zm0-14.58c2.71 0 4.97 1.2 6.6 3.13v2.34c-3.35-.52-6.2-2.49-8.19-4.31v-2.88c4.18 1.15 7.28 3.32 7.28 4.95 0 1.03-.13 2.01-.29 2.95h-1.4c-.17-.9-.6-1.7-1.3-2.24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.25-.62-.39-1.31-.39-2.05 0-.75.14-1.43.39-2.07v2.12c1.19 1.78 3.29 2.79 5.73 2.79 2.57 0 4.72-1.16 5.98-2.82h1.52c-2.03 2.23-4.98 3.57-8.19 3.57-3.67 0-6.86-2.23-8.19-5.26-.03-.31-.04-.62-.04-.93z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 22.42c-5.11 0-9.29-3.44-9.99-7.77h2.1c.38.84.98 1.56 1.74 2.06 1.12.75 2.53 1.15 4.13 1.15 2.57 0 4.72-1.16 5.98-2.82h1.52c-2.03 2.23-4.98 3.57-8.19 3.57z"
                      />
                    </svg>
                    {t('login.signInWithGoogle')}
                  </button>
                  <hr className="my-4 border-pink-border" />
                  {error && (
                    <p className="text-sm text-[#D93636] mb-4">{error}</p>
                  )}
                  <form onSubmit={handleEmailSignIn} className="space-y-3">
                    <div>
                      <label className="block text-sm text-ink/70 mb-1">
                        {t('login.email')}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full min-h-11 rounded-xl border border-pink-border bg-white/60 backdrop-blur-sm px-4 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-ink/70 mb-1">
                        {t('login.password')}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full min-h-11 rounded-xl border border-pink-border bg-white/60 backdrop-blur-sm px-4 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full min-h-11 rounded-xl bg-brand-pink text-white font-semibold transition active:scale-95"
                    >
                      {t('login.signIn')}
                    </button>
                  </form>
                  <p className="text-sm text-center text-brand-pink font-medium cursor-pointer underline mt-3" onClick={handleForgotPassword}>
                    {t('login.forgotPassword')}
                  </p>
                </div>

                <div className="glass-card p-6 mb-6">
                  <h2 className="text-lg font-semibold text-ink mb-4">
                    {t('login.createAccount')}
                  </h2>
                  <form onSubmit={handleCreateAccount} className="space-y-3">
                    <div>
                      <label className="block text-sm text-ink/70 mb-1">
                        {t('login.email')}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full min-h-11 rounded-xl border border-pink-border bg-white/60 backdrop-blur-sm px-4 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-ink/70 mb-1">
                        {t('login.password')}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full min-h-11 rounded-xl border border-pink-border bg-white/60 backdrop-blur-sm px-4 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-ink/70 mb-1">
                        {t('login.name')}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full min-h-11 rounded-xl border border-pink-border bg-white/60 backdrop-blur-sm px-4 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full min-h-11 rounded-xl bg-brand-pink text-white font-semibold transition active:scale-95"
                    >
                      {t('login.createAccount')}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="glass-card p-6 text-center">
                <h2 className="text-lg font-semibold text-ink mb-3">
                  {t('login.signedInAs', { email: user.email || '' })}
                </h2>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="min-h-11 rounded-xl bg-brand-pink text-white font-semibold transition active:scale-95"
                >
                  {t('login.signOut')}
                </button>
                <button
                  type="button"
                  onClick={() => handleRedirect(homePath)}
                  className="mt-3 min-h-11 rounded-xl border border-pink-border bg-white/60 text-brand-pink font-semibold transition hover:bg-pink-hover"
                >
                  {t('login.continue')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  )
}
