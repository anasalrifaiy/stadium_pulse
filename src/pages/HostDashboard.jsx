import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../contexts/GameContext'

function Icon({ name, className = '', style }) {
  return <span className={`material-symbols-outlined ${className}`} style={style}>{name}</span>
}

// ── Lobby Screen (before game starts) ──────────────────────────────────────
function LobbyScreen({ gameId, gameState, onStart, onLogout }) {
  const players = gameState?.players || {}
  const p1 = players.player1 || {}
  const p2 = players.player2 || {}

  return (
    <div className="min-h-screen bg-background stadium-pattern flex flex-col items-center justify-center p-gutter">
      <div className="fixed inset-0 pitch-lines pointer-events-none opacity-30" />
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg space-y-xl">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-sm mb-sm">
            <Icon name="sports_soccer" className="text-primary text-headline-lg" />
            <h1 className="font-headline-lg text-headline-lg font-extrabold text-primary italic uppercase tracking-tighter">
              Stadium Pulse
            </h1>
          </div>
          <p className="text-on-surface-variant font-label-lg">لوحة تحكم المقدم</p>
        </div>

        {/* Room Code */}
        <div className="glass-card rounded-xxl p-xl text-center space-y-sm border border-secondary/30">
          <p className="text-on-surface-variant font-label-lg">رمز الغرفة — شاركه مع المتسابقين</p>
          <div className="flex items-center justify-center gap-md">
            <span className="font-display-lg text-display-lg text-secondary tracking-[0.3em]">{gameId}</span>
            <button
              onClick={() => navigator.clipboard?.writeText(gameId)}
              className="p-sm bg-surface-variant rounded-lg hover:bg-surface-container transition-colors"
              title="نسخ"
            >
              <Icon name="content_copy" className="text-on-surface-variant text-sm" />
            </button>
          </div>
          <p className="text-xs text-outline font-label-lg">
            اعرض هذا الرمز للمتسابقين ليدخلوا على{' '}
            <span className="text-primary">{window.location.origin}{window.location.pathname}</span>
          </p>
        </div>

        {/* Players Status */}
        <div className="glass-card rounded-xl p-lg space-y-md">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm">
            <Icon name="groups" className="text-primary" />
            المتسابقون
          </h3>
          <div className="grid grid-cols-2 gap-md">
            {[
              { key: 'player1', player: p1, color: 'secondary', label: 'المتسابق الأول' },
              { key: 'player2', player: p2, color: 'tertiary', label: 'المتسابق الثاني' },
            ].map(({ key, player, color, label }) => (
              <div
                key={key}
                className={`p-md rounded-xl border transition-all ${
                  player.name
                    ? `border-${color}/40 bg-${color}/10`
                    : 'border-outline-variant/30 bg-surface-container-high/50'
                }`}
              >
                <div className="flex items-center gap-sm mb-xs">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${player.name ? `bg-${color}/20` : 'bg-surface-variant'}`}>
                    <Icon name={player.name ? 'person' : 'person_off'} className={`text-sm ${player.name ? `text-${color}` : 'text-outline'}`} />
                  </div>
                  <div>
                    <p className={`font-label-lg text-sm ${player.name ? 'text-on-surface' : 'text-outline'}`}>
                      {player.name || label}
                    </p>
                    <p className={`text-xs font-label-lg ${player.name ? 'text-secondary' : 'text-outline'}`}>
                      {player.name ? '✓ انضم' : 'في الانتظار...'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scoreboard link */}
        <div className="text-center">
          <a
            href={`#/scoreboard?game=${gameId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-sm text-tertiary font-label-lg hover:text-tertiary-fixed transition-colors"
          >
            <Icon name="tv" className="text-sm" />
            افتح لوحة النتائج في شاشة منفصلة
          </a>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="w-full h-20 bg-secondary text-on-secondary rounded-xxl font-headline-lg flex items-center justify-center gap-md neon-border-green hover:brightness-105 active:scale-[0.98] transition-all shadow-2xl"
        >
          <Icon name="play_circle" className="text-3xl" />
          بدء المسابقة
        </button>

        <button
          onClick={onLogout}
          className="w-full py-sm text-error font-label-lg hover:underline"
        >
          خروج
        </button>
      </div>
    </div>
  )
}

// ── Player Card ────────────────────────────────────────────────────────────
function PlayerCard({ playerKey, player, onAccept, onReject, onAdjust }) {
  const isP1 = playerKey === 'player1'
  const borderColor = isP1 ? 'border-secondary' : 'border-tertiary'
  const textColor = isP1 ? 'text-secondary' : 'text-tertiary'
  const containerBg = isP1 ? 'bg-primary-container text-on-primary-container' : 'bg-tertiary-container text-on-tertiary-container'
  const score = player.score || 0

  return (
    <div className={`glass-card rounded-xl p-md border-r-4 ${borderColor}`}>
      <div className="flex items-center gap-md mb-md">
        <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center border-2 border-outline-variant/30">
          <Icon name="person" className={`text-headline-md ${textColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-headline-sm text-headline-sm text-on-surface truncate">
            {player.name || (isP1 ? 'المتسابق الأول' : 'المتسابق الثاني')}
          </h4>
          <p className={`${textColor} font-label-lg`}>{score.toLocaleString('ar-SA')} نقطة</p>
        </div>
        <div className="flex flex-col gap-xs">
          <button onClick={() => onAdjust(playerKey, 10)} className={`w-8 h-8 flex items-center justify-center ${containerBg} rounded-lg hover:opacity-80 transition-colors active:scale-90`}>
            <Icon name="add" className="text-sm" />
          </button>
          <button onClick={() => onAdjust(playerKey, -10)} className="w-8 h-8 flex items-center justify-center bg-surface-variant text-on-surface-variant rounded-lg hover:bg-error/30 transition-colors active:scale-90">
            <Icon name="remove" className="text-sm" />
          </button>
        </div>
      </div>

      {/* Answer */}
      {player.currentAnswer ? (
        <div className="mb-md p-sm bg-surface-container-high rounded-lg border border-outline-variant/20">
          <p className="text-on-surface-variant font-label-lg text-xs mb-xs">إجابة المتسابق:</p>
          <p className="font-headline-sm text-on-surface mb-sm">{player.currentAnswer}</p>

          {(player.answerStatus === null || player.answerStatus === 'pending') ? (
            <div className="flex gap-sm">
              <button
                onClick={() => onAccept(playerKey)}
                className="flex-1 py-sm bg-secondary text-on-secondary rounded-lg font-label-lg flex items-center justify-center gap-xs hover:brightness-105 transition-all active:scale-95"
              >
                <Icon name="check" className="text-sm" /> قبول
              </button>
              <button
                onClick={() => onReject(playerKey)}
                className="flex-1 py-sm bg-error-container text-on-error-container rounded-lg font-label-lg flex items-center justify-center gap-xs hover:opacity-90 transition-all active:scale-95"
              >
                <Icon name="close" className="text-sm" /> رفض
              </button>
            </div>
          ) : (
            <div className={`flex items-center gap-xs px-sm py-xs rounded-full w-fit font-label-lg text-xs ${
              player.answerStatus === 'accepted'
                ? 'bg-secondary/20 text-secondary'
                : 'bg-error/20 text-error'
            }`}>
              <Icon name={player.answerStatus === 'accepted' ? 'check_circle' : 'cancel'} className="text-sm" />
              {player.answerStatus === 'accepted' ? 'تمت الموافقة' : 'تم الرفض'}
            </div>
          )}
        </div>
      ) : (
        <p className="text-outline font-label-lg text-xs mb-md">
          {player.isAnswering ? (
            <span className="text-tertiary flex items-center gap-xs animate-pulse">
              <Icon name="mic" className="text-sm" /> يسجل صوتياً...
            </span>
          ) : 'لم يرسل إجابة بعد'}
        </p>
      )}

      <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ${isP1 ? 'bg-secondary' : 'bg-tertiary'}`}
          style={{ width: `${Math.min(100, (score / 200) * 100)}%` }}
        />
      </div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function HostDashboard() {
  const navigate = useNavigate()
  const { gameId, gameState, setQuestion, judgeAnswer, adjustScore, publishAnnouncement, setStatus, logout } = useGame()
  const [announcement, setAnnouncement] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [activeNav, setActiveNav] = useState('quiz')
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!gameId) { navigate('/'); return }
  }, [gameId, navigate])

  useEffect(() => {
    const iv = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(iv)
  }, [])

  const formatTime = s => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    return `${m}:${(s % 60).toString().padStart(2, '0')}`
  }

  // ── Loading ──
  if (!gameState) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-lg">
        <Icon name="sync" className="text-display-lg text-primary animate-spin" style={{ animationDuration: '2s' }} />
        <p className="text-on-surface-variant font-label-lg">جاري الاتصال بالغرفة...</p>
        <p className="text-outline text-xs font-label-lg">رمز الغرفة: {gameId}</p>
        <button onClick={() => { logout(); navigate('/') }} className="text-error font-label-lg hover:underline mt-md">
          خروج
        </button>
      </div>
    )
  }

  // ── Lobby ──
  if (gameState.status === 'lobby') {
    return (
      <LobbyScreen
        gameId={gameId}
        gameState={gameState}
        onStart={async () => {
          await setStatus('active')
          await setQuestion(0)
        }}
        onLogout={() => { logout(); navigate('/') }}
      />
    )
  }

  // ── Active / Finished ──
  const questions = gameState.questions || []
  const currentIdx = gameState.currentQuestionIndex || 0
  const currentQ = questions[currentIdx]
  const players = gameState.players || {}
  const announcements = gameState.announcements || []
  const hasPending = Object.values(players).some(p => p.answerStatus === 'pending')

  async function handlePublish() {
    if (!announcement.trim()) return
    await publishAnnouncement(announcement)
    setAnnouncement('')
    setShowModal(false)
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen stadium-pattern">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col p-md space-y-sm bg-surface-container-low/90 backdrop-blur-lg h-screen w-64 fixed right-0 top-0 border-l border-outline-variant/20 shadow-2xl z-50">
        <div className="flex items-center gap-md mb-xl p-md">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center border-2 border-primary">
            <Icon name="settings_suggest" className="text-primary" />
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md text-primary leading-tight">لوحة التحكم</h2>
            <p className="text-xs text-on-surface-variant font-label-lg">كود: {gameId}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-sm">
          {[
            { id: 'quiz', icon: 'sports_soccer', label: 'الجولة الحالية' },
            { id: 'stats', icon: 'query_stats', label: 'الإحصائيات' },
            { id: 'players', icon: 'groups', label: 'المتسابقون' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-md px-md py-md rounded-lg font-bold cursor-pointer transition-all duration-300 ${
                activeNav === item.id
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:translate-x-[-4px]'
              }`}
            >
              <Icon name={item.icon} />
              <span className="font-body-md text-body-md">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="space-y-sm">
          <a
            href={`#/scoreboard?game=${gameId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-md bg-tertiary-container text-on-tertiary-container rounded-xl font-bold flex items-center justify-center gap-sm hover:opacity-90 transition-opacity"
          >
            <Icon name="tv" /> لوحة النتائج
          </a>
          <button
            onClick={async () => { await setStatus('finished'); logout(); navigate('/') }}
            className="w-full py-md bg-error-container text-on-error-container rounded-xl font-bold flex items-center justify-center gap-sm hover:opacity-90 transition-opacity"
          >
            <Icon name="cancel" /> إنهاء المسابقة
          </button>
        </div>
      </aside>

      {/* Top Bar */}
      <header className="flex justify-between items-center px-gutter py-md w-full sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-xl lg:pr-72">
        <div className="flex items-center gap-md">
          <Icon name="sports_soccer" className="text-primary" />
          <span className="font-headline-lg text-headline-lg font-extrabold text-primary italic uppercase tracking-tighter hidden sm:block">
            Stadium Pulse
          </span>
        </div>
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-sm bg-surface-container-highest px-md py-sm rounded-full border border-primary/20 neon-border-blue">
            <Icon name="timer" className="text-primary" />
            <span className="font-headline-sm text-headline-sm text-primary tracking-widest">{formatTime(elapsed)}</span>
          </div>
          <div className="flex items-center gap-xs bg-error/20 px-sm py-xs rounded-full animate-pulse">
            <span className="w-2 h-2 bg-error rounded-full" />
            <span className="text-error font-label-lg text-xs uppercase">مباشر</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="lg:pr-64 p-gutter max-w-container-max mx-auto pb-24 lg:pb-gutter">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-lg">

          {/* Left: Controls */}
          <section className="xl:col-span-8 space-y-lg">

            {/* Current Question */}
            <div className="glass-card rounded-xxl p-xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <div className="flex items-center justify-between mb-md">
                <h3 className="text-on-surface-variant font-label-lg">السؤال الحالي</h3>
                <span className="bg-primary/20 text-primary-fixed border border-primary/30 px-md py-xs rounded-lg font-label-lg">
                  {currentIdx + 1} / {questions.length}
                </span>
              </div>
              <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-xl leading-tight">
                {currentQ?.text || 'لا يوجد سؤال'}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="bg-surface-container-high p-md rounded-xl border border-outline-variant/30">
                  <p className="text-on-surface-variant font-label-lg mb-xs">الإجابة الصحيحة</p>
                  <p className="font-headline-md text-headline-md text-secondary">{currentQ?.answer || '—'}</p>
                </div>
                <div className="bg-surface-container-high p-md rounded-xl border border-outline-variant/30">
                  <p className="text-on-surface-variant font-label-lg mb-xs">النقاط</p>
                  <p className="font-headline-md text-headline-md text-tertiary">{currentQ?.points || 10} نقطة</p>
                </div>
              </div>
            </div>

            {/* Accept / Reject */}
            <div className="flex flex-wrap gap-md">
              <button
                onClick={() => {
                  const pk = Object.keys(players).find(k => players[k]?.answerStatus === 'pending')
                  if (pk) judgeAnswer(pk, 'accepted')
                }}
                disabled={!hasPending}
                className="flex-1 min-w-[200px] h-20 bg-secondary text-on-secondary rounded-xl font-headline-md flex items-center justify-center gap-md neon-border-green hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
              >
                <Icon name="check_circle" className="text-3xl" />
                قبول الإجابة
              </button>
              <button
                onClick={() => {
                  const pk = Object.keys(players).find(k => players[k]?.answerStatus === 'pending')
                  if (pk) judgeAnswer(pk, 'rejected')
                }}
                disabled={!hasPending}
                className="flex-1 min-w-[200px] h-20 bg-error-container text-on-error-container rounded-xl font-headline-md border border-error/50 flex items-center justify-center gap-md hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
              >
                <Icon name="cancel" className="text-3xl" />
                رفض الإجابة
              </button>
            </div>

            {!hasPending && (
              <p className="text-outline font-label-lg text-center text-sm -mt-sm">
                في انتظار إجابة من المتسابقين...
              </p>
            )}

            {/* Navigation */}
            <div className="flex gap-md">
              <button
                onClick={() => setQuestion(currentIdx - 1)}
                disabled={currentIdx === 0}
                className="flex-1 bg-surface-container-highest text-on-surface py-md rounded-xl font-label-lg border border-outline/30 flex items-center justify-center gap-sm hover:bg-surface-variant transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Icon name="skip_previous" /> السابق
              </button>
              <button
                onClick={() => setQuestion(currentIdx + 1)}
                disabled={currentIdx >= questions.length - 1}
                className="flex-1 bg-surface-container-highest text-on-surface py-md rounded-xl font-label-lg border border-outline/30 flex items-center justify-center gap-sm hover:bg-surface-variant transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Icon name="skip_next" /> التالي
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 bg-surface-container-highest text-on-surface py-md rounded-xl font-label-lg border border-outline/30 flex items-center justify-center gap-sm hover:bg-surface-variant transition-colors"
              >
                <Icon name="campaign" /> إعلان
              </button>
            </div>

            {/* Questions list */}
            <div className="glass-card rounded-xl p-md">
              <h4 className="font-label-lg text-on-surface-variant mb-md border-b border-outline-variant/30 pb-sm">
                قائمة الأسئلة
              </h4>
              <div className="space-y-sm max-h-64 overflow-y-auto">
                {questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setQuestion(i)}
                    className={`w-full text-right p-sm rounded-lg transition-all flex items-start gap-sm ${
                      i === currentIdx
                        ? 'bg-secondary/20 border border-secondary/40 text-on-surface'
                        : 'bg-surface-container-high/50 hover:bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    <span className={`font-label-lg text-xs mt-1 min-w-[20px] ${i === currentIdx ? 'text-secondary' : 'text-outline'}`}>
                      {i + 1}
                    </span>
                    <span className="font-body-md text-sm leading-relaxed">{q.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Right: Players */}
          <aside className="xl:col-span-4 space-y-lg">
            <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-sm">
              <Icon name="groups" /> المتسابقون
            </h3>

            {Object.entries(players).map(([key, player]) => (
              <PlayerCard
                key={key}
                playerKey={key}
                player={player}
                onAccept={k => judgeAnswer(k, 'accepted')}
                onReject={k => judgeAnswer(k, 'rejected')}
                onAdjust={adjustScore}
              />
            ))}

            {/* Quick score */}
            <div className="glass-card rounded-xl p-md">
              <h4 className="font-label-lg text-on-surface-variant mb-md">تعديل سريع للنقاط</h4>
              <div className="space-y-md">
                {Object.entries(players).map(([key, player]) => (
                  <div key={key}>
                    <p className="font-label-lg text-xs text-on-surface-variant mb-sm">
                      {player.name || (key === 'player1' ? 'لاعب 1' : 'لاعب 2')}
                    </p>
                    <div className="flex gap-xs">
                      {[5, 10, 25].map(pts => (
                        <button
                          key={pts}
                          onClick={() => adjustScore(key, pts)}
                          className="flex-1 py-xs text-xs bg-secondary/10 text-secondary rounded hover:bg-secondary/20 transition-colors font-label-lg"
                        >+{pts}</button>
                      ))}
                      {[5, 10, 25].map(pts => (
                        <button
                          key={`-${pts}`}
                          onClick={() => adjustScore(key, -pts)}
                          className="flex-1 py-xs text-xs bg-error/10 text-error rounded hover:bg-error/20 transition-colors font-label-lg"
                        >-{pts}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <div className="glass-card rounded-xl p-md">
              <h4 className="font-label-lg text-on-surface-variant mb-md border-b border-outline-variant/30 pb-sm">
                الإعلانات
              </h4>
              {announcements.length === 0 ? (
                <p className="text-outline text-sm text-center py-sm">لا توجد إعلانات بعد</p>
              ) : (
                <div className="space-y-md max-h-40 overflow-y-auto">
                  {announcements.map((a, i) => (
                    <div key={i} className="flex gap-sm">
                      <div className="w-1 bg-secondary rounded-full shrink-0" />
                      <p className="text-sm text-on-surface">{a.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-sm px-md lg:hidden bg-surface-container-highest/95 backdrop-blur-md border-t border-primary/20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] rounded-t-xl">
        {[
          { id: 'quiz', icon: 'emoji_events', label: 'الجولة' },
          { id: 'stats', icon: 'leaderboard', label: 'النتائج' },
          { id: 'announce', icon: 'campaign', label: 'إعلان' },
          { id: 'exit', icon: 'logout', label: 'خروج' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'announce') setShowModal(true)
              else if (item.id === 'exit') { setStatus('finished'); logout(); navigate('/') }
              else setActiveNav(item.id)
            }}
            className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 transition-all active:scale-110 duration-150 ${
              activeNav === item.id ? 'bg-primary-container/30 text-primary-fixed-dim border border-primary/30' : 'text-on-surface-variant/70'
            }`}
          >
            <Icon name={item.icon} />
            <span className="font-label-lg text-label-lg">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Announcement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative glass-card rounded-xxl p-xl w-full max-w-md space-y-lg border border-secondary/30">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
              <Icon name="campaign" className="text-secondary" /> نشر إعلان
            </h3>
            <textarea
              className="w-full bg-surface-container-highest/50 border border-outline-variant text-on-surface rounded-xl py-md px-lg font-body-md resize-none outline-none focus:border-secondary transition-colors placeholder:text-on-surface-variant/50"
              placeholder="اكتب الإعلان هنا..."
              rows={3}
              value={announcement}
              onChange={e => setAnnouncement(e.target.value)}
              autoFocus
            />
            <div className="flex gap-md">
              <button onClick={handlePublish} className="flex-1 bg-secondary text-on-secondary font-bold py-md rounded-xl flex items-center justify-center gap-sm hover:brightness-110 transition-all">
                <Icon name="send" /> نشر
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-surface-variant text-on-surface-variant font-bold py-md rounded-xl hover:bg-surface-container transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
