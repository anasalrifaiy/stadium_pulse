import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../contexts/GameContext'

function Icon({ name, className = '', style }) {
  return <span className={`material-symbols-outlined ${className}`} style={style}>{name}</span>
}

export default function ContestantView() {
  const navigate = useNavigate()
  const { gameId, gameState, playerKey, submitAnswer, setAnswering, logout } = useGame()
  const [textAnswer, setTextAnswer] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [activeTab, setActiveTab] = useState('quiz')
  const recognitionRef = useRef(null)

  // Redirect home if no session
  useEffect(() => {
    if (!gameId || !playerKey) { navigate('/'); return }
  }, [gameId, playerKey, navigate])

  // Voice recognition setup
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
      if (e.results[e.results.length - 1].isFinal) {
        setTextAnswer(t)
        setTranscript('')
      }
    }
    rec.onend = () => { setIsRecording(false); setAnswering(false) }
    rec.onerror = () => { setIsRecording(false); setAnswering(false) }
    recognitionRef.current = rec
  }, [setAnswering])

  // Clear answer when question changes
  useEffect(() => {
    setTextAnswer('')
    setTranscript('')
  }, [gameState?.currentQuestionIndex])

  const player = gameState?.players?.[playerKey] || {}
  const currentIdx = gameState?.currentQuestionIndex || 0
  const questions = gameState?.questions || []
  const currentQ = questions[currentIdx]
  const otherKey = playerKey === 'player1' ? 'player2' : 'player1'
  const otherPlayer = gameState?.players?.[otherKey] || {}
  const myRank = (player.score || 0) >= (otherPlayer.score || 0) ? 1 : 2
  const answerStatus = player.answerStatus
  const hasPendingOrJudged = answerStatus === 'pending' || answerStatus === 'accepted' || answerStatus === 'rejected'

  async function handleSubmit(e) {
    e?.preventDefault()
    const ans = textAnswer.trim() || transcript.trim()
    if (!ans) return
    await submitAnswer(ans)
    setTextAnswer('')
    setTranscript('')
  }

  function toggleRecording() {
    const rec = recognitionRef.current
    if (!rec) { alert('المتصفح لا يدعم التعرف الصوتي العربي'); return }
    if (isRecording) {
      rec.stop()
    } else {
      setTranscript('')
      setIsRecording(true)
      setAnswering(true)
      try { rec.start() } catch { setIsRecording(false); setAnswering(false) }
    }
  }

  // ── Loading ──
  if (!gameState) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-lg">
        <Icon name="sync" className="text-display-lg text-primary animate-spin" style={{ animationDuration: '2s' }} />
        <p className="text-on-surface-variant font-label-lg">جاري الاتصال...</p>
        <button onClick={() => { logout(); navigate('/') }} className="text-error font-label-lg hover:underline mt-md">
          خروج
        </button>
      </div>
    )
  }

  // ── Waiting Lobby ──
  if (gameState.status === 'lobby') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-xl p-md">
        <div className="fixed inset-0 pitch-lines pointer-events-none opacity-30" />
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />

        <div className="relative z-10 text-center glass-card rounded-xxl p-xxl space-y-lg max-w-sm w-full">
          {/* Pulse indicator */}
          <div className="flex items-center justify-center gap-sm">
            <span className="flex h-4 w-4 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary" />
            </span>
            <span className="font-label-lg text-secondary uppercase tracking-widest">في انتظار المقدم</span>
          </div>

          <Icon name="sports_soccer" className="text-[64px] text-primary opacity-60 block mx-auto" />

          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
              مرحباً، {player.name || 'متسابق'}!
            </h2>
            <p className="text-on-surface-variant font-body-md">ستبدأ المسابقة قريباً...</p>
          </div>

          <div className="bg-surface-container-high rounded-xl p-md">
            <p className="text-outline font-label-lg text-xs mb-xs">الغرفة</p>
            <p className="font-headline-md text-headline-md text-primary tracking-widest">{gameId}</p>
          </div>

          <button
            onClick={() => { logout(); navigate('/') }}
            className="text-error font-label-lg hover:underline text-sm"
          >
            مغادرة الغرفة
          </button>
        </div>
      </div>
    )
  }

  // ── Game Finished ──
  if (gameState.status === 'finished') {
    const myScore = player.score || 0
    const otherScore = otherPlayer.score || 0
    const won = myScore >= otherScore

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-xl p-md">
        <div className="fixed inset-0 pitch-lines pointer-events-none opacity-30" />
        <div className="relative z-10 text-center glass-card rounded-xxl p-xxl space-y-lg max-w-sm w-full">
          <Icon
            name={won ? 'emoji_events' : 'sports_soccer'}
            className={`text-[80px] block mx-auto ${won ? 'text-secondary' : 'text-primary'}`}
          />
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            {won ? 'أحسنت! لقد فزت' : 'انتهت المسابقة'}
          </h2>
          <p className="text-display-lg font-display-lg text-secondary">{myScore}</p>
          <p className="text-on-surface-variant">نقطة</p>
          <button
            onClick={() => { logout(); navigate('/') }}
            className="w-full bg-secondary text-on-secondary font-bold py-md rounded-xl"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    )
  }

  // ── Active Game ──
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] text-primary" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50%" cy="50%" fill="none" r="150" stroke="currentColor" strokeWidth="2" />
          <line stroke="currentColor" strokeWidth="2" x1="50%" x2="50%" y1="0" y2="100%" />
        </svg>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
      </div>

      {/* Top Bar */}
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
            <span className="font-headline-sm text-headline-sm text-primary-fixed">{(player.score || 0).toLocaleString('ar-SA')}</span>
          </div>
          <span className="text-on-surface-variant text-[10px] uppercase font-bold mt-1">نقطة</span>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-gutter pt-xl pb-[140px] space-y-xl">
        {/* Live pill */}
        <div className="flex justify-center">
          <div className="glass-card px-xl py-xs rounded-full flex items-center gap-md">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
            </span>
            <span className="font-label-lg text-secondary uppercase tracking-widest">مباشر الآن</span>
            <div className="h-4 w-px bg-outline-variant/50" />
            <span className="font-label-lg text-on-surface-variant">{currentIdx + 1} / {questions.length}</span>
          </div>
        </div>

        {/* Question */}
        <div className="glass-card rounded-xxl p-xl relative overflow-hidden group border-2 border-primary/20">
          <div className="absolute -right-10 -top-10 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon name="sports_soccer" className="text-[160px] text-primary" />
          </div>
          <div className="relative z-10 space-y-md text-center">
            <span className="bg-secondary/10 text-secondary border border-secondary/20 px-md py-xs rounded-full font-label-lg">
              السؤال {currentIdx + 1}
            </span>
            <h2 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface leading-tight">
              {currentQ?.text || 'في انتظار السؤال...'}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto" />
          </div>
        </div>

        {/* Answer area — hidden after submitting */}
        {!hasPendingOrJudged && (
          <div className="space-y-lg">
            {/* Text input */}
            <form onSubmit={handleSubmit} className="glass-card rounded-xl p-lg space-y-md">
              <label className="font-label-lg text-on-surface-variant block">اكتب إجابتك هنا</label>
              <input
                className="w-full bg-surface-container-highest/50 border-2 border-outline-variant/30 rounded-lg py-xl px-lg font-headline-md text-headline-md text-on-surface focus:border-secondary transition-colors placeholder:text-on-surface-variant/30 outline-none"
                placeholder={transcript || 'اكتب إجابتك...'}
                type="text"
                value={textAnswer}
                onChange={e => setTextAnswer(e.target.value)}
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
                {transcript && (
                  <p className="text-secondary font-body-md text-sm text-center px-md animate-pulse">{transcript}</p>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!textAnswer.trim() && !transcript.trim()}
                className="min-h-[140px] bg-secondary text-on-secondary-container font-headline-md text-headline-md rounded-xl py-xl px-lg hover:bg-secondary-fixed transition-all flex items-center justify-center gap-md shadow-2xl disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                إرسال الإجابة
                <Icon name="send" />
              </button>
            </div>
          </div>
        )}

        {/* Standings */}
        <div className="glass-card rounded-xl p-lg">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-md border-b border-outline-variant/30 pb-xs">
            النتائج الحالية
          </h3>
          <div className="space-y-sm">
            {[
              { key: playerKey, p: player, label: `أنت (${player.name || ''})` },
              { key: otherKey, p: otherPlayer, label: otherPlayer.name || 'المنافس' },
            ].sort((a, b) => (b.p.score || 0) - (a.p.score || 0)).map(({ key, p, label }, rank) => (
              <div
                key={key}
                className={`flex items-center justify-between p-sm rounded-lg ${
                  key === playerKey ? 'border border-secondary/20 bg-secondary/5' : 'bg-surface-variant/30'
                }`}
              >
                <div className="flex items-center gap-sm">
                  <span className={`font-bold ${rank === 0 ? 'text-secondary' : 'text-tertiary-fixed'}`}>#{rank + 1}</span>
                  <span className="text-on-surface">{label}</span>
                </div>
                <span className={`font-bold ${key === playerKey ? 'text-secondary' : 'text-on-surface'}`}>
                  {(p.score || 0).toLocaleString('ar-SA')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Result overlay */}
      {hasPendingOrJudged && (
        <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-40">
          <div className={`glass-card rounded-xxl p-lg border-2 bg-surface-container-highest/90 ${
            answerStatus === 'accepted' ? 'border-secondary/60'
            : answerStatus === 'rejected' ? 'border-error/60'
            : 'neon-border-pulse'
          }`}>
            <div className="flex items-center gap-lg">
              <div className={`p-md rounded-xl shrink-0 ${
                answerStatus === 'accepted' ? 'bg-secondary-container'
                : answerStatus === 'rejected' ? 'bg-error-container'
                : 'bg-tertiary-container'
              }`}>
                <Icon
                  name={answerStatus === 'accepted' ? 'check_circle' : answerStatus === 'rejected' ? 'cancel' : 'sync'}
                  className={`text-display-lg ${
                    answerStatus === 'accepted' ? 'text-secondary'
                    : answerStatus === 'rejected' ? 'text-error'
                    : 'text-tertiary-fixed animate-spin'
                  }`}
                  style={answerStatus === 'pending' ? { animationDuration: '3s' } : undefined}
                />
              </div>
              <div>
                <h4 className={`font-headline-sm text-headline-sm ${
                  answerStatus === 'accepted' ? 'text-secondary'
                  : answerStatus === 'rejected' ? 'text-error'
                  : 'text-tertiary-fixed'
                }`}>
                  {answerStatus === 'accepted' ? 'إجابة صحيحة! 🎉'
                  : answerStatus === 'rejected' ? 'إجابة غير صحيحة'
                  : 'تم استلام إجابتك'}
                </h4>
                <p className="text-on-surface-variant font-body-md text-sm">
                  {answerStatus === 'accepted' ? `+${questions[currentIdx]?.points || 10} نقاط أضيفت`
                  : answerStatus === 'rejected' ? 'انتظر السؤال القادم'
                  : 'في انتظار تصحيح المقدم...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-sm px-md lg:hidden bg-surface-container-highest/95 backdrop-blur-md border-t border-primary/20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] rounded-t-xl">
        {[
          { id: 'quiz', icon: 'emoji_events', label: 'Quiz' },
          { id: 'leaderboard', icon: 'leaderboard', label: 'Standings' },
          { id: 'redeem', icon: 'redeem', label: 'Prizes' },
          { id: 'person', icon: 'person', label: 'Profile' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center rounded-xl px-4 py-1 transition-all active:scale-110 duration-150 ${
              activeTab === item.id
                ? 'bg-primary-container/30 text-primary-fixed-dim border border-primary/30'
                : 'text-on-surface-variant/70 hover:text-primary'
            }`}
          >
            <Icon name={item.icon} style={activeTab === item.id ? { fontVariationSettings: "'FILL' 1" } : undefined} />
            <span className="font-label-lg text-label-lg">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
