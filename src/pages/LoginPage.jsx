import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../contexts/GameContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { createGame, joinGame, hostLogin, loading, error } = useGame()

  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [hostCode, setHostCode] = useState('')
  const [hostPassword, setHostPassword] = useState('')
  const [newHostPassword, setNewHostPassword] = useState('')
  const [hostOpen, setHostOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  async function handleJoin(e) {
    e.preventDefault()
    const ok = await joinGame(roomCode, playerName)
    if (ok) navigate('/play')
  }

  async function handleHostLogin(e) {
    e.preventDefault()
    const ok = await hostLogin(hostCode, hostPassword)
    if (ok) navigate('/host')
  }

  async function handleCreateGame(e) {
    e.preventDefault()
    const id = await createGame(newHostPassword)
    if (id) navigate('/host')
  }

  return (
    <div className="font-body-md text-on-surface stadium-bg min-h-screen flex flex-col items-center justify-center p-md">
      <div className="fixed inset-0 pitch-lines pointer-events-none opacity-40" />

      {/* Decorative glows */}
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="fixed top-0 right-0 w-1/4 h-1/4 bg-secondary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <main className="relative z-10 w-full max-w-md flex flex-col items-center gap-xxl">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-sm mb-sm">
            <span className="material-symbols-outlined text-primary text-headline-lg">sports_soccer</span>
            <h1 className="font-headline-lg text-headline-lg font-extrabold text-primary italic uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(149,213,164,0.5)]">
              Stadium Pulse
            </h1>
          </div>
          <p className="text-secondary font-label-lg tracking-[0.2em] opacity-80">LIVE MATCH QUIZ</p>
        </div>

        {error && (
          <div className="w-full bg-error-container/80 text-on-error-container rounded-xl px-md py-sm font-label-lg text-center">
            {error}
          </div>
        )}

        <div className="w-full space-y-lg">
          {/* Contestant Login */}
          <section className="glass-card rounded-xl p-xl w-full shadow-2xl space-y-lg">
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">دخول المتسابقين</h2>
            </div>
            <form onSubmit={handleJoin} className="space-y-md">
              <div className="relative">
                <input
                  className="w-full bg-surface-container-highest/50 border border-outline-variant text-on-surface rounded-lg py-md px-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-on-surface-variant/50 outline-none"
                  placeholder="اسمك"
                  type="text"
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant">person</span>
              </div>
              <div className="relative">
                <input
                  className="w-full bg-surface-container-highest/50 border border-outline-variant text-on-surface rounded-lg py-md px-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-on-surface-variant/50 outline-none uppercase"
                  placeholder="رمز الغرفة (مثال: ABC123)"
                  type="text"
                  value={roomCode}
                  onChange={e => setRoomCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  required
                />
                <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant">pin</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-on-secondary font-bold py-md rounded-lg neon-glow-primary hover:brightness-110 active:scale-95 transition-all flex justify-center items-center gap-sm disabled:opacity-50"
              >
                <span>انضم للغرفة</span>
                <span className="material-symbols-outlined">stadium</span>
              </button>
            </form>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-md py-sm">
            <div className="h-px flex-grow bg-outline-variant/30" />
            <span className="text-on-surface-variant font-label-lg">أو</span>
            <div className="h-px flex-grow bg-outline-variant/30" />
          </div>

          {/* Host Login */}
          <section className="w-full space-y-md">
            <button
              onClick={() => { setHostOpen(!hostOpen); setCreateOpen(false) }}
              className="w-full flex items-center justify-center gap-sm text-on-surface-variant hover:text-primary transition-colors py-sm"
            >
              <span className="material-symbols-outlined">settings_suggest</span>
              <span className="font-label-lg">دخول مقدم المباراة (لوحة التحكم)</span>
              <span className={`material-symbols-outlined transition-transform duration-300 ${hostOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>

            {hostOpen && (
              <div className="glass-card rounded-xl p-xl space-y-lg border border-primary/20 bg-primary-container/5">
                <form onSubmit={handleHostLogin} className="space-y-md">
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-highest/50 border border-outline-variant text-on-surface rounded-lg py-md px-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all placeholder:text-on-surface-variant/50 outline-none uppercase"
                      placeholder="رمز الغرفة"
                      type="text"
                      value={hostCode}
                      onChange={e => setHostCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      required
                    />
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant">pin</span>
                  </div>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-highest/50 border border-outline-variant text-on-surface rounded-lg py-md px-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all placeholder:text-on-surface-variant/50 outline-none"
                      placeholder="كلمة السر الخاصة بالمضيف"
                      type="password"
                      value={hostPassword}
                      onChange={e => setHostPassword(e.target.value)}
                      required
                    />
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full border-2 border-secondary text-secondary hover:bg-secondary hover:text-on-secondary font-bold py-md rounded-lg transition-all flex justify-center items-center gap-sm disabled:opacity-50"
                  >
                    <span>دخول لوحة التحكم</span>
                    <span className="material-symbols-outlined">sensors</span>
                  </button>
                </form>

                <div className="h-px bg-outline-variant/30" />

                {/* Create new game */}
                <button
                  onClick={() => setCreateOpen(!createOpen)}
                  className="w-full flex items-center justify-center gap-sm text-on-surface-variant hover:text-secondary transition-colors py-xs font-label-lg"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  <span>إنشاء غرفة جديدة</span>
                  <span className={`material-symbols-outlined text-sm transition-transform ${createOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </button>

                {createOpen && (
                  <form onSubmit={handleCreateGame} className="space-y-md">
                    <div className="relative">
                      <input
                        className="w-full bg-surface-container-highest/50 border border-outline-variant text-on-surface rounded-lg py-md px-xl focus:ring-2 focus:ring-primary outline-none placeholder:text-on-surface-variant/50 transition-all"
                        placeholder="كلمة سر جديدة للمضيف"
                        type="password"
                        value={newHostPassword}
                        onChange={e => setNewHostPassword(e.target.value)}
                        required
                        minLength={4}
                      />
                      <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant">key</span>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary-container text-on-primary-container font-bold py-md rounded-lg transition-all flex justify-center items-center gap-sm disabled:opacity-50 hover:bg-primary hover:text-on-primary"
                    >
                      <span>إنشاء غرفة جديدة</span>
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </section>

          {/* Scoreboard link */}
          <div className="text-center">
            <a
              href="/scoreboard"
              className="inline-flex items-center gap-sm text-on-surface-variant hover:text-tertiary transition-colors font-label-lg"
            >
              <span className="material-symbols-outlined text-sm">tv</span>
              <span>عرض لوحة النتائج العامة</span>
            </a>
          </div>
        </div>

        <footer className="mt-xxl text-center space-y-sm">
          <p className="text-on-surface-variant font-body-md opacity-60">© 2024 Stadium Pulse. All Rights Reserved.</p>
          <div className="flex justify-center gap-lg">
            <span className="text-on-surface-variant hover:text-secondary text-xs transition-colors cursor-pointer">قواعد اللعب</span>
            <span className="text-on-surface-variant hover:text-secondary text-xs transition-colors cursor-pointer">الدعم الفني</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
