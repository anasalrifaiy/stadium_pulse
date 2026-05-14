import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../contexts/GameContext'
import { questionBank, whoamiBank, categories, getRandomQuestions } from '../data/questions'

function Icon({ name, className = '', style }) {
  return <span className={`material-symbols-outlined ${className}`} style={style}>{name}</span>
}

const ROUND_TYPES = [
  { id: 'speed',   label: 'سرعة',       icon: 'bolt',         color: 'secondary', desc: 'أول من يضغط الجرس ويجيب صح يأخذ النقاط — وإلا تنتقل الفرصة للمنافس (30 ثانية)' },
  { id: 'auction', label: 'مزاد',       icon: 'gavel',        color: 'tertiary',  desc: 'المتسابقون يراهنون بنقاطهم — الأعلى مزايدة يجيب' },
  { id: 'whoami',  label: 'من أنا؟',    icon: 'help',         color: 'primary',   desc: 'تلميحات تكشف هوية شخصية — كلما بكّرت ربحت أكثر' },
  { id: 'golden',  label: 'ذهبي',       icon: 'emoji_events', color: 'secondary', desc: 'سؤال فاصل — أول من يجيب صح يفوز بالرهان' },
]

// ── Lobby ──────────────────────────────────────────────────────────────────
function LobbyScreen({ gameId, gameState, onStart, onLogout }) {
  const players = gameState?.players || {}
  return (
    <div className="min-h-screen bg-background stadium-pattern flex flex-col items-center justify-center p-gutter">
      <div className="fixed inset-0 pitch-lines pointer-events-none opacity-30" />
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg space-y-xl">
        <div className="text-center">
          <div className="flex items-center justify-center gap-sm mb-sm">
            <Icon name="sports_soccer" className="text-primary text-headline-lg" />
            <h1 className="font-headline-lg text-headline-lg font-extrabold text-primary italic uppercase tracking-tighter">Stadium Pulse</h1>
          </div>
          <p className="text-on-surface-variant font-label-lg">لوحة تحكم المقدم</p>
        </div>

        <div className="glass-card rounded-xxl p-xl text-center space-y-sm border border-secondary/30">
          <p className="text-on-surface-variant font-label-lg">رمز الغرفة — شاركه مع المتسابقين</p>
          <div className="flex items-center justify-center gap-md">
            <span className="font-display-lg text-display-lg text-secondary tracking-[0.3em]">{gameId}</span>
            <button onClick={() => navigator.clipboard?.writeText(gameId)} className="p-sm bg-surface-variant rounded-lg hover:bg-surface-container transition-colors" title="نسخ">
              <Icon name="content_copy" className="text-on-surface-variant text-sm" />
            </button>
          </div>
          <p className="text-xs text-outline font-label-lg">
            الرابط: <span className="text-primary">{window.location.origin}{window.location.pathname}</span>
          </p>
        </div>

        <div className="glass-card rounded-xl p-lg space-y-md">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm"><Icon name="groups" className="text-primary" /> المتسابقون</h3>
          <div className="grid grid-cols-2 gap-md">
            {[
              { key: 'player1', color: 'secondary' },
              { key: 'player2', color: 'tertiary' },
            ].map(({ key, color }) => {
              const p = players[key] || {}
              return (
                <div key={key} className={`p-md rounded-xl border ${p.name ? `border-${color}/40 bg-${color}/10` : 'border-outline-variant/30 bg-surface-container-high/50'}`}>
                  <div className="flex items-center gap-sm">
                    <Icon name={p.name ? 'person' : 'person_off'} className={`text-sm ${p.name ? `text-${color}` : 'text-outline'}`} />
                    <div>
                      <p className={`font-label-lg text-sm ${p.name ? 'text-on-surface' : 'text-outline'}`}>{p.name || (key === 'player1' ? 'المتسابق الأول' : 'المتسابق الثاني')}</p>
                      <p className={`text-xs font-label-lg ${p.name ? 'text-secondary' : 'text-outline'}`}>{p.name ? '✓ انضم' : 'في الانتظار...'}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-center gap-xl flex-wrap">
          <a href={`#/broadcast?game=${gameId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-sm text-secondary font-label-lg hover:text-secondary-fixed transition-colors">
            <Icon name="live_tv" className="text-sm" /> شاشة البث
          </a>
        </div>

        <button onClick={onStart} className="w-full h-20 bg-secondary text-on-secondary rounded-xxl font-headline-lg flex items-center justify-center gap-md neon-border-green hover:brightness-105 active:scale-[0.98] transition-all shadow-2xl">
          <Icon name="play_circle" className="text-3xl" /> بدء المسابقة
        </button>
        <button onClick={onLogout} className="w-full py-sm text-error font-label-lg hover:underline">خروج</button>
      </div>
    </div>
  )
}

// ── Player Card ────────────────────────────────────────────────────────────
function PlayerCard({ playerKey, player, roundType, gameState, onAccept, onReject, onReset, onAdjust, onSetAuctionWinner, onKick }) {
  const isP1 = playerKey === 'player1'
  const border = isP1 ? 'border-secondary' : 'border-tertiary'
  const text   = isP1 ? 'text-secondary'   : 'text-tertiary'
  const bg     = isP1 ? 'bg-primary-container text-on-primary-container' : 'bg-tertiary-container text-on-tertiary-container'
  const score  = player.score || 0
  const isBuzzer = gameState?.speedBuzzer === playerKey
  const isAuctionWinner = gameState?.auctionWinner === playerKey

  return (
    <div className={`glass-card rounded-xl p-md border-r-4 ${border} ${isBuzzer ? 'ring-2 ring-secondary' : ''} ${isAuctionWinner ? 'ring-2 ring-tertiary' : ''}`}>
      <div className="flex items-center gap-md mb-md">
        <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center border-2 border-outline-variant/30">
          <Icon name="person" className={`text-headline-md ${text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-headline-sm text-headline-sm text-on-surface truncate">
            {player.name || (isP1 ? 'المتسابق الأول' : 'المتسابق الثاني')}
          </h4>
          <p className={`${text} font-label-lg`}>{score} نقطة</p>
        </div>
        <div className="flex flex-col gap-xs">
          <button onClick={() => onAdjust(playerKey, 10)} className={`w-8 h-8 flex items-center justify-center ${bg} rounded-lg hover:opacity-80 active:scale-90 transition-colors`}>
            <Icon name="add" className="text-sm" />
          </button>
          <button onClick={() => onAdjust(playerKey, -10)} className="w-8 h-8 flex items-center justify-center bg-surface-variant text-on-surface-variant rounded-lg hover:bg-error/30 active:scale-90 transition-colors">
            <Icon name="remove" className="text-sm" />
          </button>
          {onKick && player.name && (
            <button onClick={() => { if (window.confirm(`طرد ${player.name}؟`)) onKick(playerKey) }} className="w-8 h-8 flex items-center justify-center bg-error/10 text-error rounded-lg hover:bg-error/30 active:scale-90 transition-colors" title="طرد المتسابق">
              <Icon name="person_remove" className="text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* Speed: buzzer badge */}
      {roundType === 'speed' && isBuzzer && (
        <div className="mb-md bg-secondary/20 text-secondary rounded-lg px-sm py-xs font-label-lg flex items-center gap-xs">
          <Icon name="bolt" className="text-sm" /> ضغط أولاً!
        </div>
      )}

      {/* Auction: bid display + set winner */}
      {roundType === 'auction' && (
        <div className="mb-md">
          <p className="text-on-surface-variant font-label-lg text-xs mb-xs">المزايدة:</p>
          <p className={`font-headline-md text-headline-md ${player.bid !== null ? text : 'text-outline'}`}>
            {player.bid !== null ? `${player.bid} نقطة` : 'لم يزايد بعد'}
          </p>
          {player.bid !== null && !gameState?.auctionWinner && (
            <button onClick={() => onSetAuctionWinner(playerKey)} className="mt-sm w-full py-xs bg-tertiary/20 text-tertiary rounded-lg font-label-lg text-sm hover:bg-tertiary/30 transition-colors">
              منح حق الإجابة
            </button>
          )}
          {isAuctionWinner && (
            <div className="mt-sm bg-tertiary/20 text-tertiary rounded-lg px-sm py-xs font-label-lg text-xs flex items-center gap-xs">
              <Icon name="gavel" className="text-sm" /> يجيب هذا المتسابق
            </div>
          )}
        </div>
      )}

      {/* Golden: wager */}
      {roundType === 'golden' && (
        <div className="mb-md">
          <p className="text-on-surface-variant font-label-lg text-xs mb-xs">الرهان:</p>
          <p className={`font-headline-md text-headline-md ${player.wager !== null ? 'text-secondary' : 'text-outline'}`}>
            {player.wager !== null ? `${player.wager} نقطة` : 'لم يضع رهاناً بعد'}
          </p>
        </div>
      )}

      {/* Answer */}
      {player.currentAnswer ? (
        <div className="mb-md p-sm bg-surface-container-high rounded-lg border border-outline-variant/20">
          <p className="text-on-surface-variant font-label-lg text-xs mb-xs">إجابة المتسابق:</p>
          <p className="font-headline-sm text-on-surface mb-sm">{player.currentAnswer}</p>
          {(player.answerStatus === null || player.answerStatus === 'pending') ? (
            <div className="flex gap-sm">
              <button onClick={() => onAccept(playerKey)} className="flex-1 py-sm bg-secondary text-on-secondary rounded-lg font-label-lg flex items-center justify-center gap-xs hover:brightness-105 active:scale-95 transition-all">
                <Icon name="check" className="text-sm" /> قبول
              </button>
              <button onClick={() => onReject(playerKey)} className="flex-1 py-sm bg-error-container text-on-error-container rounded-lg font-label-lg flex items-center justify-center gap-xs active:scale-95 transition-all">
                <Icon name="close" className="text-sm" /> رفض
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-sm flex-wrap">
              <div className={`flex items-center gap-xs px-sm py-xs rounded-full w-fit font-label-lg text-xs ${player.answerStatus === 'accepted' ? 'bg-secondary/20 text-secondary' : 'bg-error/20 text-error'}`}>
                <Icon name={player.answerStatus === 'accepted' ? 'check_circle' : 'cancel'} className="text-sm" />
                {player.answerStatus === 'accepted' ? 'تمت الموافقة' : 'تم الرفض'}
              </div>
              <button
                onClick={() => onReset(playerKey)}
                className="flex items-center gap-xs px-sm py-xs rounded-full font-label-lg text-xs bg-surface-variant text-on-surface-variant hover:bg-error/20 hover:text-error transition-colors"
                title="تراجع عن الحكم"
              >
                <Icon name="undo" className="text-sm" /> تراجع
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-outline font-label-lg text-xs mb-md">
          {player.isAnswering ? <span className="text-tertiary flex items-center gap-xs animate-pulse"><Icon name="mic" className="text-sm" /> يسجل صوتياً...</span> : 'لم يرسل إجابة بعد'}
        </p>
      )}

      <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-700 ${isP1 ? 'bg-secondary' : 'bg-tertiary'}`} style={{ width: `${Math.min(100, (score / 300) * 100)}%` }} />
      </div>
    </div>
  )
}

// ── Question Bank Tab ──────────────────────────────────────────────────────
function QuestionBankTab({ gameState, onLoad, onAdd, onRemove }) {
  const [selectedCat, setSelectedCat] = useState('الكل')
  const [tab, setTab] = useState('bank')      // 'bank' | 'game' | 'add'
  const [newQ, setNewQ] = useState({ text: '', answer: '', points: 10, type: 'speed', category: 'عام' })
  const allCats = ['الكل', ...categories]

  const gameQuestions = gameState?.questions || []
  const gameIds = new Set(gameQuestions.map(q => q.id).filter(Boolean))
  const bankFiltered = (selectedCat === 'الكل' ? questionBank : questionBank.filter(q => q.category === selectedCat))

  function handleAddCustom(e) {
    e.preventDefault()
    if (!newQ.text || !newQ.answer) return
    onAdd(newQ)
    setNewQ({ text: '', answer: '', points: 10, type: 'normal', category: 'عام' })
  }

  return (
    <div className="space-y-lg">
      {/* Sub-tabs */}
      <div className="flex gap-sm bg-surface-container rounded-xl p-xs">
        {[{ id: 'bank', label: 'البنك' }, { id: 'game', label: 'أسئلة الغرفة' }, { id: 'add', label: 'إضافة سؤال' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 py-sm rounded-lg font-label-lg transition-colors ${tab === t.id ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant hover:bg-surface-variant'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Bank ── */}
      {tab === 'bank' && (
        <div className="space-y-md">
          <div className="flex gap-sm flex-wrap">
            {allCats.map(c => (
              <button key={c} onClick={() => setSelectedCat(c)} className={`px-md py-xs rounded-full font-label-lg text-xs transition-colors ${selectedCat === c ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant hover:bg-surface-container'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="max-h-96 overflow-y-auto space-y-sm">
            {bankFiltered.map(q => {
              const alreadyAdded = gameIds.has(q.id)
              return (
                <div key={q.id} className={`flex items-start gap-sm p-sm rounded-lg ${alreadyAdded ? 'bg-surface-container opacity-50' : 'bg-surface-container-high'}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-on-surface text-sm leading-relaxed">{q.text}</p>
                    <p className="text-secondary font-label-lg text-xs mt-xs">{q.answer} — {q.points} نقطة</p>
                    <div className="flex gap-xs mt-xs flex-wrap">
                      <span className="bg-surface-variant text-on-surface-variant text-[10px] px-sm rounded-full">{q.category}</span>
                      <span className={`text-[10px] px-sm rounded-full ${q.type === 'speed' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>{q.type === 'speed' ? 'سرعة' : 'عادي'}</span>
                      {alreadyAdded && <span className="text-[10px] px-sm rounded-full bg-outline/20 text-outline">✓ مضاف</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => !alreadyAdded && onAdd(q)}
                    disabled={alreadyAdded}
                    className={`shrink-0 p-xs rounded-lg transition-colors ${alreadyAdded ? 'text-outline cursor-not-allowed' : 'bg-secondary/20 text-secondary hover:bg-secondary/30'}`}
                    title={alreadyAdded ? 'مضاف بالفعل' : 'أضف للغرفة'}
                  >
                    <Icon name={alreadyAdded ? 'check' : 'add'} className="text-sm" />
                  </button>
                </div>
              )
            })}
          </div>
          <button
            onClick={() => onLoad(getRandomQuestions(12, [...gameIds]))}
            className="w-full py-md bg-primary-container text-on-primary-container rounded-xl font-bold hover:bg-primary hover:text-on-primary transition-colors"
          >
            تحميل 12 سؤالاً عشوائياً (بدون تكرار)
          </button>
          <button
            onClick={() => onLoad(whoamiBank.filter(q => !gameIds.has(q.id)))}
            className="w-full py-md bg-tertiary-container text-on-tertiary-container rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            تحميل أسئلة "من أنا؟" فقط (بدون تكرار)
          </button>
        </div>
      )}

      {/* ── Game questions ── */}
      {tab === 'game' && (
        <div className="max-h-96 overflow-y-auto space-y-sm">
          {gameQuestions.length === 0 ? (
            <p className="text-outline text-center py-xl font-body-md">لا توجد أسئلة — أضف من البنك</p>
          ) : (
            gameQuestions.map((q, i) => (
              <div key={i} className="flex items-start gap-sm p-sm bg-surface-container-high rounded-lg">
                <span className="text-outline font-label-lg text-xs min-w-[24px] mt-1">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-on-surface text-sm">{q.text}</p>
                  <p className="text-secondary text-xs font-label-lg">{q.answer}</p>
                </div>
                <button onClick={() => onRemove(i)} className="shrink-0 p-xs bg-error/20 text-error rounded-lg hover:bg-error/30" title="حذف">
                  <Icon name="delete" className="text-sm" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Add custom ── */}
      {tab === 'add' && (
        <form onSubmit={handleAddCustom} className="space-y-md">
          <div>
            <label className="font-label-lg text-on-surface-variant text-xs block mb-xs">السؤال</label>
            <textarea value={newQ.text} onChange={e => setNewQ(p => ({ ...p, text: e.target.value }))} rows={2} required className="w-full bg-surface-container-highest/50 border border-outline-variant text-on-surface rounded-xl py-md px-lg font-body-md resize-none outline-none focus:border-secondary transition-colors placeholder:text-on-surface-variant/50" placeholder="اكتب السؤال هنا..." />
          </div>
          <div>
            <label className="font-label-lg text-on-surface-variant text-xs block mb-xs">الإجابة الصحيحة</label>
            <input value={newQ.answer} onChange={e => setNewQ(p => ({ ...p, answer: e.target.value }))} required className="w-full bg-surface-container-highest/50 border border-outline-variant text-on-surface rounded-xl py-md px-lg font-body-md outline-none focus:border-secondary transition-colors placeholder:text-on-surface-variant/50" placeholder="الإجابة..." />
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="font-label-lg text-on-surface-variant text-xs block mb-xs">النقاط</label>
              <input type="number" min={5} max={100} step={5} value={newQ.points} onChange={e => setNewQ(p => ({ ...p, points: Number(e.target.value) }))} className="w-full bg-surface-container-highest/50 border border-outline-variant text-on-surface rounded-xl py-md px-lg font-body-md outline-none focus:border-secondary transition-colors" />
            </div>
            <div>
              <label className="font-label-lg text-on-surface-variant text-xs block mb-xs">نوع الفقرة</label>
              <select value={newQ.type} onChange={e => setNewQ(p => ({ ...p, type: e.target.value }))} className="w-full bg-surface-container-highest/50 border border-outline-variant text-on-surface rounded-xl py-md px-lg font-body-md outline-none focus:border-secondary transition-colors">
                <option value="speed">سرعة</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full py-md bg-secondary text-on-secondary font-bold rounded-xl flex items-center justify-center gap-sm hover:brightness-110 transition-all">
            <Icon name="add" /> إضافة السؤال
          </button>
        </form>
      )}
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function HostDashboard() {
  const navigate = useNavigate()
  const {
    gameId, gameState,
    setQuestion, setStatus, setRoundType,
    judgeAnswer, adjustScore,
    clearBuzzer, setAuctionWinner,
    showNextClue,
    togglePause, resetAnswerStatus,
    publishAnnouncement, removeAnnouncement,
    addQuestion, removeQuestion, loadFromBank,
    kickPlayer, resetRoom, setStaffPassword,
    logout,
  } = useGame()

  const [announcement, setAnnouncement] = useState('')
  const [showModal, setShowModal]       = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [activeTab, setActiveTab]       = useState('quiz')  // 'quiz' | 'questions' | 'players'
  const [elapsed, setElapsed]           = useState(0)
  const [speedTimer, setSpeedTimer]     = useState(null)
  const [staffPwdInput, setStaffPwdInput] = useState('')
  const [staffPwdSaved, setStaffPwdSaved] = useState(false)

  useEffect(() => { if (!gameId) navigate('/') }, [gameId, navigate])
  useEffect(() => { const iv = setInterval(() => setElapsed(s => s + 1), 1000); return () => clearInterval(iv) }, [])

  // Speed round countdown — synced with Firestore timestamp
  useEffect(() => {
    if (gameState?.roundType !== 'speed' || !gameState?.speedBuzzer || !gameState?.speedBuzzerTimestamp) { setSpeedTimer(null); return }
    const tick = () => setSpeedTimer(Math.max(0, Math.ceil((gameState.speedBuzzerTimestamp + 30000 - Date.now()) / 1000)))
    tick()
    const iv = setInterval(tick, 250)
    return () => clearInterval(iv)
  }, [gameState?.speedBuzzer, gameState?.roundType, gameState?.speedBuzzerTimestamp])

  if (!gameState) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-lg">
        <Icon name="sync" className="text-display-lg text-primary animate-spin" style={{ animationDuration: '2s' }} />
        <p className="text-on-surface-variant font-label-lg">جاري الاتصال...</p>
        <p className="text-outline text-xs font-label-lg">{gameId}</p>
        <button onClick={() => { logout(); navigate('/') }} className="text-error font-label-lg hover:underline mt-md">خروج</button>
      </div>
    )
  }

  if (gameState.status === 'lobby') {
    return <LobbyScreen gameId={gameId} gameState={gameState} onStart={async () => { await setStatus('active'); await setQuestion(0) }} onLogout={() => { logout(); navigate('/') }} />
  }

  const questions   = gameState.questions || []
  const currentIdx  = gameState.currentQuestionIndex || 0
  const currentQ    = questions[currentIdx]
  const players     = gameState.players || {}
  const roundType   = gameState.roundType || 'normal'
  const hasPending  = Object.values(players).some(p => p.answerStatus === 'pending')
  const isPaused    = gameState.paused || false
  const announcements = gameState.announcements || []
  const currentRound = ROUND_TYPES.find(r => r.id === roundType) || ROUND_TYPES[0]

  const formatTime = s => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  async function handlePublish() {
    if (!announcement.trim()) return
    await publishAnnouncement(announcement)
    setAnnouncement('')
    setShowModal(false)
  }

  // Who am I clues
  const clues = currentQ?.clues || []
  const clueIdx = gameState.whoamiClueIndex || 0
  const visibleClues = clues.slice(0, clueIdx + 1)

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen stadium-pattern">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col p-md space-y-sm bg-surface-container-low/90 backdrop-blur-lg h-screen w-64 fixed right-0 top-0 border-l border-outline-variant/20 shadow-2xl z-50 overflow-y-auto">
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
          {[{ id: 'quiz', icon: 'sports_soccer', label: 'الجولة الحالية' }, { id: 'questions', icon: 'library_books', label: 'الأسئلة' }, { id: 'players', icon: 'groups', label: 'المتسابقون' }].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-md px-md py-md rounded-lg font-bold cursor-pointer transition-all duration-300 ${activeTab === item.id ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-variant/50 hover:translate-x-[-4px]'}`}>
              <Icon name={item.icon} /><span className="font-body-md text-body-md">{item.label}</span>
            </button>
          ))}
        </nav>
        {/* Staff password */}
        <div className="px-md pb-sm space-y-xs">
          <p className="text-on-surface-variant font-label-lg text-xs">كلمة مرور فريق العمل</p>
          <div className="flex gap-xs">
            <input
              type="text"
              value={staffPwdInput}
              onChange={e => { setStaffPwdInput(e.target.value); setStaffPwdSaved(false) }}
              placeholder="اضبط كلمة مرور..."
              className="flex-1 bg-surface-container-highest/50 border border-outline-variant text-on-surface rounded-lg py-xs px-sm font-label-lg text-xs outline-none focus:border-secondary"
            />
            <button
              onClick={async () => { await setStaffPassword(staffPwdInput); setStaffPwdSaved(true) }}
              disabled={!staffPwdInput}
              className="px-sm py-xs bg-secondary/20 text-secondary rounded-lg font-label-lg text-xs hover:bg-secondary/30 disabled:opacity-40 transition-colors"
            >
              {staffPwdSaved ? '✓' : 'حفظ'}
            </button>
          </div>
          {gameState?.staffPassword && (
            <p className="text-secondary font-label-lg text-[10px]">● مفعّلة — الرابط: <span className="text-primary">#/staff</span></p>
          )}
        </div>

        <div className="space-y-sm pb-md px-0">
          <a href={`#/broadcast?game=${gameId}`} target="_blank" rel="noopener noreferrer" className="w-full py-md bg-secondary-container text-on-secondary-container rounded-xl font-bold flex items-center justify-center gap-sm hover:opacity-90 transition-opacity">
            <Icon name="live_tv" /> شاشة البث
          </a>
          <button onClick={() => setShowResetModal(true)} className="w-full py-md bg-surface-variant text-on-surface-variant rounded-xl font-bold flex items-center justify-center gap-sm hover:bg-error/20 hover:text-error transition-all">
            <Icon name="restart_alt" /> إعادة تعيين الغرفة
          </button>
          <button onClick={async () => { await setStatus('finished'); logout(); navigate('/') }} className="w-full py-md bg-error-container text-on-error-container rounded-xl font-bold flex items-center justify-center gap-sm hover:opacity-90 transition-opacity">
            <Icon name="cancel" /> إنهاء المسابقة
          </button>
        </div>
      </aside>

      {/* Top Bar */}
      <header className="flex justify-between items-center px-gutter py-md w-full sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-xl lg:pr-72">
        <div className="flex items-center gap-md">
          <Icon name="sports_soccer" className="text-primary" />
          <span className="font-headline-lg text-headline-lg font-extrabold text-primary italic uppercase tracking-tighter hidden sm:block">Stadium Pulse</span>
        </div>
        <div className="flex items-center gap-md">
          {/* Current round type badge */}
          <div className={`hidden sm:flex items-center gap-xs px-md py-xs rounded-full bg-surface-container border border-${currentRound.color}/30`}>
            <Icon name={currentRound.icon} className={`text-${currentRound.color} text-sm`} />
            <span className={`font-label-lg text-xs text-${currentRound.color}`}>{currentRound.label}</span>
          </div>
          <div className="flex items-center gap-sm bg-surface-container-highest px-md py-sm rounded-full border border-primary/20 neon-border-blue">
            <Icon name="timer" className="text-primary" />
            <span className="font-headline-sm text-headline-sm text-primary tracking-widest">{formatTime(elapsed)}</span>
          </div>
          {isPaused ? (
            <div className="flex items-center gap-xs bg-secondary/20 px-sm py-xs rounded-full">
              <span className="w-2 h-2 bg-secondary rounded-full" />
              <span className="text-secondary font-label-lg text-xs">متوقف</span>
            </div>
          ) : (
            <div className="flex items-center gap-xs bg-error/20 px-sm py-xs rounded-full animate-pulse">
              <span className="w-2 h-2 bg-error rounded-full" />
              <span className="text-error font-label-lg text-xs">مباشر</span>
            </div>
          )}
          <button
            onClick={togglePause}
            className={`px-md py-xs rounded-full font-label-lg text-sm border transition-all ${isPaused ? 'bg-secondary text-on-secondary border-secondary' : 'bg-surface-container border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary'}`}
          >
            <Icon name={isPaused ? 'play_arrow' : 'pause'} className="text-sm align-middle" />
            {' '}{isPaused ? 'استئناف' : 'إيقاف مؤقت'}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="lg:pr-64 p-gutter max-w-container-max mx-auto pb-24 lg:pb-gutter">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-lg">

          {/* ── Left column ── */}
          <section className="xl:col-span-8 space-y-lg">

            {/* Mobile tab nav */}
            <div className="flex gap-sm lg:hidden bg-surface-container rounded-xl p-xs">
              {[{ id: 'quiz', label: 'الجولة' }, { id: 'questions', label: 'الأسئلة' }, { id: 'players', label: 'اللاعبون' }].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex-1 py-sm rounded-lg font-label-lg text-sm transition-colors ${activeTab === t.id ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant'}`}>{t.label}</button>
              ))}
            </div>

            {/* ── Quiz Tab ── */}
            {activeTab === 'quiz' && (
              <div className="space-y-lg">
                {/* Round type selector */}
                <div className="glass-card rounded-xl p-md">
                  <h4 className="font-label-lg text-on-surface-variant mb-md">نوع الفقرة</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-sm">
                    {ROUND_TYPES.map(r => (
                      <button key={r.id} onClick={() => setRoundType(r.id)} title={r.desc}
                        className={`flex flex-col items-center gap-xs p-sm rounded-xl font-label-lg text-xs transition-all ${roundType === r.id ? `bg-${r.color}/20 border border-${r.color}/50 text-${r.color}` : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'}`}>
                        <Icon name={r.icon} className="text-sm" />
                        {r.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-outline text-xs font-label-lg mt-sm">{currentRound.desc}</p>
                </div>

                {/* Current Question */}
                <div className="glass-card rounded-xxl p-xl relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                  <div className="flex items-center justify-between mb-md">
                    <h3 className="text-on-surface-variant font-label-lg">السؤال الحالي</h3>
                    <span className="bg-primary/20 text-primary-fixed border border-primary/30 px-md py-xs rounded-lg font-label-lg">{currentIdx + 1} / {questions.length}</span>
                  </div>
                  <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-xl leading-tight">
                    {roundType === 'whoami' ? 'من أنا؟' : (currentQ?.text || 'لا يوجد سؤال')}
                  </h1>

                  {/* Who am I: clues */}
                  {roundType === 'whoami' && clues.length > 0 && (
                    <div className="space-y-sm mb-xl">
                      {visibleClues.map((clue, i) => (
                        <div key={i} className="flex items-start gap-sm p-sm bg-surface-container-high rounded-lg border border-outline-variant/20">
                          <span className="text-secondary font-label-lg text-xs min-w-[20px]">#{i + 1}</span>
                          <p className="text-on-surface font-body-md">{clue}</p>
                          <span className="text-outline font-label-lg text-xs shrink-0">
                            {Array.isArray(currentQ?.points) ? currentQ.points[i] : currentQ?.points} نقطة
                          </span>
                        </div>
                      ))}
                      {clueIdx < clues.length - 1 && (
                        <button onClick={showNextClue} className="w-full py-sm bg-surface-variant text-on-surface-variant rounded-lg font-label-lg hover:bg-surface-container transition-colors flex items-center justify-center gap-sm">
                          <Icon name="visibility" className="text-sm" /> كشف التلميح التالي ({clues.length - 1 - clueIdx} متبقٍ)
                        </button>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="bg-surface-container-high p-md rounded-xl border border-outline-variant/30">
                      <p className="text-on-surface-variant font-label-lg mb-xs">الإجابة الصحيحة</p>
                      <p className="font-headline-md text-headline-md text-secondary">{currentQ?.answer || '—'}</p>
                    </div>
                    <div className="bg-surface-container-high p-md rounded-xl border border-outline-variant/30">
                      <p className="text-on-surface-variant font-label-lg mb-xs">النقاط</p>
                      <p className="font-headline-md text-headline-md text-tertiary">
                        {roundType === 'speed' ? `${(currentQ?.points || 10) * 2} (مضاعفة)` : roundType === 'whoami' && Array.isArray(currentQ?.points) ? currentQ.points.join(' / ') : (currentQ?.points || 10)} نقطة
                      </p>
                    </div>
                  </div>
                </div>

                {/* Speed round: buzzer status */}
                {roundType === 'speed' && (
                  <div className={`glass-card rounded-xl p-md ${gameState.speedBuzzer ? 'border border-secondary/50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-label-lg text-on-surface-variant mb-xs">حالة السرعة</h4>
                        {gameState.speedBuzzer ? (
                          <p className="text-secondary font-headline-sm text-headline-sm flex items-center gap-sm">
                            <Icon name="bolt" /> {players[gameState.speedBuzzer]?.name || gameState.speedBuzzer} ضغط أولاً!
                            {speedTimer !== null && <span className="text-error font-label-lg">({speedTimer}ث)</span>}
                          </p>
                        ) : (
                          <p className="text-outline font-body-md">في انتظار من يضغط أولاً...</p>
                        )}
                      </div>
                      {gameState.speedBuzzer && (
                        <button onClick={clearBuzzer} className="py-sm px-md bg-surface-variant text-on-surface-variant rounded-lg font-label-lg hover:bg-error/20 hover:text-error transition-colors">
                          إعادة ضبط
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Auction: bids summary */}
                {roundType === 'auction' && (
                  <div className="glass-card rounded-xl p-md">
                    <h4 className="font-label-lg text-on-surface-variant mb-md flex items-center gap-sm"><Icon name="gavel" className="text-sm" /> مزايدات المتسابقين</h4>
                    <div className="grid grid-cols-2 gap-md">
                      {Object.entries(players).map(([key, p]) => (
                        <div key={key} className="bg-surface-container-high p-sm rounded-lg text-center">
                          <p className="text-on-surface-variant font-label-lg text-xs">{p.name || key}</p>
                          <p className={`font-headline-md text-headline-md ${p.bid !== null ? 'text-secondary' : 'text-outline'}`}>{p.bid !== null ? `${p.bid} نقطة` : '—'}</p>
                        </div>
                      ))}
                    </div>
                    {!gameState.auctionWinner && Object.values(players).every(p => p.bid !== null) && (
                      <p className="text-center text-secondary font-label-lg text-sm mt-md animate-pulse">الجميع زايد — اختر من يجيب من البطاقات أدناه</p>
                    )}
                  </div>
                )}

                {/* Accept / Reject — per player with name and answer shown */}
                {hasPending ? (
                  <div className="space-y-sm">
                    {Object.entries(players)
                      .filter(([, p]) => p.answerStatus === 'pending')
                      .map(([key, p]) => (
                        <div key={key} className={`glass-card rounded-xl p-md border-2 ${key === 'player1' ? 'border-secondary/40' : 'border-tertiary/40'}`}>
                          <div className="flex items-center gap-sm mb-md">
                            <Icon name="person" className={key === 'player1' ? 'text-secondary' : 'text-tertiary'} />
                            <span className={`font-headline-sm text-headline-sm ${key === 'player1' ? 'text-secondary' : 'text-tertiary'}`}>
                              {p.name || (key === 'player1' ? 'المتسابق الأول' : 'المتسابق الثاني')}
                            </span>
                            <span className="text-on-surface-variant font-label-lg text-xs">أجاب:</span>
                            <span className="font-bold text-on-surface">{p.currentAnswer}</span>
                          </div>
                          <div className="flex gap-sm">
                            <button
                              onClick={() => judgeAnswer(key, 'accepted')}
                              className="flex-1 h-16 bg-secondary text-on-secondary rounded-xl font-headline-md flex items-center justify-center gap-sm neon-border-green hover:brightness-105 active:scale-95 transition-all"
                            >
                              <Icon name="check_circle" className="text-2xl" /> قبول
                            </button>
                            <button
                              onClick={() => judgeAnswer(key, 'rejected')}
                              className="flex-1 h-16 bg-error-container text-on-error-container rounded-xl font-headline-md border border-error/50 flex items-center justify-center gap-sm hover:brightness-105 active:scale-95 transition-all"
                            >
                              <Icon name="cancel" className="text-2xl" /> رفض
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-outline font-label-lg text-center text-sm py-sm">في انتظار إجابة من المتسابقين...</p>
                )}

                {/* Navigation */}
                <div className="flex gap-md">
                  <button onClick={() => setQuestion(currentIdx - 1)} disabled={currentIdx === 0} className="flex-1 bg-surface-container-highest text-on-surface py-md rounded-xl font-label-lg border border-outline/30 flex items-center justify-center gap-sm hover:bg-surface-variant transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    <Icon name="skip_previous" /> السابق
                  </button>
                  <button onClick={() => setQuestion(currentIdx + 1)} disabled={currentIdx >= questions.length - 1} className="flex-1 bg-surface-container-highest text-on-surface py-md rounded-xl font-label-lg border border-outline/30 flex items-center justify-center gap-sm hover:bg-surface-variant transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    <Icon name="skip_next" /> التالي
                  </button>
                  <button onClick={() => setShowModal(true)} className="flex-1 bg-surface-container-highest text-on-surface py-md rounded-xl font-label-lg border border-outline/30 flex items-center justify-center gap-sm hover:bg-surface-variant transition-colors">
                    <Icon name="campaign" /> إعلان
                  </button>
                </div>

                {/* Questions list */}
                <div className="glass-card rounded-xl p-md">
                  <h4 className="font-label-lg text-on-surface-variant mb-md border-b border-outline-variant/30 pb-sm">قائمة الأسئلة</h4>
                  <div className="space-y-xs max-h-52 overflow-y-auto">
                    {questions.map((q, i) => (
                      <button key={i} onClick={() => setQuestion(i)} className={`w-full text-right p-sm rounded-lg transition-all flex items-start gap-sm ${i === currentIdx ? 'bg-secondary/20 border border-secondary/40' : 'bg-surface-container-high/50 hover:bg-surface-container-high text-on-surface-variant'}`}>
                        <span className={`font-label-lg text-xs min-w-[20px] mt-1 ${i === currentIdx ? 'text-secondary' : 'text-outline'}`}>{i + 1}</span>
                        <span className="font-body-md text-sm leading-relaxed flex-1">{q.type === 'whoami' ? '🔍 من أنا؟ — ' : ''}{q.text?.substring(0, 50)}{q.text?.length > 50 ? '...' : ''}</span>
                        {q.type === 'speed' && <span className="text-secondary text-[10px] font-label-lg shrink-0">⚡</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Questions Tab ── */}
            {activeTab === 'questions' && (
              <div className="glass-card rounded-xl p-lg">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg flex items-center gap-sm">
                  <Icon name="library_books" className="text-primary" /> إدارة الأسئلة
                </h3>
                <QuestionBankTab gameState={gameState} onLoad={loadFromBank} onAdd={addQuestion} onRemove={removeQuestion} />
              </div>
            )}

            {/* ── Players Tab (mobile) ── */}
            {activeTab === 'players' && (
              <div className="space-y-lg">
                {Object.entries(players).map(([key, player]) => (
                  <PlayerCard key={key} playerKey={key} player={player} roundType={roundType} gameState={gameState}
                    onAccept={k => judgeAnswer(k, 'accepted')} onReject={k => judgeAnswer(k, 'rejected')} onReset={resetAnswerStatus}
                    onAdjust={adjustScore} onSetAuctionWinner={setAuctionWinner} onKick={kickPlayer} />
                ))}
              </div>
            )}
          </section>

          {/* ── Right sidebar (desktop) ── */}
          <aside className="hidden xl:block xl:col-span-4 space-y-lg">
            <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-sm"><Icon name="groups" /> المتسابقون</h3>
            {Object.entries(players).map(([key, player]) => (
              <PlayerCard key={key} playerKey={key} player={player} roundType={roundType} gameState={gameState}
                onAccept={k => judgeAnswer(k, 'accepted')} onReject={k => judgeAnswer(k, 'rejected')} onReset={resetAnswerStatus}
                onAdjust={adjustScore} onSetAuctionWinner={setAuctionWinner} onKick={kickPlayer} />
            ))}

            {/* Quick score */}
            <div className="glass-card rounded-xl p-md">
              <h4 className="font-label-lg text-on-surface-variant mb-md">تعديل سريع</h4>
              <div className="space-y-md">
                {Object.entries(players).map(([key, player]) => (
                  <div key={key}>
                    <p className="font-label-lg text-xs text-on-surface-variant mb-sm">{player.name || (key === 'player1' ? 'لاعب 1' : 'لاعب 2')}</p>
                    <div className="flex gap-xs flex-wrap">
                      {[5, 10, 25, 50].map(pts => (
                        <button key={pts} onClick={() => adjustScore(key, pts)} className="flex-1 py-xs text-xs bg-secondary/10 text-secondary rounded hover:bg-secondary/20 transition-colors font-label-lg">+{pts}</button>
                      ))}
                      {[5, 10, 25].map(pts => (
                        <button key={`-${pts}`} onClick={() => adjustScore(key, -pts)} className="flex-1 py-xs text-xs bg-error/10 text-error rounded hover:bg-error/20 transition-colors font-label-lg">-{pts}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <div className="glass-card rounded-xl p-md">
              <h4 className="font-label-lg text-on-surface-variant mb-md border-b border-outline-variant/30 pb-sm">الإعلانات</h4>
              {announcements.length === 0 ? <p className="text-outline text-sm text-center py-sm">لا توجد إعلانات</p> : (
                <div className="space-y-sm max-h-40 overflow-y-auto">
                  {announcements.map((a, i) => (
                    <div key={i} className="flex items-start gap-sm p-xs rounded-lg hover:bg-surface-variant/30 group transition-colors">
                      <div className="w-1 bg-secondary rounded-full shrink-0 mt-1.5 self-stretch" />
                      <p className="text-sm text-on-surface flex-1 leading-relaxed">{a.text}</p>
                      <button
                        onClick={() => removeAnnouncement(i)}
                        className="shrink-0 p-xs rounded text-error/40 hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-all"
                        title="مسح الإعلان"
                      >
                        <Icon name="delete" className="text-sm" />
                      </button>
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
        {[{ id: 'quiz', icon: 'emoji_events', label: 'الجولة' }, { id: 'questions', icon: 'library_books', label: 'الأسئلة' }, { id: 'players', icon: 'groups', label: 'اللاعبون' }, { id: 'announce', icon: 'campaign', label: 'إعلان' }].map(item => (
          <button key={item.id} onClick={() => item.id === 'announce' ? setShowModal(true) : setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 transition-all active:scale-110 ${activeTab === item.id ? 'bg-primary-container/30 text-primary-fixed-dim border border-primary/30' : 'text-on-surface-variant/70'}`}>
            <Icon name={item.icon} /><span className="font-label-lg text-label-lg">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Reset Room Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowResetModal(false)} />
          <div className="relative glass-card rounded-xxl p-xl w-full max-w-sm space-y-lg border border-error/30">
            <div className="text-center space-y-sm">
              <Icon name="restart_alt" className="text-error text-display-lg block mx-auto" />
              <h3 className="font-headline-md text-headline-md text-on-surface">إعادة تعيين الغرفة</h3>
              <p className="text-on-surface-variant font-body-md text-sm">سيتم مسح نقاط المتسابقين والعودة إلى صفحة الانتظار. رمز الغرفة يبقى كما هو.</p>
            </div>
            <div className="flex gap-md">
              <button
                onClick={async () => { await resetRoom(); setShowResetModal(false) }}
                className="flex-1 bg-error text-on-error font-bold py-md rounded-xl flex items-center justify-center gap-sm hover:opacity-90"
              >
                <Icon name="restart_alt" /> تأكيد الإعادة
              </button>
              <button onClick={() => setShowResetModal(false)} className="flex-1 bg-surface-variant text-on-surface-variant font-bold py-md rounded-xl hover:bg-surface-container transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative glass-card rounded-xxl p-xl w-full max-w-md space-y-lg border border-secondary/30">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm"><Icon name="campaign" className="text-secondary" /> نشر إعلان</h3>
            <textarea className="w-full bg-surface-container-highest/50 border border-outline-variant text-on-surface rounded-xl py-md px-lg font-body-md resize-none outline-none focus:border-secondary transition-colors placeholder:text-on-surface-variant/50"
              placeholder="اكتب الإعلان هنا..." rows={3} value={announcement} onChange={e => setAnnouncement(e.target.value)} autoFocus />
            <div className="flex gap-md">
              <button onClick={handlePublish} className="flex-1 bg-secondary text-on-secondary font-bold py-md rounded-xl flex items-center justify-center gap-sm hover:brightness-110 transition-all"><Icon name="send" /> نشر</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-surface-variant text-on-surface-variant font-bold py-md rounded-xl hover:bg-surface-container transition-colors">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
