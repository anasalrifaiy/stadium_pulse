import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

function Icon({ name, className = '', style }) {
  return <span className={`material-symbols-outlined ${className}`} style={style}>{name}</span>
}

export default function Scoreboard() {
  const [searchParams] = useSearchParams()
  const [gameState, setGameState] = useState(null)
  const [inputCode, setInputCode] = useState('')
  const [ticker, setTicker] = useState(0)

  // Get gameId from ?game= param or localStorage
  const gameId = searchParams.get('game') || localStorage.getItem('sp_gameId') || ''

  useEffect(() => {
    setInputCode(gameId)
  }, [gameId])

  // Listen to game state
  useEffect(() => {
    if (!gameId) return
    const unsub = onSnapshot(doc(db, 'games', gameId), (snap) => {
      if (snap.exists()) setGameState({ id: snap.id, ...snap.data() })
      else setGameState(null)
    })
    return unsub
  }, [gameId])

  // Ticker animation
  const announcements = gameState?.announcements || []
  useEffect(() => {
    if (announcements.length === 0) return
    const iv = setInterval(() => setTicker(t => (t + 1) % announcements.length), 8000)
    return () => clearInterval(iv)
  }, [announcements.length])

  function handleConnect(e) {
    e.preventDefault()
    // Navigate to the same page with the game param in the hash
    window.location.hash = `/scoreboard?game=${inputCode.toUpperCase()}`
  }

  if (!gameId || !gameState) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-xl p-md">
        <div className="fixed inset-0 pitch-lines pointer-events-none opacity-30" />
        <div className="text-center relative z-10 space-y-xl">
          <div className="flex items-center justify-center gap-sm">
            <Icon name="sports_soccer" className="text-primary text-headline-lg" />
            <h1 className="font-headline-lg text-headline-lg font-extrabold text-primary italic uppercase tracking-tighter">Stadium Pulse</h1>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface-variant">لوحة النتائج العامة</h2>

          {!gameId ? (
            <form onSubmit={handleConnect} className="glass-card rounded-xxl p-xl w-full max-w-sm space-y-md">
              <p className="text-on-surface-variant font-body-md">أدخل رمز الغرفة لعرض النتائج</p>
              <div className="relative">
                <input
                  className="w-full bg-surface-container-highest/50 border border-outline-variant text-on-surface rounded-lg py-md px-xl focus:ring-2 focus:ring-primary outline-none placeholder:text-on-surface-variant/50 uppercase text-center font-headline-md"
                  placeholder="ABC123"
                  value={inputCode}
                  onChange={e => setInputCode(e.target.value.toUpperCase())}
                  maxLength={6}
                />
              </div>
              <button type="submit" className="w-full bg-secondary text-on-secondary font-bold py-md rounded-lg neon-glow-primary transition-all hover:brightness-110">
                عرض النتائج
              </button>
            </form>
          ) : (
            <div className="glass-card rounded-xxl p-xl space-y-md text-center">
              <Icon name="hourglass_top" className="text-display-lg text-secondary animate-spin" style={{ animationDuration: '2s' }} />
              <p className="text-on-surface-variant font-body-md">في انتظار بدء المباراة...</p>
              <p className="text-outline font-label-lg">الغرفة: {gameId}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const players = gameState.players || {}
  const p1 = players.player1 || {}
  const p2 = players.player2 || {}
  const questions = gameState.questions || []
  const currentIdx = gameState.currentQuestionIndex || 0
  const currentQ = questions[currentIdx]

  const p1Score = p1.score || 0
  const p2Score = p2.score || 0
  const maxScore = Math.max(p1Score, p2Score, 100)
  const totalAnnouncements = announcements.length
  const tickerText = totalAnnouncements > 0
    ? announcements[ticker % totalAnnouncements]?.text
    : 'مرحباً بكم في Stadium Pulse - مسابقة كرة القدم الحية!'

  const currentAnnouncement = gameState.currentAnnouncement || tickerText

  return (
    <div className="bg-background text-on-background font-body-md selection:bg-primary/30 min-h-screen overflow-hidden relative">
      {/* Pitch lines */}
      <div className="pitch-lines" />

      {/* Top Header */}
      <header className="flex justify-between items-center px-gutter py-md w-full sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-xl relative z-10">
        <div className="flex items-center gap-sm">
          <Icon name="sports_soccer" className="text-primary font-bold text-headline-lg" />
          <h1 className="font-headline-lg text-headline-lg font-extrabold text-primary italic uppercase tracking-tighter">Stadium Pulse</h1>
        </div>
        <nav className="hidden md:flex gap-xl">
          <span className="text-primary font-bold border-b-2 border-primary pb-1 font-body-md cursor-pointer">Live Match</span>
          <span className="text-on-surface-variant font-body-md hover:text-secondary-fixed transition-colors duration-200 cursor-pointer">Leaderboard</span>
        </nav>
        <div className="flex items-center gap-md">
          <div className="flex flex-col items-end">
            <span className="font-label-lg text-secondary uppercase tracking-widest">Live Broadcast</span>
            <span className="text-[10px] text-error flex items-center gap-1 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-error" />
              مباشر
            </span>
          </div>
          <Icon name="timer" className="text-on-surface-variant cursor-pointer scale-95 active:scale-90 transition-transform" />
        </div>
      </header>

      {/* Main scoreboard */}
      <main className="relative z-10 w-full max-w-container-max mx-auto px-gutter py-xl flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
        {/* Round info */}
        <div className="mb-xxl text-center">
          <div className="inline-flex items-center gap-md bg-secondary-container/20 px-xl py-sm rounded-full border border-secondary/30 backdrop-blur-md">
            <Icon name="rebase_edit" className="text-secondary animate-spin" style={{ animationDuration: '3s' }} />
            <span className="font-headline-sm text-headline-sm text-secondary uppercase tracking-tighter">
              {currentQ?.text?.substring(0, 40) || 'في انتظار السؤال...'}
              {(currentQ?.text?.length || 0) > 40 ? '...' : ''}
            </span>
          </div>
          <div className="mt-md font-body-md text-on-surface-variant/80">{gameState.roundName || 'الجولة الأولى'}</div>
        </div>

        {/* 1v1 layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-11 items-center gap-xl lg:gap-0">
          {/* Player 1 */}
          <div className="lg:col-span-4 group">
            <div className={`glass-card rounded-xxl p-xl flex flex-col items-center text-center relative overflow-hidden ${p1Score >= p2Score ? 'active-pulse' : ''}`}>
              {p1Score >= p2Score && (
                <div className="absolute top-0 right-0 p-md">
                  <span className="bg-primary/20 text-primary px-md py-1 rounded-full text-[12px] font-bold border border-primary/30">المركز الأول</span>
                </div>
              )}

              <div className={`w-40 h-40 rounded-full border-4 border-primary/50 p-2 mb-lg ${p1Score >= p2Score ? 'neon-glow-green' : ''} bg-surface-container-high flex items-center justify-center`}>
                <Icon name="person" className="text-primary" style={{ fontSize: '80px' }} />
              </div>

              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">{p1.name || 'المتسابق الأول'}</h2>
              <p className="font-body-md text-on-surface-variant mb-xl">الفريق الأخضر</p>

              <div className="flex flex-col gap-sm w-full">
                <div className="flex justify-between items-end">
                  <span className="font-label-lg text-primary">النقاط</span>
                  <span className="text-display-lg font-display-lg text-primary leading-none tracking-tighter">
                    {p1Score.toLocaleString('ar')}
                  </span>
                </div>
                <div className="w-full h-4 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary neon-glow-green rounded-full relative transition-all duration-1000"
                    style={{ width: `${(p1Score / maxScore) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Answer status badge */}
              {p1.answerStatus === 'accepted' && (
                <div className="mt-md bg-secondary/20 text-secondary px-md py-xs rounded-full font-label-lg flex items-center gap-xs">
                  <Icon name="check_circle" className="text-sm" />إجابة صحيحة!
                </div>
              )}
              {p1.answerStatus === 'rejected' && (
                <div className="mt-md bg-error/20 text-error px-md py-xs rounded-full font-label-lg flex items-center gap-xs">
                  <Icon name="cancel" className="text-sm" />إجابة خاطئة
                </div>
              )}
              {p1.answerStatus === 'pending' && (
                <div className="mt-md bg-tertiary/20 text-tertiary px-md py-xs rounded-full font-label-lg flex items-center gap-xs animate-pulse">
                  <Icon name="mic" className="text-sm" />يُجيب...
                </div>
              )}
            </div>
          </div>

          {/* VS Center */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center gap-md">
            <div className="w-24 h-24 rounded-full bg-surface-container-high border-2 border-outline/20 flex items-center justify-center relative shadow-2xl">
              <span className="font-display-lg text-on-surface/20 italic select-none">VS</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 animate-pulse" />
              </div>
            </div>

            {/* Question number + current question */}
            <div className="bg-surface-container-lowest/80 px-lg py-sm rounded-xl border border-outline-variant/20 flex flex-col items-center text-center">
              <span className="font-body-md text-on-surface-variant text-sm">السؤال</span>
              <span className="text-headline-lg font-headline-lg text-secondary">{currentIdx + 1} / {questions.length}</span>
            </div>
          </div>

          {/* Player 2 */}
          <div className="lg:col-span-4 group">
            <div className={`glass-card rounded-xxl p-xl flex flex-col items-center text-center relative overflow-hidden ${p2Score > p1Score ? 'active-pulse' : ''}`}>
              {p2Score > p1Score && (
                <div className="absolute top-0 left-0 p-md">
                  <span className="bg-tertiary/20 text-tertiary px-md py-1 rounded-full text-[12px] font-bold border border-tertiary/30">المركز الأول</span>
                </div>
              )}

              <div className={`w-40 h-40 rounded-full border-4 border-tertiary/50 p-2 mb-lg bg-surface-container-high flex items-center justify-center`}>
                <Icon name="person" className="text-tertiary" style={{ fontSize: '80px' }} />
              </div>

              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">{p2.name || 'المتسابق الثاني'}</h2>
              <p className="font-body-md text-on-surface-variant mb-xl">الفريق الأزرق</p>

              <div className="flex flex-col gap-sm w-full">
                <div className="flex justify-between items-end">
                  <span className="font-label-lg text-tertiary">النقاط</span>
                  <span className="text-display-lg font-display-lg text-tertiary leading-none tracking-tighter">
                    {p2Score.toLocaleString('ar')}
                  </span>
                </div>
                <div className="w-full h-4 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-tertiary rounded-full relative transition-all duration-1000"
                    style={{ width: `${(p2Score / maxScore) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/10" />
                  </div>
                </div>
              </div>

              {p2.answerStatus === 'accepted' && (
                <div className="mt-md bg-secondary/20 text-secondary px-md py-xs rounded-full font-label-lg flex items-center gap-xs">
                  <Icon name="check_circle" className="text-sm" />إجابة صحيحة!
                </div>
              )}
              {p2.answerStatus === 'rejected' && (
                <div className="mt-md bg-error/20 text-error px-md py-xs rounded-full font-label-lg flex items-center gap-xs">
                  <Icon name="cancel" className="text-sm" />إجابة خاطئة
                </div>
              )}
              {p2.answerStatus === 'pending' && (
                <div className="mt-md bg-tertiary/20 text-tertiary px-md py-xs rounded-full font-label-lg flex items-center gap-xs animate-pulse">
                  <Icon name="mic" className="text-sm" />يُجيب...
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* News Ticker */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-surface-container-highest/95 backdrop-blur-md border-t border-primary/20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] h-20 flex items-center overflow-hidden">
        <div className="bg-primary text-on-primary font-headline-sm h-full flex items-center px-xxl italic skew-x-[-15deg] translate-x-[20px] relative z-10 shrink-0">
          آخر الأخبار
        </div>
        <div className="flex-grow overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee px-xl">
            <span className="font-body-lg text-on-surface-variant mx-xl flex items-center gap-sm">
              <Icon name="info" className="text-secondary" />
              {currentAnnouncement}
            </span>
          </div>
          <div className="inline-block animate-marquee px-xl">
            <span className="font-body-lg text-on-surface-variant mx-xl flex items-center gap-sm">
              <Icon name="emoji_events" className="text-secondary" />
              Stadium Pulse — مسابقة كرة القدم المباشرة
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
