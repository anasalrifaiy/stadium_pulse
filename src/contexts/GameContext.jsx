import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { doc, onSnapshot, updateDoc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { getRandomQuestions, whoamiBank } from '../data/questions'

const GameContext = createContext(null)

const defaultPlayers = {
  player1: { name: '', score: 0, currentAnswer: '', answerStatus: null, isAnswering: false, bid: null, wager: null },
  player2: { name: '', score: 0, currentAnswer: '', answerStatus: null, isAnswering: false, bid: null, wager: null },
}

export function GameProvider({ children }) {
  const [gameId, setGameId]     = useState(() => localStorage.getItem('sp_gameId') || '')
  const [role, setRole]         = useState(() => localStorage.getItem('sp_role') || '')
  const [playerKey, setPlayerKey] = useState(() => localStorage.getItem('sp_playerKey') || '')
  const [gameState, setGameState] = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    if (!gameId) return
    const unsub = onSnapshot(doc(db, 'games', gameId), snap => {
      if (snap.exists()) setGameState({ id: snap.id, ...snap.data() })
      else setGameState(null)
    }, err => console.error('Firestore error:', err))
    return unsub
  }, [gameId])

  // ── Host: create game ──────────────────────────────────────────────────
  const createGame = useCallback(async (password) => {
    setLoading(true); setError('')
    try {
      const id = Math.random().toString(36).substring(2, 8).toUpperCase()
      const questions = getRandomQuestions(12)
      await setDoc(doc(db, 'games', id), {
        hostPassword: password,
        status: 'lobby',
        currentQuestionIndex: 0,
        questions,
        players: defaultPlayers,
        announcements: [],
        currentAnnouncement: '',
        // round state
        roundType: 'speed',       // 'speed' | 'auction' | 'whoami' | 'golden'
        normalBuzzer: null,
        speedBuzzer: null,
        speedBuzzerTimestamp: null,
        auctionWinner: null,
        whoamiClueIndex: 0,
        createdAt: serverTimestamp(),
      })
      localStorage.setItem('sp_gameId', id)
      localStorage.setItem('sp_role', 'host')
      setGameId(id); setRole('host')
      return id
    } catch (e) { setError('فشل إنشاء الغرفة: ' + e.message) }
    finally { setLoading(false) }
  }, [])

  // ── Contestant: join ───────────────────────────────────────────────────
  const joinGame = useCallback(async (code, playerName) => {
    setLoading(true); setError('')
    try {
      const snap = await getDoc(doc(db, 'games', code.toUpperCase()))
      if (!snap.exists()) { setError('رمز الغرفة غير صحيح'); return false }
      const data = snap.data()
      let key = 'player1'
      if (data.players?.player1?.name && data.players.player1.name !== playerName) key = 'player2'
      await updateDoc(doc(db, 'games', code.toUpperCase()), {
        [`players.${key}.name`]: playerName,
        [`players.${key}.score`]: data.players?.[key]?.score || 0,
      })
      localStorage.setItem('sp_gameId', code.toUpperCase())
      localStorage.setItem('sp_role', 'player')
      localStorage.setItem('sp_playerKey', key)
      setGameId(code.toUpperCase()); setRole('player'); setPlayerKey(key)
      return true
    } catch (e) { setError('فشل الانضمام: ' + e.message); return false }
    finally { setLoading(false) }
  }, [])

  // ── Host: login to existing game ───────────────────────────────────────
  const hostLogin = useCallback(async (code, password) => {
    setLoading(true); setError('')
    try {
      const snap = await getDoc(doc(db, 'games', code.toUpperCase()))
      if (!snap.exists()) { setError('رمز الغرفة غير صحيح'); return false }
      if (snap.data().hostPassword !== password) { setError('كلمة المرور غير صحيحة'); return false }
      localStorage.setItem('sp_gameId', code.toUpperCase())
      localStorage.setItem('sp_role', 'host')
      setGameId(code.toUpperCase()); setRole('host')
      return true
    } catch (e) { setError('خطأ: ' + e.message); return false }
    finally { setLoading(false) }
  }, [])

  // ── Game flow ──────────────────────────────────────────────────────────
  const setStatus = useCallback(async (status) => {
    if (!gameId) return
    await updateDoc(doc(db, 'games', gameId), { status })
  }, [gameId])

  const togglePause = useCallback(async () => {
    if (!gameId) return
    await updateDoc(doc(db, 'games', gameId), { paused: !gameState?.paused })
  }, [gameId, gameState])

  const resetAnswerStatus = useCallback(async (pk) => {
    if (!gameId) return
    const updates = {
      [`players.${pk}.answerStatus`]: null,
      [`players.${pk}.currentAnswer`]: '',
    }
    if (gameState?.roundType === 'normal') updates['normalBuzzer'] = pk
    await updateDoc(doc(db, 'games', gameId), updates)
  }, [gameId, gameState])

  const setQuestion = useCallback(async (index) => {
    if (!gameId) return
    const qs = gameState?.questions || []
    const bounded = Math.max(0, Math.min(index, qs.length - 1))
    const q = qs[bounded]
    // Auto-detect round type from question type
    const currentRoundType = gameState?.roundType || 'normal'
    let newRoundType = currentRoundType
    if (q?.type === 'whoami') newRoundType = 'whoami'
    else if (currentRoundType === 'whoami') newRoundType = 'speed' // leaving whoami → reset
    await updateDoc(doc(db, 'games', gameId), {
      currentQuestionIndex: bounded,
      roundType: newRoundType,
      'players.player1.currentAnswer': '',
      'players.player1.answerStatus': null,
      'players.player1.bid': null,
      'players.player1.wager': null,
      'players.player2.currentAnswer': '',
      'players.player2.answerStatus': null,
      'players.player2.bid': null,
      'players.player2.wager': null,
      normalBuzzer: null,
      speedBuzzer: null,
      speedBuzzerTimestamp: null,
      auctionWinner: null,
      whoamiClueIndex: 0,
    })
  }, [gameId, gameState])

  // ── Round type ─────────────────────────────────────────────────────────
  const setRoundType = useCallback(async (type) => {
    if (!gameId) return
    await updateDoc(doc(db, 'games', gameId), {
      roundType: type,
      normalBuzzer: null,
      speedBuzzer: null,
      speedBuzzerTimestamp: null,
      auctionWinner: null,
      whoamiClueIndex: 0,
      'players.player1.currentAnswer': '',
      'players.player1.answerStatus': null,
      'players.player1.bid': null,
      'players.player1.wager': null,
      'players.player2.currentAnswer': '',
      'players.player2.answerStatus': null,
      'players.player2.bid': null,
      'players.player2.wager': null,
    })
  }, [gameId])

  // ── Scoring ────────────────────────────────────────────────────────────
  const judgeAnswer = useCallback(async (pk, verdict) => {
    if (!gameId) return
    const q = gameState?.questions?.[gameState.currentQuestionIndex]
    const pts = q?.points || 10
    const roundType = gameState?.roundType || 'normal'
    const currentScore = gameState?.players?.[pk]?.score || 0

    let scoreChange = 0
    if (verdict === 'accepted') {
      if (roundType === 'speed')   scoreChange = pts * 2
      else if (roundType === 'auction') scoreChange = gameState?.players?.[pk]?.bid || 0
      else if (roundType === 'golden')  scoreChange = gameState?.players?.[pk]?.wager || 0
      else if (roundType === 'whoami') {
        const clueIdx = gameState?.whoamiClueIndex || 0
        scoreChange = Array.isArray(q?.points) ? (q.points[clueIdx] || 10) : pts
      }
      else scoreChange = pts
    } else {
      if (roundType === 'auction') scoreChange = -(gameState?.players?.[pk]?.bid || 0)
      else if (roundType === 'golden')  scoreChange = -(gameState?.players?.[pk]?.wager || 0)
    }

    const updates = {
      [`players.${pk}.answerStatus`]: verdict,
      [`players.${pk}.score`]: Math.max(0, currentScore + scoreChange),
    }

    // Normal round: automatically give the other player a chance after a rejection
    if (verdict === 'rejected' && roundType === 'normal') {
      const otherPk = pk === 'player1' ? 'player2' : 'player1'
      const otherStatus = gameState?.players?.[otherPk]?.answerStatus
      if (!otherStatus) updates['normalBuzzer'] = otherPk
    }

    // Speed round: automatically give the other player a chance after a rejection
    if (verdict === 'rejected' && roundType === 'speed') {
      const otherPk = pk === 'player1' ? 'player2' : 'player1'
      const otherStatus = gameState?.players?.[otherPk]?.answerStatus
      if (!otherStatus) {
        updates['speedBuzzer'] = otherPk
        updates['speedBuzzerTimestamp'] = Date.now()
      } else {
        updates['speedBuzzer'] = null
        updates['speedBuzzerTimestamp'] = null
      }
    }

    await updateDoc(doc(db, 'games', gameId), updates)
  }, [gameId, gameState])

  const adjustScore = useCallback(async (pk, delta) => {
    if (!gameId) return
    const current = gameState?.players?.[pk]?.score || 0
    await updateDoc(doc(db, 'games', gameId), {
      [`players.${pk}.score`]: Math.max(0, current + delta),
    })
  }, [gameId, gameState])

  // ── Normal round buzzer ────────────────────────────────────────────────
  const normalBuzz = useCallback(async () => {
    if (!gameId || !playerKey) return
    if (gameState?.normalBuzzer) return
    await updateDoc(doc(db, 'games', gameId), { normalBuzzer: playerKey })
  }, [gameId, playerKey, gameState])

  // ── Speed round ────────────────────────────────────────────────────────
  const buzz = useCallback(async () => {
    if (!gameId || !playerKey) return
    if (gameState?.speedBuzzer) return          // already buzzed
    await updateDoc(doc(db, 'games', gameId), { speedBuzzer: playerKey, speedBuzzerTimestamp: Date.now() })
  }, [gameId, playerKey, gameState])

  const clearBuzzer = useCallback(async () => {
    if (!gameId) return
    await updateDoc(doc(db, 'games', gameId), {
      speedBuzzer: null,
      speedBuzzerTimestamp: null,
      'players.player1.currentAnswer': '',
      'players.player1.answerStatus': null,
      'players.player2.currentAnswer': '',
      'players.player2.answerStatus': null,
    })
  }, [gameId])

  const forfeitBuzz = useCallback(async (pk) => {
    if (!gameId) return
    if (gameState?.players?.[pk]?.answerStatus === 'timeout') return
    const otherPk = pk === 'player1' ? 'player2' : 'player1'
    const otherStatus = gameState?.players?.[otherPk]?.answerStatus
    const updates = { [`players.${pk}.answerStatus`]: 'timeout' }
    if (!otherStatus) {
      updates['speedBuzzer'] = otherPk
      updates['speedBuzzerTimestamp'] = Date.now()
    } else {
      updates['speedBuzzer'] = null
      updates['speedBuzzerTimestamp'] = null
    }
    await updateDoc(doc(db, 'games', gameId), updates)
  }, [gameId, gameState])

  // ── Auction ────────────────────────────────────────────────────────────
  const submitBid = useCallback(async (amount) => {
    if (!gameId || !playerKey) return
    await updateDoc(doc(db, 'games', gameId), { [`players.${playerKey}.bid`]: Number(amount) })
  }, [gameId, playerKey])

  const setAuctionWinner = useCallback(async (pk) => {
    if (!gameId) return
    await updateDoc(doc(db, 'games', gameId), { auctionWinner: pk })
  }, [gameId])

  // ── Who am I ───────────────────────────────────────────────────────────
  const showNextClue = useCallback(async () => {
    if (!gameId) return
    const current = gameState?.whoamiClueIndex || 0
    const q = gameState?.questions?.[gameState?.currentQuestionIndex]
    const maxClues = q?.clues?.length || 4
    if (current < maxClues - 1)
      await updateDoc(doc(db, 'games', gameId), { whoamiClueIndex: current + 1 })
  }, [gameId, gameState])

  // ── Golden question ────────────────────────────────────────────────────
  const submitWager = useCallback(async (amount) => {
    if (!gameId || !playerKey) return
    const max = gameState?.players?.[playerKey]?.score || 0
    await updateDoc(doc(db, 'games', gameId), {
      [`players.${playerKey}.wager`]: Math.min(Number(amount), max),
    })
  }, [gameId, playerKey, gameState])

  // ── Contestant: submit answer ──────────────────────────────────────────
  const submitAnswer = useCallback(async (answer) => {
    if (!gameId || !playerKey) return
    await updateDoc(doc(db, 'games', gameId), {
      [`players.${playerKey}.currentAnswer`]: answer,
      [`players.${playerKey}.answerStatus`]: 'pending',
      [`players.${playerKey}.isAnswering`]: false,
    })
  }, [gameId, playerKey])

  const setAnswering = useCallback(async (val) => {
    if (!gameId || !playerKey) return
    await updateDoc(doc(db, 'games', gameId), { [`players.${playerKey}.isAnswering`]: val })
  }, [gameId, playerKey])

  // ── Announcements ──────────────────────────────────────────────────────
  const publishAnnouncement = useCallback(async (text) => {
    if (!gameId) return
    const current = gameState?.announcements || []
    await updateDoc(doc(db, 'games', gameId), {
      announcements: [{ text, ts: Date.now() }, ...current].slice(0, 15),
      currentAnnouncement: text,
    })
  }, [gameId, gameState])

  const removeAnnouncement = useCallback(async (index) => {
    if (!gameId) return
    const updated = [...(gameState?.announcements || [])]
    updated.splice(index, 1)
    await updateDoc(doc(db, 'games', gameId), {
      announcements: updated,
      currentAnnouncement: updated[0]?.text || '',
    })
  }, [gameId, gameState])

  // ── Question management ────────────────────────────────────────────────
  const addQuestion = useCallback(async (q) => {
    if (!gameId) return
    const qs = [...(gameState?.questions || []), { ...q, id: `custom_${Date.now()}` }]
    await updateDoc(doc(db, 'games', gameId), { questions: qs })
  }, [gameId, gameState])

  const removeQuestion = useCallback(async (index) => {
    if (!gameId) return
    const qs = [...(gameState?.questions || [])]
    qs.splice(index, 1)
    await updateDoc(doc(db, 'games', gameId), { questions: qs })
  }, [gameId, gameState])

  const loadFromBank = useCallback(async (bankQuestions) => {
    if (!gameId) return
    await updateDoc(doc(db, 'games', gameId), { questions: bankQuestions, currentQuestionIndex: 0 })
  }, [gameId])

  const addWhoamiQuestion = useCallback(async (wq) => {
    if (!gameId) return
    const qs = [...(gameState?.questions || []), wq]
    await updateDoc(doc(db, 'games', gameId), { questions: qs })
  }, [gameId, gameState])

  // ── Host: kick a player ────────────────────────────────────────────────
  const kickPlayer = useCallback(async (pk) => {
    if (!gameId) return
    await updateDoc(doc(db, 'games', gameId), {
      [`players.${pk}.name`]: '',
      [`players.${pk}.score`]: 0,
      [`players.${pk}.currentAnswer`]: '',
      [`players.${pk}.answerStatus`]: null,
      [`players.${pk}.isAnswering`]: false,
      [`players.${pk}.bid`]: null,
      [`players.${pk}.wager`]: null,
      [`players.${pk}.kicked`]: true,
    })
  }, [gameId])

  // ── Host: reset room to lobby (keep questions) ─────────────────────────
  const resetRoom = useCallback(async () => {
    if (!gameId) return
    await updateDoc(doc(db, 'games', gameId), {
      status: 'lobby',
      currentQuestionIndex: 0,
      players: defaultPlayers,
      announcements: [],
      currentAnnouncement: '',
      roundType: 'speed',
      normalBuzzer: null,
      speedBuzzer: null,
      speedBuzzerTimestamp: null,
      auctionWinner: null,
      whoamiClueIndex: 0,
    })
  }, [gameId])

  // ── Staff: login ───────────────────────────────────────────────────────
  const staffLogin = useCallback(async (code, password) => {
    setLoading(true); setError('')
    try {
      const snap = await getDoc(doc(db, 'games', code.toUpperCase()))
      if (!snap.exists()) { setError('رمز الغرفة غير صحيح'); return false }
      if (snap.data().staffPassword !== password) { setError('كلمة مرور فريق العمل غير صحيحة'); return false }
      localStorage.setItem('sp_gameId', code.toUpperCase())
      localStorage.setItem('sp_role', 'staff')
      setGameId(code.toUpperCase()); setRole('staff')
      return true
    } catch (e) { setError('خطأ: ' + e.message); return false }
    finally { setLoading(false) }
  }, [])

  // ── Host: set staff password ───────────────────────────────────────────
  const setStaffPassword = useCallback(async (password) => {
    if (!gameId) return
    await updateDoc(doc(db, 'games', gameId), { staffPassword: password })
  }, [gameId])

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('sp_gameId')
    localStorage.removeItem('sp_role')
    localStorage.removeItem('sp_playerKey')
    setGameId(''); setRole(''); setPlayerKey(''); setGameState(null)
  }, [])

  return (
    <GameContext.Provider value={{
      gameId, role, playerKey, gameState, loading, error,
      createGame, joinGame, hostLogin,
      setStatus, setQuestion, setRoundType,
      judgeAnswer, adjustScore,
      normalBuzz,
      buzz, clearBuzzer, forfeitBuzz,
      submitBid, setAuctionWinner,
      showNextClue,
      submitWager,
      submitAnswer, setAnswering,
      publishAnnouncement, removeAnnouncement,
      addQuestion, removeQuestion, loadFromBank, addWhoamiQuestion,
      togglePause, resetAnswerStatus,
      kickPlayer, resetRoom,
      staffLogin, setStaffPassword,
      logout,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be inside GameProvider')
  return ctx
}
