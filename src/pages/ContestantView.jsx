import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../contexts/GameContext'

function Icon({ name, className = '', style }) {
  return <span className={`material-symbols-outlined ${className}`} style={style}>{name}</span>
}

// ─── NormalAnswerForm ────────────────────────────────────────────────────────
// Fully self-contained: owns its text state and voice recording.
// Firestore re-renders of ContestantView won't touch localAnswer → no focus loss.
function NormalAnswerForm({ onSubmit, label }) {
  const { setAnswering } = useGame()
  const [localAnswer, setLocalAnswer] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recRef = useRef(null)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.lang = 'ar-SA'
    rec.continuous = false
    rec.interimResults = true
    rec.onresult = e => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('')
      setTranscript(t)
      if (e.results[e.results.length - 1].isFinal) { setLocalAnswer(t); setTranscript('') }
    }
    rec.onend  = () => { setIsRecording(false); setAnswering(false) }
    rec.onerror = () => { setIsRecording(false); setAnswering(false) }
    recRef.current = rec
  }, [setAnswering])

  function handleSubmit(e) {
    e?.preventDefault()
    const ans = localAnswer.trim() || transcript.trim()
    if (!ans) return
    onSubmit(ans)
    setLocalAnswer('')
    setTranscript('')
  }

  function toggleRecording() {
    const rec = recRef.current
    if (!rec) { alert('المتصفح لا يدعم التعرف الصوتي العربي'); return }
    if (isRecording) { rec.stop() }
    else {
      setTranscript('')
      setIsRecording(true)
      setAnswering(true)
      try { rec.start() } catch { setIsRecording(false); setAnswering(false) }
    }
  }

  return (
    <div className="space-y-lg">
      {label && (
        <div className="glass-card rounded-xl p-md flex items-center gap-md bg-secondary/10 border border-secondary/30">
          <Icon name="check_circle" className="text-secondary text-display-lg" />
          <p className="font-headline-sm text-secondary">{label}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card rounded-xl p-lg space-y-md">
        <label className="font-label-lg text-on-surface-variant block">اكتب إجابتك هنا</label>
        <input
          className="w-full bg-surface-container-highest/50 border-2 border-outline-variant/30 rounded-lg py-xl px-lg font-headline-md text-headline-md text-on-surface focus:border-secondary transition-colors placeholder:text-on-surface-variant/30 outline-none"
          placeholder={transcript || 'اكتب إجابتك...'}
          type="text"
          value={localAnswer}
          onChange={e => setLocalAnswer(e.target.value)}
          autoComplete="off"
        />
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-stretch">
        {/* Mic */}
        <div className="flex flex-col items-center justify-center space-y-md py-lg glass-card rounded-xl">
          <p className="font-label-lg text-on-surface-variant text-sm">
            {isRecording ? 'جاري التسجيل... اضغط للإيقاف' : 'اضغط للإجابة صوتياً'}
          </p>
          <button onClick={toggleRecording} type="button" className="relative group">
            {isRecording && (
              <>
                <div className="absolute inset-0 bg-secondary/20 rounded-full animate-pulse scale-150 blur-xl" />
                <div className="absolute inset-0 bg-secondary/10 rounded-full animate-ping scale-125" />
              </>
            )}
            <div className={`relative w-24 h-24 ${isRecording ? 'bg-secondary' : 'bg-secondary-container'} rounded-full flex items-center justify-center mic-glow group-active:scale-95 transition-transform`}>
              <Icon
                name={isRecording ? 'mic' : 'mic_off'}
                className={`${isRecording ? 'text-on-secondary' : 'text-on-secondary-container'} text-display-lg`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              />
            </div>
          </button>
          {transcript && <p className="text-secondary font-body-md text-sm text-center px-md animate-pulse">{transcript}</p>}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!localAnswer.trim() && !transcript.trim()}
          className="min-h-[140px] bg-secondary text-on-secondary-container font-headline-md text-headline-md rounded-xl py-xl px-lg hover:bg-secondary-fixed transition-all flex items-center justify-center gap-md shadow-2xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          إرسال الإجابة
          <Icon name="send" />
        </button>
      </div>
    </div>
  )
}

// ─── SliderInput ─────────────────────────────────────────────────────────────
function SliderInput({ value, setValue, max, label }) {
  return (
    <div className="space-y-md">
      <div className="flex justify-between items-center">
        <span className="font-label-lg text-on-surface-variant">{label}</span>
        <span className="font-headline-lg text-headline-lg text-secondary">{value}</span>
      </div>
      <input
        type="range" min={0} max={max || 1} value={value}
        onChange={e => setValue(Number(e.target.value))}
        className="w-full accent-secondary"
      />
      <div className="flex justify-between text-xs text-on-surface-variant font-label-lg">
        <span>0</span><span>{max}</span>
      </div>
      <input
        type="number" min={0} max={max || 0} value={value}
        onChange={e => setValue(Math.max(0, Math.min(Number(e.target.value), max || 0)))}
        className="w-full bg-surface-container-highest/50 border border-outline-variant text-on-surface rounded-lg py-md px-lg text-center font-headline-md focus:border-secondary outline-none"
      />
    </div>
  )
}

// ─── Countdown ───────────────────────────────────────────────────────────────
function Countdown({ endTime, onExpire, duration = 30 }) {
  const isValid = typeof endTime === 'number' && !isNaN(endTime) && endTime > 1_000_000_000_000
  const [remaining, setRemaining] = useState(() =>
    isValid ? Math.max(0, Math.ceil((endTime - Date.now()) / 1000)) : 0
  )
  const expiredRef = useRef(false)

  useEffect(() => {
    if (!isValid) return
    expiredRef.current = false
    const tick = () => {
      const r = Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
      setRemaining(r)
      if (r === 0 && !expiredRef.current) {
        expiredRef.current = true
        onExpire?.()
      }
    }
    tick()
    const iv = setInterval(tick, 250)
    return () => clearInterval(iv)
  }, [endTime, onExpire, isValid])

  if (!isValid) return null

  const pct = Math.max(0, remaining / duration)
  const radius = 40
  const circ = 2 * Math.PI * radius
  const dash = circ * pct
  const urgency = remaining <= 5

  return (
    <div className="flex flex-col items-center gap-sm">
      <div className="relative w-28 h-28">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-container-highest opacity-40" />
          <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            className={urgency ? 'text-error' : 'text-secondary'}
            style={{ transition: 'stroke-dasharray 0.25s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-extrabold text-3xl ${urgency ? 'text-error animate-pulse' : 'text-on-surface'}`}>
            {remaining}
          </span>
        </div>
      </div>
      <p className={`font-label-lg text-xs ${urgency ? 'text-error animate-pulse' : 'text-on-surface-variant'}`}>
        {onExpire ? 'ثانية للإجابة' : 'ثانية للمنافس'}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ContestantView() {
  const navigate = useNavigate()
  const { gameId, gameState, playerKey, submitAnswer, normalBuzz, buzz, forfeitBuzz, submitBid, submitWager, logout } = useGame()

  const [activeTab, setActiveTab]   = useState('quiz')
  const [bidAmount, setBidAmount]   = useState(0)
  const [wagerAmount, setWagerAmount] = useState(0)
  const [tickerIdx, setTickerIdx]   = useState(0)

  // Redirect if no session
  useEffect(() => {
    if (!gameId || !playerKey) navigate('/')
  }, [gameId, playerKey, navigate])

  // Detect kick
  useEffect(() => {
    if (!gameState || gameState.status === 'lobby') return
    if (gameState?.players?.[playerKey]?.kicked) { logout(); navigate('/') }
  }, [gameState?.players?.[playerKey]?.kicked]) // eslint-disable-line

  // Reset bid/wager when question changes
  useEffect(() => {
    const score = gameState?.players?.[playerKey]?.score || 0
    const half = Math.floor(score / 2)
    setBidAmount(half)
    setWagerAmount(half)
  }, [gameState?.currentQuestionIndex]) // eslint-disable-line

  // Ticker
  const announcements = gameState?.announcements || []
  useEffect(() => {
    if (announcements.length === 0) return
    const iv = setInterval(() => setTickerIdx(t => (t + 1) % announcements.length), 8000)
    return () => clearInterval(iv)
  }, [announcements.length])

  // Derived
  const player        = gameState?.players?.[playerKey] || {}
  const currentIdx    = gameState?.currentQuestionIndex || 0
  const questions     = gameState?.questions || []
  const currentQ      = questions[currentIdx]
  const otherKey      = playerKey === 'player1' ? 'player2' : 'player1'
  const otherPlayer   = gameState?.players?.[otherKey] || {}
  const myScore       = player.score || 0
  const otherScore    = otherPlayer.score || 0
  const myRank        = myScore >= otherScore ? 1 : 2
  const answerStatus  = player.answerStatus
  const judged        = answerStatus === 'pending' || answerStatus === 'accepted' || answerStatus === 'rejected' || answerStatus === 'timeout'
  const roundType     = gameState?.roundType || 'normal'
  const normalBuzzer  = gameState?.normalBuzzer ?? null
  const speedBuzzer   = gameState?.speedBuzzer
  const speedBuzzerTimestamp = gameState?.speedBuzzerTimestamp ?? null
  const auctionWinner = gameState?.auctionWinner
  const whoamiClueIdx = gameState?.whoamiClueIndex || 0
  const myBid         = player.bid
  const myWager       = player.wager

  // ── Loading ───────────────────────────────────────────────────────────────
  if (!gameState) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-lg">
        <Icon name="sync" className="text-display-lg text-primary animate-spin" style={{ animationDuration: '2s' }} />
        <p className="text-on-surface-variant font-label-lg">جاري الاتصال...</p>
        <button onClick={() => { logout(); navigate('/') }} className="text-error font-label-lg hover:underline mt-md">خروج</button>
      </div>
    )
  }

  // ── Lobby ─────────────────────────────────────────────────────────────────
  if (gameState.status === 'lobby') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-xl p-md">
        <div className="fixed inset-0 pitch-lines pointer-events-none opacity-30" />
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
        <div className="relative z-10 text-center glass-card rounded-xxl p-xxl space-y-lg max-w-sm w-full">
          <div className="flex items-center justify-center gap-sm">
            <span className="flex h-4 w-4 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary" />
            </span>
            <span className="font-label-lg text-secondary uppercase tracking-widest">في انتظار المقدم</span>
          </div>
          <Icon name="sports_soccer" className="text-[64px] text-primary opacity-60 block mx-auto" />
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">مرحباً، {player.name || 'متسابق'}!</h2>
            <p className="text-on-surface-variant font-body-md">ستبدأ المسابقة قريباً...</p>
          </div>
          <div className="bg-surface-container-high rounded-xl p-md">
            <p className="text-outline font-label-lg text-xs mb-xs">الغرفة</p>
            <p className="font-headline-md text-headline-md text-primary tracking-widest">{gameId}</p>
          </div>
          <button onClick={() => { logout(); navigate('/') }} className="text-error font-label-lg hover:underline text-sm">مغادرة الغرفة</button>
        </div>
      </div>
    )
  }

  // ── Finished ──────────────────────────────────────────────────────────────
  if (gameState.status === 'finished') {
    const iWon   = myScore > otherScore
    const isDraw = myScore === otherScore
    const diff   = Math.abs(myScore - otherScore)
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-xl p-md">
        <div className="fixed inset-0 pitch-lines pointer-events-none opacity-30" />
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full pointer-events-none" style={{ background: iWon ? 'rgba(149,213,164,0.15)' : 'rgba(220,50,50,0.08)' }} />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full pointer-events-none bg-secondary/5" />
        <div className="relative z-10 w-full max-w-sm space-y-lg">
          <div className={`glass-card rounded-xxl p-xxl text-center space-y-lg border-2 ${iWon ? 'border-secondary/50' : isDraw ? 'border-outline-variant/40' : 'border-error/30'}`}>
            <Icon
              name={iWon ? 'emoji_events' : isDraw ? 'handshake' : 'sports_soccer'}
              className={`text-[80px] block mx-auto ${iWon ? 'text-secondary' : isDraw ? 'text-tertiary' : 'text-primary'}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            />
            <div>
              <h2 className={`font-headline-lg text-headline-lg ${iWon ? 'text-secondary' : isDraw ? 'text-tertiary' : 'text-on-surface'}`}>
                {iWon ? '🎉 أحسنت! لقد فزت' : isDraw ? '🤝 تعادل' : 'انتهت المسابقة'}
              </h2>
              {!iWon && !isDraw && (
                <p className="text-on-surface-variant font-body-md mt-xs">
                  {otherPlayer.name || 'المنافس'} فاز بفارق {diff} نقطة
                </p>
              )}
            </div>

            {/* Final scores */}
            <div className="bg-surface-container-high rounded-xl p-lg space-y-sm">
              <h3 className="text-on-surface-variant font-label-lg text-xs uppercase tracking-widest mb-md">النتيجة النهائية</h3>
              {[
                { name: player.name || 'أنت', score: myScore, isMe: true,  won: iWon },
                { name: otherPlayer.name || 'المنافس', score: otherScore, isMe: false, won: !iWon && !isDraw },
              ].map((row, i) => (
                <div key={i} className={`flex items-center justify-between p-md rounded-xl border-2 ${row.won ? 'border-secondary/40 bg-secondary/5' : 'border-outline-variant/20'}`}>
                  <div className="flex items-center gap-sm">
                    {row.won && <Icon name="emoji_events" className="text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }} />}
                    <span className="font-bold text-on-surface">{row.name}</span>
                    {row.isMe && <span className="text-on-surface-variant font-label-lg text-xs">(أنت)</span>}
                  </div>
                  <span className={`font-extrabold text-xl ${row.won ? 'text-secondary' : row.isMe && isDraw ? 'text-tertiary' : 'text-on-surface'}`}>
                    {row.score}
                  </span>
                </div>
              ))}
            </div>

            <button onClick={() => { logout(); navigate('/') }} className="w-full bg-secondary text-on-secondary font-bold py-md rounded-xl hover:brightness-110 transition-all">
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Active Game ───────────────────────────────────────────────────────────
  const roundLabels = {
    normal: 'جولة عادية', speed: 'جولة السرعة ⚡',
    auction: 'جولة المزاد 💰', whoami: 'من أنا؟ 🎭', golden: 'السؤال الذهبي ⭐',
  }
  const isWhoami = roundType === 'whoami'

  function renderAnswerArea() {
    if (judged) return null

    // Speed
    if (roundType === 'speed') {
      if (!speedBuzzer) {
        return (
          <div className="flex flex-col items-center gap-xl py-xl">
            <p className="text-on-surface-variant font-body-md">اضغط الزر أولاً للإجابة!</p>
            <button
              onClick={() => buzz()}
              className="w-52 h-52 rounded-full bg-error text-on-error shadow-[0_0_80px_rgba(220,50,50,0.5)] active:scale-95 hover:brightness-110 transition-all flex flex-col items-center justify-center gap-sm border-4 border-error/40"
            >
              <Icon name="bolt" className="text-[72px]" style={{ fontVariationSettings: "'FILL' 1" }} />
              <span className="font-extrabold text-headline-lg tracking-widest">BUZZ!</span>
            </button>
          </div>
        )
      }
      if (speedBuzzer === playerKey) {
        const expireTime = speedBuzzerTimestamp ? speedBuzzerTimestamp + 30000 : null
        return (
          <div className="space-y-lg">
            <div className="flex justify-center">
              <Countdown endTime={expireTime} onExpire={() => forfeitBuzz(playerKey)} />
            </div>
            <NormalAnswerForm onSubmit={submitAnswer} label="أنت ضغطت أولاً! ⚡ أجب الآن" />
          </div>
        )
      }
      return (
        <div className="flex flex-col items-center gap-lg py-xl glass-card rounded-xxl p-xl">
          <Icon name="block" className="text-error" style={{ fontSize: '80px' }} />
          <p className="font-headline-md text-headline-md text-error">المنافس ضغط أولاً!</p>
          <Countdown endTime={speedBuzzerTimestamp ? speedBuzzerTimestamp + 30000 : null} />
          <p className="text-on-surface-variant font-body-md">انتظر نتيجة إجابته</p>
        </div>
      )
    }

    // Auction
    if (roundType === 'auction') {
      if (auctionWinner === playerKey)
        return <NormalAnswerForm onSubmit={submitAnswer} label={`فزت بحق الإجابة! عرضك: ${myBid} نقطة 🏆`} />
      if (auctionWinner && auctionWinner !== playerKey)
        return (
          <div className="flex flex-col items-center gap-lg py-xl glass-card rounded-xxl p-xl">
            <Icon name="gavel" className="text-tertiary" style={{ fontSize: '80px' }} />
            <p className="font-headline-md text-headline-md text-tertiary">المنافس فاز بالمزاد</p>
            <p className="text-on-surface-variant font-body-md">انتظر نتيجة إجابته</p>
          </div>
        )
      if (myBid !== null)
        return (
          <div className="flex flex-col items-center gap-lg py-xl glass-card rounded-xxl p-xl">
            <Icon name="hourglass_top" className="text-secondary animate-spin" style={{ fontSize: '64px', animationDuration: '2s' }} />
            <p className="font-headline-md text-headline-md text-secondary">تم تقديم عرضك</p>
            <div className="bg-secondary/10 px-xl py-md rounded-xl border border-secondary/30">
              <span className="font-display-lg text-secondary">{myBid}</span>
              <span className="text-on-surface-variant font-body-md mr-sm">نقطة</span>
            </div>
            <p className="text-on-surface-variant font-body-md">في انتظار قرار المقدم...</p>
          </div>
        )
      return (
        <form onSubmit={e => { e.preventDefault(); submitBid(bidAmount) }} className="glass-card rounded-xxl p-xl space-y-xl">
          <div className="text-center space-y-sm">
            <Icon name="gavel" className="text-secondary" style={{ fontSize: '48px' }} />
            <h3 className="font-headline-md text-headline-md text-on-surface">قدّم عرضك</h3>
            <p className="text-on-surface-variant font-body-md">رصيدك: <span className="text-secondary font-bold">{myScore}</span> نقطة</p>
          </div>
          <SliderInput value={bidAmount} setValue={setBidAmount} max={myScore} label="العرض" />
          <button type="submit" className="w-full bg-secondary text-on-secondary font-bold py-lg rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-sm text-headline-md">
            <Icon name="gavel" /> تأكيد العرض
          </button>
        </form>
      )
    }

    // Who Am I
    if (roundType === 'whoami') {
      const clues   = currentQ?.clues || []
      const revealed = clues.slice(0, whoamiClueIdx + 1)
      const pts     = Array.isArray(currentQ?.points) ? currentQ.points[whoamiClueIdx] : 10
      return (
        <div className="space-y-lg">
          <div className="glass-card rounded-xxl p-xl space-y-md">
            <div className="flex items-center gap-sm mb-md">
              <Icon name="psychology" className="text-secondary" />
              <h3 className="font-headline-sm text-secondary">من أنا؟</h3>
              <span className="mr-auto bg-secondary/10 text-secondary px-md py-xs rounded-full text-xs font-bold border border-secondary/20">{pts} نقطة</span>
            </div>
            {revealed.length === 0 ? (
              <p className="text-on-surface-variant text-center font-body-md py-lg animate-pulse">في انتظار التلميح الأول...</p>
            ) : (
              <div className="space-y-sm">
                {revealed.map((clue, i) => (
                  <div key={i} className={`flex items-start gap-sm p-md rounded-xl ${i === revealed.length - 1 ? 'bg-secondary/10 border border-secondary/30' : 'bg-surface-container-high'}`}>
                    <span className="bg-secondary/20 text-secondary w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <p className="text-on-surface font-body-md">{clue}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {revealed.length > 0 && <NormalAnswerForm onSubmit={submitAnswer} />}
        </div>
      )
    }

    // Golden
    if (roundType === 'golden') {
      if (myWager === null)
        return (
          <form onSubmit={e => { e.preventDefault(); submitWager(wagerAmount) }} className="glass-card rounded-xxl p-xl space-y-xl">
            <div className="text-center space-y-sm">
              <Icon name="star" className="text-secondary" style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }} />
              <h3 className="font-headline-md text-headline-md text-on-surface">السؤال الذهبي ⭐</h3>
              <p className="text-on-surface-variant font-body-md">رصيدك: <span className="text-secondary font-bold">{myScore}</span> نقطة</p>
            </div>
            <SliderInput value={wagerAmount} setValue={setWagerAmount} max={myScore} label="الرهان" />
            <button type="submit" className="w-full bg-secondary text-on-secondary font-bold py-lg rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-sm text-headline-md">
              <Icon name="star" style={{ fontVariationSettings: "'FILL' 1" }} /> تأكيد الرهان
            </button>
          </form>
        )
      return <NormalAnswerForm onSubmit={submitAnswer} label={`رهانك: ${myWager} نقطة | صح: +${myWager} | خطأ: -${myWager}`} />
    }

    return null
  }

  const latestAnnouncement = announcements.length > 0 ? announcements[tickerIdx % announcements.length]?.text : null
  const tickerContent = (
    <span className="inline-flex items-center gap-md whitespace-nowrap" style={{ paddingLeft: '2rem', paddingRight: '100vw' }}>
      {latestAnnouncement ? (
        <>
          <Icon name="campaign" className="text-secondary shrink-0" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }} />
          <span className="font-body-lg text-secondary text-sm">{latestAnnouncement}</span>
        </>
      ) : (
        <>
          <Icon name="sports_soccer" className="text-primary/40 shrink-0" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }} />
          <span className="font-body-lg text-on-surface-variant/40 text-sm">Stadium Pulse</span>
        </>
      )}
    </span>
  )

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] text-primary" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50%" cy="50%" fill="none" r="150" stroke="currentColor" strokeWidth="2" />
          <line stroke="currentColor" strokeWidth="2" x1="50%" x2="50%" y1="0" y2="100%" />
        </svg>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-gutter py-md w-full sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-xl">
        <div className="flex items-center gap-md">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center border-2 border-primary/30">
            <Icon name="person" className="text-on-secondary-container" />
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm text-primary tracking-tight">{player.name || 'متسابق'}</h1>
            <p className="text-on-surface-variant font-label-lg text-xs">المركز: {myRank === 1 ? 'الأول 🥇' : 'الثاني'}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-xs bg-primary-container px-md py-xs rounded-full">
            <Icon name="stars" className="text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }} />
            <span className="font-headline-sm text-headline-sm text-primary-fixed">{myScore}</span>
          </div>
          <span className="text-on-surface-variant text-[10px] uppercase font-bold mt-1">نقطة</span>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-gutter pt-xl pb-[224px] space-y-xl">
        {/* Live + round pill */}
        <div className="flex justify-center gap-sm flex-wrap">
          <div className="glass-card px-xl py-xs rounded-full flex items-center gap-md">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
            </span>
            <span className="font-label-lg text-secondary uppercase tracking-widest">مباشر الآن</span>
            <div className="h-4 w-px bg-outline-variant/50" />
            <span className="font-label-lg text-on-surface-variant">{currentIdx + 1} / {questions.length}</span>
          </div>
          {roundType !== 'normal' && (
            <div className="bg-secondary/10 border border-secondary/30 px-md py-xs rounded-full font-label-lg text-secondary">
              {roundLabels[roundType]}
            </div>
          )}
        </div>

        {/* Question card */}
        <div className="glass-card rounded-xxl p-xl relative overflow-hidden group border-2 border-primary/20">
          <div className="absolute -right-10 -top-10 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon name={isWhoami ? 'psychology' : 'sports_soccer'} className="text-[160px] text-primary" />
          </div>
          <div className="relative z-10 space-y-md text-center">
            <span className="bg-secondary/10 text-secondary border border-secondary/20 px-md py-xs rounded-full font-label-lg">
              {isWhoami ? 'فقرة: من أنا؟ 🎭' : `السؤال ${currentIdx + 1}`}
            </span>
            <h2 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface leading-tight">
              {isWhoami ? 'اقرأ التلميحات وخمّن من أنا!' : (currentQ?.text || 'في انتظار السؤال...')}
            </h2>
            {isWhoami && (
              <p className="text-on-surface-variant font-body-md text-sm">كلما أجبت مبكراً، نلت نقاطاً أكثر</p>
            )}
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto" />
          </div>
        </div>

        {/* Answer area */}
        {renderAnswerArea()}

        {/* Standings */}
        <div className="glass-card rounded-xl p-lg">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-md border-b border-outline-variant/30 pb-xs">النتائج الحالية</h3>
          <div className="space-y-sm">
            {[
              { key: playerKey, p: player, label: `أنت (${player.name || ''})` },
              { key: otherKey, p: otherPlayer, label: otherPlayer.name || 'المنافس' },
            ].sort((a, b) => (b.p.score || 0) - (a.p.score || 0)).map(({ key, p, label }, rank) => (
              <div key={key} className={`flex items-center justify-between p-sm rounded-lg ${key === playerKey ? 'border border-secondary/20 bg-secondary/5' : 'bg-surface-variant/30'}`}>
                <div className="flex items-center gap-sm">
                  <span className={`font-bold ${rank === 0 ? 'text-secondary' : 'text-tertiary-fixed'}`}>#{rank + 1}</span>
                  <span className="text-on-surface">{label}</span>
                </div>
                <span className={`font-bold ${key === playerKey ? 'text-secondary' : 'text-on-surface'}`}>
                  {p.score || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Pause overlay */}
      {gameState.paused && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-background/90 backdrop-blur-md">
          <div className="glass-card rounded-xxl p-xxl text-center space-y-lg border border-tertiary/30 max-w-sm w-[90%]">
            <Icon name="pause_circle" className="text-tertiary block mx-auto" style={{ fontSize: '80px', fontVariationSettings: "'FILL' 1" }} />
            <h2 className="font-headline-lg text-headline-lg text-on-surface">استراحة</h2>
            <p className="text-on-surface-variant font-body-md">ستستأنف المسابقة قريباً...</p>
          </div>
        </div>
      )}

      {/* Result overlay */}
      {judged && (
        <div className="fixed bottom-[130px] lg:bottom-[60px] left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-[45]">
          <div className={`glass-card rounded-xxl p-lg border-2 bg-surface-container-highest/90 ${
            answerStatus === 'accepted' ? 'border-secondary/60'
            : (answerStatus === 'rejected' || answerStatus === 'timeout') ? 'border-error/60'
            : 'neon-border-pulse'
          }`}>
            <div className="flex items-center gap-lg">
              <div className={`p-md rounded-xl shrink-0 ${
                answerStatus === 'accepted' ? 'bg-secondary-container'
                : (answerStatus === 'rejected' || answerStatus === 'timeout') ? 'bg-error-container'
                : 'bg-tertiary-container'
              }`}>
                <Icon
                  name={answerStatus === 'accepted' ? 'check_circle' : answerStatus === 'rejected' ? 'cancel' : answerStatus === 'timeout' ? 'timer_off' : 'sync'}
                  className={`text-display-lg ${
                    answerStatus === 'accepted' ? 'text-secondary'
                    : (answerStatus === 'rejected' || answerStatus === 'timeout') ? 'text-error'
                    : 'text-tertiary-fixed animate-spin'
                  }`}
                  style={answerStatus === 'pending' ? { animationDuration: '3s' } : undefined}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-headline-sm text-headline-sm ${
                  answerStatus === 'accepted' ? 'text-secondary'
                  : (answerStatus === 'rejected' || answerStatus === 'timeout') ? 'text-error'
                  : 'text-tertiary-fixed'
                }`}>
                  {answerStatus === 'accepted' ? 'إجابة صحيحة! 🎉'
                  : answerStatus === 'rejected' ? 'إجابة غير صحيحة'
                  : answerStatus === 'timeout' ? 'انتهى الوقت! ⏱️'
                  : 'تم استلام إجابتك'}
                </h4>
                {(answerStatus === 'rejected' || answerStatus === 'timeout') && currentQ?.answer ? (
                  <div className="mt-xs">
                    <p className="text-on-surface-variant font-body-md text-sm">الإجابة الصحيحة:</p>
                    <p className="text-secondary font-bold">{currentQ.answer}</p>
                  </div>
                ) : (
                  <p className="text-on-surface-variant font-body-md text-sm">
                    {answerStatus === 'accepted' ? 'أضيفت النقاط إلى رصيدك'
                    : answerStatus === 'timeout' ? 'تذهب المحاولة للمنافس...'
                    : 'في انتظار تصحيح المقدم...'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* News Ticker */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-40 bg-surface-container-highest/95 backdrop-blur-md border-t border-primary/20 h-12 flex items-center overflow-hidden">
        <div
          className="bg-primary text-on-primary font-bold h-full flex items-center px-3 shrink-0 z-10 gap-1"
          style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 100%, 0 100%)' }}
        >
          <Icon name="rss_feed" style={{ fontSize: '14px' }} />
        </div>
        <div className="flex-grow overflow-hidden" dir="ltr">
          <div className="inline-flex animate-ticker">
            {tickerContent}
            {tickerContent}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-sm px-md lg:hidden bg-surface-container-highest/95 backdrop-blur-md border-t border-primary/20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] rounded-t-xl" style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))' }}>
        {[
          { id: 'quiz', icon: 'emoji_events', label: 'Quiz' },
          { id: 'leaderboard', icon: 'leaderboard', label: 'Standings' },
          { id: 'redeem', icon: 'redeem', label: 'Prizes' },
          { id: 'person', icon: 'person', label: 'Profile' },
        ].map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center rounded-xl px-4 py-1 transition-all active:scale-110 duration-150 ${activeTab === item.id ? 'bg-primary-container/30 text-primary-fixed-dim border border-primary/30' : 'text-on-surface-variant/70 hover:text-primary'}`}>
            <Icon name={item.icon} style={activeTab === item.id ? { fontVariationSettings: "'FILL' 1" } : undefined} />
            <span className="font-label-lg text-label-lg">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
