import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

function Icon({ name, className = '', style }) {
  return <span className={`material-symbols-outlined ${className}`} style={style}>{name}</span>
}

const ROUND_LABELS = {
  normal:  { text: 'جولة عادية',       icon: 'quiz',          color: 'text-primary',   bg: 'bg-primary/10 border-primary/30' },
  speed:   { text: 'جولة السرعة ⚡',    icon: 'bolt',          color: 'text-error',     bg: 'bg-error/10 border-error/30' },
  auction: { text: 'جولة المزاد 💰',    icon: 'gavel',         color: 'text-secondary', bg: 'bg-secondary/10 border-secondary/30' },
  whoami:  { text: 'من أنا؟ 🎭',        icon: 'psychology',    color: 'text-tertiary',  bg: 'bg-tertiary/10 border-tertiary/30' },
  golden:  { text: 'السؤال الذهبي ⭐',  icon: 'star',          color: 'text-secondary', bg: 'bg-secondary/10 border-secondary/30' },
}

function BroadcastCountdown({ endTime }) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
  )
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, Math.ceil((endTime - Date.now()) / 1000)))
    tick()
    const iv = setInterval(tick, 250)
    return () => clearInterval(iv)
  }, [endTime])

  const pct = Math.max(0, remaining / 10)
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = circ * pct
  const urgency = remaining <= 5

  return (
    <div className="relative w-10 h-10 lg:w-14 lg:h-14 shrink-0">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-container-highest opacity-40" />
        <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          className={urgency ? 'text-error' : 'text-secondary'}
          style={{ transition: 'stroke-dasharray 0.25s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-extrabold text-xs lg:text-lg ${urgency ? 'text-error' : 'text-on-surface'}`}>{remaining}</span>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  if (status === 'accepted') return (
    <div className="flex items-center gap-xs bg-secondary/20 text-secondary px-md py-xs rounded-full font-label-lg border border-secondary/40 animate-pulse text-sm">
      <Icon name="check_circle" className="text-sm" style={{ fontVariationSettings: "'FILL' 1" }} />
      إجابة صحيحة!
    </div>
  )
  if (status === 'rejected') return (
    <div className="flex items-center gap-xs bg-error/20 text-error px-md py-xs rounded-full font-label-lg border border-error/40 text-sm">
      <Icon name="cancel" className="text-sm" style={{ fontVariationSettings: "'FILL' 1" }} />
      إجابة خاطئة
    </div>
  )
  if (status === 'pending') return (
    <div className="flex items-center gap-xs bg-tertiary/20 text-tertiary px-md py-xs rounded-full font-label-lg border border-tertiary/40 animate-pulse text-sm">
      <Icon name="mic" className="text-sm" />
      يُجيب الآن...
    </div>
  )
  return null
}

function PlayerCard({ player, color, label, isLeading, bid, wager, roundType, maxScore }) {
  const score = player?.score || 0
  const name  = player?.name || label
  const colorMap = {
    green: { accent: 'text-primary', border: 'border-primary/40', bg: 'bg-primary/5', glow: 'shadow-[0_0_40px_rgba(149,213,164,0.15)]', bar: 'bg-primary', badge: 'bg-primary/20 text-primary border-primary/30' },
    blue:  { accent: 'text-tertiary', border: 'border-tertiary/40', bg: 'bg-tertiary/5', glow: 'shadow-[0_0_40px_rgba(146,204,255,0.15)]', bar: 'bg-tertiary', badge: 'bg-tertiary/20 text-tertiary border-tertiary/30' },
  }
  const c = colorMap[color] || colorMap.green
  const barPct = maxScore > 0 ? Math.min(100, (score / maxScore) * 100) : 0

  return (
    <div className={`flex-1 flex flex-col items-center rounded-2xl lg:rounded-3xl px-4 sm:px-6 lg:px-8 pt-3 pb-5 border-2 ${c.border} ${c.bg} ${isLeading ? c.glow : ''} transition-all duration-700`}>

      {/* ① Badge — fixed 32px row, same on both cards */}
      <div className="h-8 w-full flex items-center justify-center mb-3 shrink-0">
        {isLeading && (
          <div className={`px-md py-0.5 rounded-full text-xs font-extrabold border ${c.badge} uppercase tracking-widest whitespace-nowrap flex items-center gap-xs`}>
            <Icon name="emoji_events" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1" }} />
            المتصدر
          </div>
        )}
      </div>

      {/* ② Avatar — fixed size */}
      <div className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full border-4 ${c.border} flex items-center justify-center ${c.bg} shrink-0`}>
        <Icon name="person" className={c.accent} style={{ fontSize: 'clamp(32px, 4.5vw, 60px)' }} />
      </div>

      {/* ③ Name — fixed 44px row, one font size for all cards, truncate overflow */}
      <div className="h-11 w-full flex items-center justify-center mt-3 shrink-0">
        <h2 className="font-extrabold text-on-surface text-center truncate w-full px-2"
            style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.4rem)' }}>
          {name}
        </h2>
      </div>

      {/* ④ Score */}
      <div className="text-center mt-2 mb-3 shrink-0">
        <span className={`font-extrabold ${c.accent}`} style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: 1 }}>
          {score}
        </span>
        <p className="text-on-surface-variant font-label-lg mt-1 text-xs lg:text-sm">نقطة</p>
      </div>

      {/* ⑤ Score bar */}
      <div className="w-full h-2 lg:h-3 bg-surface-container-highest rounded-full overflow-hidden mb-3 shrink-0">
        <div className={`h-full ${c.bar} rounded-full transition-all duration-1000`}
             style={{ width: `${barPct}%` }} />
      </div>

      {/* ⑥ Status — fixed 32px row */}
      <div className="h-8 w-full flex items-center justify-center shrink-0">
        {roundType === 'auction' && bid != null
          ? <div className={`text-xs sm:text-sm ${c.accent} font-bold bg-surface-container-high px-md py-xs rounded-full border ${c.border}`}>عرض: {bid} نقطة</div>
          : roundType === 'golden' && wager != null
          ? <div className={`text-xs sm:text-sm ${c.accent} font-bold bg-surface-container-high px-md py-xs rounded-full border ${c.border}`}>رهان: {wager} نقطة</div>
          : <StatusBadge status={player?.answerStatus} />
        }
      </div>
    </div>
  )
}

export default function BroadcastView() {
  const [searchParams] = useSearchParams()
  const [gameState, setGameState] = useState(null)
  const [inputCode, setInputCode] = useState('')
  const [ticker, setTicker] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)

  const gameId = searchParams.get('game') || localStorage.getItem('sp_gameId') || ''

  useEffect(() => {
    if (!gameId) return
    const unsub = onSnapshot(doc(db, 'games', gameId), snap => {
      if (snap.exists()) setGameState({ id: snap.id, ...snap.data() })
      else setGameState(null)
    })
    return unsub
  }, [gameId])

  const announcements = gameState?.announcements || []
  useEffect(() => {
    if (announcements.length === 0) return
    const iv = setInterval(() => setTicker(t => (t + 1) % announcements.length), 8000)
    return () => clearInterval(iv)
  }, [announcements.length])

  function toggleFullscreen() {
    const el = containerRef.current || document.documentElement
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  function handleConnect(e) {
    e.preventDefault()
    window.location.hash = `/broadcast?game=${inputCode.toUpperCase()}`
  }

  // ── No game yet ──
  if (!gameId || !gameState) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-xl p-md">
        <div className="fixed inset-0 pitch-lines pointer-events-none opacity-20" />
        <div className="relative z-10 text-center space-y-xl">
          <div className="flex items-center justify-center gap-sm">
            <Icon name="sports_soccer" className="text-primary text-headline-lg" />
            <h1 className="font-headline-lg text-headline-lg font-extrabold text-primary italic uppercase tracking-tighter">Stadium Pulse</h1>
          </div>
          <h2 className="font-headline-md text-headline-md text-secondary">شاشة البث المباشر</h2>
          <p className="text-on-surface-variant font-body-md">مصممة للعرض أمام الجمهور أثناء البث</p>

          {!gameId ? (
            <form onSubmit={handleConnect} className="glass-card rounded-xxl p-xl w-full max-w-sm space-y-md">
              <p className="text-on-surface-variant font-body-md">أدخل رمز الغرفة</p>
              <input
                className="w-full bg-surface-container-highest/50 border border-outline-variant text-on-surface rounded-lg py-md px-xl focus:ring-2 focus:ring-primary outline-none placeholder:text-on-surface-variant/50 uppercase text-center font-headline-md"
                placeholder="ABC123"
                value={inputCode}
                onChange={e => setInputCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
              <button type="submit" className="w-full bg-secondary text-on-secondary font-bold py-md rounded-lg hover:brightness-110 transition-all">
                فتح شاشة البث
              </button>
            </form>
          ) : (
            <div className="glass-card rounded-xxl p-xl space-y-md text-center">
              <Icon name="hourglass_top" className="text-display-lg text-secondary animate-spin" style={{ animationDuration: '2s' }} />
              <p className="text-on-surface-variant">في انتظار بدء المباراة...</p>
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
  const roundType = gameState.roundType || 'normal'
  const roundMeta = ROUND_LABELS[roundType] || ROUND_LABELS.normal
  const p1Score = p1.score || 0
  const p2Score = p2.score || 0
  const p1Leading = p1Score >= p2Score
  const maxScore  = Math.max(p1Score, p2Score, 100)
  const latestAnnouncement = announcements.length > 0 ? announcements[ticker % announcements.length]?.text : null

  const whoamiClueIndex = gameState.whoamiClueIndex || 0
  const revealedClues = roundType === 'whoami' ? (currentQ?.clues || []).slice(0, whoamiClueIndex + 1) : []

  // Seamless loop: content doubled, translateX(-50%) creates the loop
  const tickerContent = (
    <span className="inline-flex items-center gap-md whitespace-nowrap" style={{ paddingLeft: '2rem', paddingRight: '100vw' }}>
      {latestAnnouncement ? (
        <>
          <Icon name="campaign" className="text-secondary shrink-0" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }} />
          <span className="font-body-lg text-secondary">{latestAnnouncement}</span>
        </>
      ) : (
        <>
          <Icon name="sports_soccer" className="text-primary/40 shrink-0" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }} />
          <span className="font-body-lg text-on-surface-variant/40">Stadium Pulse</span>
        </>
      )}
    </span>
  )

  return (
    <div ref={containerRef} className="bg-background text-on-background font-body-md min-h-screen flex flex-col overflow-hidden relative select-none">
      {/* Background */}
      <div className="pitch-lines" />
      <div className="fixed top-0 left-0 w-1/3 h-1/3 bg-primary/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-1/3 h-1/3 bg-secondary/5 blur-[200px] rounded-full pointer-events-none" />

      {/* ── TOP BAR ── */}
      <header className="relative z-20 flex items-center justify-between px-4 lg:px-10 py-3 lg:py-4 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/20 gap-2">
        {/* Logo */}
        <div className="flex items-center gap-sm shrink-0">
          <Icon name="sports_soccer" className="text-primary font-bold" style={{ fontSize: '24px' }} />
          <span className="font-extrabold text-lg lg:text-2xl text-primary italic uppercase tracking-tighter hidden sm:block">Stadium Pulse</span>
        </div>

        {/* Round type badge — hidden when finished */}
        {gameState.status === 'finished' ? (
          <div className="flex items-center gap-xs sm:gap-sm px-sm sm:px-xl py-xs sm:py-sm rounded-full border font-bold text-xs sm:text-base lg:text-lg bg-secondary/10 border-secondary/30 text-secondary">
            <Icon name="emoji_events" style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }} />
            <span className="hidden xs:block">انتهت المسابقة</span>
          </div>
        ) : (
          <div className={`flex items-center gap-xs sm:gap-sm px-sm sm:px-xl py-xs sm:py-sm rounded-full border font-bold text-xs sm:text-base lg:text-lg ${roundMeta.bg} ${roundMeta.color}`}>
            <Icon name={roundMeta.icon} style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }} />
            <span className="hidden xs:block">{roundMeta.text}</span>
          </div>
        )}

        <div className="flex items-center gap-2 lg:gap-lg shrink-0">
          {/* Question counter — hidden when finished */}
          {gameState.status !== 'finished' && (
          <div className="text-center">
            <p className="text-on-surface-variant font-label-lg text-xs uppercase tracking-widest hidden sm:block">السؤال</p>
            <p className="font-extrabold text-sm lg:text-xl text-secondary">{currentIdx + 1} / {questions.length}</p>
          </div>
          )}

          {/* Live / Paused / Finished badge */}
          <div className={`flex items-center gap-xs border px-sm lg:px-md py-xs rounded-full ${
            gameState.status === 'finished' ? 'bg-secondary/10 border-secondary/30'
            : gameState.paused ? 'bg-tertiary/10 border-tertiary/30'
            : 'bg-error/10 border-error/30'
          }`}>
            {gameState.status === 'finished' ? (
              <span className="text-secondary font-bold text-xs uppercase tracking-widest">انتهى</span>
            ) : gameState.paused ? (
              <>
                <Icon name="pause" className="text-tertiary shrink-0" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }} />
                <span className="text-tertiary font-bold text-xs uppercase tracking-widest hidden sm:block">متوقف</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-error animate-pulse shrink-0" />
                <span className="text-error font-bold text-xs uppercase tracking-widest hidden sm:block">مباشر</span>
              </>
            )}
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-xs lg:p-sm rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-colors text-on-surface-variant hover:text-primary"
            title="ملء الشاشة"
          >
            <Icon name={isFullscreen ? 'fullscreen_exit' : 'fullscreen'} style={{ fontSize: '24px' }} />
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 py-4 sm:py-6 gap-4 sm:gap-6 lg:gap-8">

        {/* Question box */}
        <div className="w-full max-w-4xl glass-card rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 text-center border-2 border-primary/20 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 opacity-[0.06]">
            <Icon name="sports_soccer" style={{ fontSize: '140px' }} />
          </div>
          <div className="relative z-10">
            <span className="inline-block bg-secondary/10 text-secondary border border-secondary/20 px-md py-xs rounded-full font-label-lg text-xs sm:text-sm mb-3">
              السؤال {currentIdx + 1}
            </span>

            {roundType === 'whoami' && revealedClues.length > 0 ? (
              <div className="space-y-2 text-right">
                {revealedClues.map((clue, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${i === revealedClues.length - 1 ? 'bg-secondary/10 border border-secondary/30' : 'bg-surface-container-high'}`}>
                    <span className="bg-secondary/20 text-secondary w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <p className="text-on-surface font-semibold" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>{clue}</p>
                  </div>
                ))}
              </div>
            ) : (
              <h2 className="font-extrabold text-on-surface leading-tight" style={{ fontSize: 'clamp(1.25rem, 3vw, 2.5rem)' }}>
                {currentQ?.text || 'في انتظار السؤال...'}
              </h2>
            )}

            {currentQ?.points && roundType === 'normal' && (
              <div className="mt-3">
                <span className="bg-primary/10 text-primary border border-primary/20 px-md py-xs rounded-full font-label-lg text-xs sm:text-sm">
                  {currentQ.points} نقطة
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Player cards */}
        <div className="w-full max-w-5xl flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-8 items-stretch">
          <PlayerCard player={p1} color="blue" label="المتسابق الأول" isLeading={p1Leading} bid={p1.bid} wager={p1.wager} roundType={roundType} maxScore={maxScore} />

          {/* VS divider */}
          <div className="flex sm:flex-col items-center justify-center gap-2 sm:gap-4 shrink-0 sm:w-16 lg:w-20 py-2 sm:py-0">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-surface-container-high border-2 border-outline/20 flex items-center justify-center shrink-0">
              <span className="font-extrabold text-on-surface/20 italic text-base lg:text-xl">VS</span>
            </div>
            {roundType === 'speed' && gameState.speedBuzzer && (
              <div className="flex flex-col items-center gap-1 text-center">
                <Icon name="bolt" className="text-error" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }} />
                <p className="text-error text-xs font-bold whitespace-nowrap">
                  {gameState.speedBuzzer === 'player1' ? (p1.name || 'ل١') : (p2.name || 'ل٢')}
                </p>
                {gameState.speedBuzzerTimestamp && !players[gameState.speedBuzzer]?.answerStatus && (
                  <BroadcastCountdown endTime={gameState.speedBuzzerTimestamp + 10000} />
                )}
              </div>
            )}
          </div>

          <PlayerCard player={p2} color="green" label="المتسابق الثاني" isLeading={!p1Leading && p2Score > 0} bid={p2.bid} wager={p2.wager} roundType={roundType} maxScore={maxScore} />
        </div>

        {/* Paused overlay */}
        {gameState.paused && gameState.status === 'active' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-30">
            <div className="glass-card rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-tertiary/30 mx-4">
              <Icon name="pause_circle" className="text-tertiary block mx-auto" style={{ fontSize: '80px', fontVariationSettings: "'FILL' 1" }} />
              <h2 className="font-extrabold text-on-surface" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>استراحة</h2>
              <p className="text-on-surface-variant font-body-md">ستستأنف المسابقة قريباً...</p>
            </div>
          </div>
        )}

        {/* Lobby overlay */}
        {gameState.status === 'lobby' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-30">
            <div className="glass-card rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-primary/20 mx-4">
              <Icon name="sports_soccer" className="text-primary block mx-auto animate-spin" style={{ fontSize: '64px', animationDuration: '3s' }} />
              <h2 className="font-extrabold text-on-surface" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>في انتظار بدء المسابقة</h2>
              <p className="text-on-surface-variant font-body-md">الغرفة: <span className="text-primary font-bold">{gameId}</span></p>
            </div>
          </div>
        )}

        {/* Finished overlay */}
        {gameState.status === 'finished' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-30">
            <div className="glass-card rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-secondary/30 mx-4">
              <Icon name="emoji_events" className="text-secondary block mx-auto" style={{ fontSize: '80px', fontVariationSettings: "'FILL' 1" }} />
              <h2 className="font-extrabold text-on-surface" style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}>انتهت المسابقة!</h2>
              <p className="text-secondary font-bold" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.875rem)' }}>
                {p1Score > p2Score ? p1.name : p2Score > p1Score ? p2.name : 'تعادل!'} {p1Score !== p2Score ? '🏆' : '🤝'}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ── NEWS TICKER ── */}
      <div className="relative z-20 w-full bg-surface-container-highest/95 backdrop-blur-md border-t border-primary/20 h-12 sm:h-14 flex items-center overflow-hidden shrink-0">
        {/* Label tab */}
        <div
          className="bg-primary text-on-primary font-bold h-full flex items-center px-4 sm:px-6 italic shrink-0 z-10 gap-1"
          style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)' }}
        >
          <Icon name="rss_feed" style={{ fontSize: '16px' }} />
        </div>

        {/* Seamless ticker: dir=ltr forces left-origin so paddingRight gap works in RTL pages */}
        <div className="flex-grow overflow-hidden" dir="ltr">
          <div className="inline-flex animate-ticker">
            {tickerContent}
            {tickerContent}
          </div>
        </div>
      </div>
    </div>
  )
}
