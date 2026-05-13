import { useNavigate } from 'react-router-dom'
import { useGame } from '../contexts/GameContext'

function Icon({ name, className = '', style }) {
  return <span className={`material-symbols-outlined ${className}`} style={style}>{name}</span>
}

const ROUND_LABELS = {
  normal:  'جولة عادية',
  speed:   'جولة السرعة ⚡',
  auction: 'جولة المزاد 💰',
  whoami:  'من أنا؟ 🎭',
  golden:  'السؤال الذهبي ⭐',
}

export default function StaffView() {
  const navigate = useNavigate()
  const { gameId, gameState, judgeAnswer, logout } = useGame()

  if (!gameState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center gap-lg">
        <Icon name="sync" className="text-primary animate-spin" style={{ fontSize: '48px', animationDuration: '2s' }} />
        <p className="text-on-surface-variant font-label-lg">جاري الاتصال...</p>
      </div>
    )
  }

  const questions = gameState.questions || []
  const currentIdx = gameState.currentQuestionIndex || 0
  const currentQ = questions[currentIdx]
  const players = gameState.players || {}
  const p1 = players.player1 || {}
  const p2 = players.player2 || {}
  const roundType = gameState.roundType || 'normal'
  const whoamiClueIndex = gameState.whoamiClueIndex || 0

  function PlayerAnswerCard({ pk, player, accentClass, borderClass }) {
    const hasPending = player.answerStatus === 'pending'
    const isJudged = player.answerStatus === 'accepted' || player.answerStatus === 'rejected'
    return (
      <div className={`glass-card rounded-xl p-lg space-y-md border-2 ${borderClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <Icon name="person" className={accentClass} />
            <span className={`font-headline-sm text-headline-sm ${accentClass}`}>{player.name || '—'}</span>
          </div>
          <span className={`font-bold text-xl ${accentClass}`}>{player.score || 0} نقطة</span>
        </div>

        {/* Round-specific info */}
        {roundType === 'speed' && gameState.speedBuzzer === pk && (
          <div className="flex items-center gap-xs bg-error/10 text-error px-md py-xs rounded-full font-label-lg w-fit">
            <Icon name="bolt" style={{ fontVariationSettings: "'FILL' 1" }} />
            ضغط البزر
          </div>
        )}
        {roundType === 'auction' && player.bid != null && (
          <div className="bg-surface-container-high px-md py-xs rounded-lg font-label-lg text-on-surface-variant">
            العرض: <span className={`font-bold ${accentClass}`}>{player.bid}</span> نقطة
          </div>
        )}
        {roundType === 'golden' && player.wager != null && (
          <div className="bg-surface-container-high px-md py-xs rounded-lg font-label-lg text-on-surface-variant">
            الرهان: <span className={`font-bold ${accentClass}`}>{player.wager}</span> نقطة
          </div>
        )}

        {/* Answer */}
        {player.currentAnswer ? (
          <div className="bg-surface-container-high rounded-xl p-md">
            <p className="text-on-surface-variant font-label-lg text-xs mb-xs">الإجابة</p>
            <p className="font-headline-sm text-headline-sm text-on-surface">{player.currentAnswer}</p>
          </div>
        ) : (
          <p className="text-on-surface-variant font-body-md text-sm italic">
            {gameState.status !== 'active' ? '—' : 'في انتظار الإجابة...'}
          </p>
        )}

        {/* Status badge */}
        {isJudged && (
          <div className={`flex items-center gap-xs px-md py-xs rounded-full font-label-lg w-fit border ${
            player.answerStatus === 'accepted'
              ? 'bg-secondary/10 text-secondary border-secondary/30'
              : 'bg-error/10 text-error border-error/30'
          }`}>
            <Icon name={player.answerStatus === 'accepted' ? 'check_circle' : 'cancel'} style={{ fontVariationSettings: "'FILL' 1" }} />
            {player.answerStatus === 'accepted' ? 'صحيحة' : 'خاطئة'}
          </div>
        )}

        {/* Judge buttons — only if pending */}
        {hasPending && (
          <div className="flex gap-md">
            <button
              onClick={() => judgeAnswer(pk, 'accepted')}
              className="flex-1 bg-secondary/10 border border-secondary/40 text-secondary font-bold py-md rounded-xl hover:bg-secondary hover:text-on-secondary transition-all flex items-center justify-center gap-sm"
            >
              <Icon name="check_circle" style={{ fontVariationSettings: "'FILL' 1" }} />
              قبول
            </button>
            <button
              onClick={() => judgeAnswer(pk, 'rejected')}
              className="flex-1 bg-error/10 border border-error/40 text-error font-bold py-md rounded-xl hover:bg-error hover:text-on-error transition-all flex items-center justify-center gap-sm"
            >
              <Icon name="cancel" style={{ fontVariationSettings: "'FILL' 1" }} />
              رفض
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      <div className="fixed inset-0 pitch-lines pointer-events-none opacity-20" />

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-gutter py-md bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-xl">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-lg bg-tertiary-container flex items-center justify-center">
            <Icon name="groups" className="text-on-tertiary-container text-sm" />
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm text-on-surface">فريق العمل</h1>
            <p className="text-on-surface-variant font-label-lg text-xs">الغرفة: {gameId}</p>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <span className={`px-md py-xs rounded-full font-label-lg text-xs border ${
            gameState.status === 'active' ? 'bg-secondary/10 text-secondary border-secondary/30 animate-pulse'
            : gameState.status === 'lobby' ? 'bg-surface-container-high text-on-surface-variant border-outline-variant'
            : 'bg-error/10 text-error border-error/30'
          }`}>
            {gameState.status === 'active' ? '● مباشر' : gameState.status === 'lobby' ? 'انتظار' : 'انتهت'}
          </span>
          <button onClick={() => { logout(); navigate('/') }} className="text-error font-label-lg hover:underline text-sm">
            خروج
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-gutter py-xl space-y-xl">

        {/* Current question + answer */}
        <div className="glass-card rounded-xxl p-xl space-y-lg border border-primary/20">
          <div className="flex items-center justify-between mb-xs">
            <span className="font-label-lg text-on-surface-variant">السؤال {currentIdx + 1} / {questions.length}</span>
            <span className="bg-primary/10 text-primary border border-primary/20 px-md py-xs rounded-full font-label-lg text-xs">
              {ROUND_LABELS[roundType] || 'جولة عادية'}
            </span>
          </div>

          {/* Question text */}
          <div>
            <p className="text-on-surface-variant font-label-lg text-xs mb-xs">السؤال</p>
            <h2 className="font-headline-md text-headline-md text-on-surface leading-snug">
              {roundType === 'whoami'
                ? `من أنا؟ — التلميح ${whoamiClueIndex + 1}`
                : currentQ?.text || '—'}
            </h2>
          </div>

          {/* Who Am I clues */}
          {roundType === 'whoami' && (currentQ?.clues || []).length > 0 && (
            <div className="space-y-sm">
              {(currentQ.clues || []).map((clue, i) => (
                <div key={i} className={`flex items-start gap-sm p-sm rounded-lg ${i <= whoamiClueIndex ? 'bg-secondary/5 border border-secondary/20' : 'bg-surface-container-high opacity-40'}`}>
                  <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${i <= whoamiClueIndex ? 'bg-secondary text-on-secondary' : 'bg-surface-container-highest text-on-surface-variant'}`}>{i + 1}</span>
                  <p className="text-on-surface font-body-md text-sm">{clue}</p>
                </div>
              ))}
            </div>
          )}

          {/* Correct answer — visible to staff */}
          {currentQ?.answer && (
            <div className="bg-secondary/10 border-2 border-secondary/40 rounded-xl p-md">
              <div className="flex items-center gap-sm mb-xs">
                <Icon name="key" className="text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }} />
                <p className="font-label-lg text-secondary text-xs uppercase tracking-widest">الإجابة الصحيحة (فريق العمل فقط)</p>
              </div>
              <p className="font-headline-md text-headline-md text-secondary">{currentQ.answer}</p>
            </div>
          )}

          {currentQ?.points && (
            <p className="text-on-surface-variant font-label-lg text-xs">
              النقاط: {Array.isArray(currentQ.points) ? currentQ.points.join(' / ') : currentQ.points}
            </p>
          )}
        </div>

        {/* Player cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <PlayerAnswerCard pk="player1" player={p1} accentClass="text-primary" borderClass="border-primary/20" />
          <PlayerAnswerCard pk="player2" player={p2} accentClass="text-tertiary" borderClass="border-tertiary/20" />
        </div>

        {/* Speed buzzer info */}
        {roundType === 'speed' && gameState.speedBuzzer && (
          <div className="glass-card rounded-xl p-md flex items-center gap-md border border-error/30 bg-error/5">
            <Icon name="bolt" className="text-error text-display-lg" style={{ fontVariationSettings: "'FILL' 1" }} />
            <div>
              <p className="font-headline-sm text-error">ضغط البزر</p>
              <p className="text-on-surface-variant font-body-md">
                {gameState.speedBuzzer === 'player1' ? p1.name : p2.name}
              </p>
            </div>
          </div>
        )}

        {/* Auction winner info */}
        {roundType === 'auction' && gameState.auctionWinner && (
          <div className="glass-card rounded-xl p-md flex items-center gap-md border border-secondary/30 bg-secondary/5">
            <Icon name="gavel" className="text-secondary text-display-lg" />
            <div>
              <p className="font-headline-sm text-secondary">فاز بالمزاد</p>
              <p className="text-on-surface-variant font-body-md">
                {gameState.auctionWinner === 'player1' ? p1.name : p2.name}
              </p>
            </div>
          </div>
        )}

        {/* Announcement feed */}
        {(gameState.announcements || []).length > 0 && (
          <div className="glass-card rounded-xl p-lg space-y-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface border-b border-outline-variant/30 pb-xs mb-sm">الإعلانات</h3>
            {(gameState.announcements || []).slice(0, 5).map((a, i) => (
              <div key={i} className="flex items-start gap-sm text-sm">
                <Icon name="info" className="text-secondary text-sm shrink-0 mt-0.5" />
                <p className="text-on-surface-variant">{a.text}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
