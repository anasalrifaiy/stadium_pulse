import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [gameId, setGameId] = useState(() => localStorage.getItem('sp_gameId') || '')
  const [role, setRole] = useState(() => localStorage.getItem('sp_role') || '') // 'host' | 'player'
  const [playerKey, setPlayerKey] = useState(() => localStorage.getItem('sp_playerKey') || '') // 'player1' | 'player2'
  const [gameState, setGameState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Listen to real-time game state
  useEffect(() => {
    if (!gameId) return
    const unsub = onSnapshot(doc(db, 'games', gameId), (snap) => {
      if (snap.exists()) setGameState({ id: snap.id, ...snap.data() })
      else setGameState(null)
    })
    return unsub
  }, [gameId])

  // Host: create new game
  const createGame = useCallback(async (password) => {
    setLoading(true)
    setError('')
    try {
      const id = Math.random().toString(36).substring(2, 8).toUpperCase()
      const defaultQuestions = [
        { text: 'من هو الهداف التاريخي لبطولة دوري أبطال أوروبا؟', answer: 'كريستيانو رونالدو', points: 10 },
        { text: 'من هو اللاعب الذي سجل أسرع هاتريك في تاريخ الدوري الإنجليزي الممتاز؟', answer: 'ساديو ماني', points: 10 },
        { text: 'في أي عام فازت البرازيل بأول كأس عالم لها؟', answer: '1958', points: 10 },
        { text: 'من هو المدرب الذي قاد ألمانيا لكأس العالم 2014؟', answer: 'يواكيم لوف', points: 10 },
        { text: 'كم عدد الأهداف التي سجلها ميسي في موسم 2011-2012 مع برشلونة؟', answer: '73 هدفاً', points: 20 },
      ]
      await setDoc(doc(db, 'games', id), {
        hostPassword: password,
        status: 'lobby',
        currentQuestionIndex: 0,
        questions: defaultQuestions,
        players: {
          player1: { name: '', score: 0, currentAnswer: '', answerStatus: null, isAnswering: false },
          player2: { name: '', score: 0, currentAnswer: '', answerStatus: null, isAnswering: false },
        },
        announcements: [],
        timer: 60,
        timerRunning: false,
        roundName: 'الجولة الأولى',
        createdAt: serverTimestamp(),
      })
      localStorage.setItem('sp_gameId', id)
      localStorage.setItem('sp_role', 'host')
      setGameId(id)
      setRole('host')
      return id
    } catch (e) {
      setError('فشل إنشاء الغرفة: ' + e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Contestant: join game
  const joinGame = useCallback(async (code, playerName) => {
    setLoading(true)
    setError('')
    try {
      const snap = await getDoc(doc(db, 'games', code.toUpperCase()))
      if (!snap.exists()) { setError('رمز الغرفة غير صحيح'); setLoading(false); return false }
      const data = snap.data()
      // Assign to player1 or player2
      let key = 'player1'
      if (data.players?.player1?.name && data.players.player1.name !== playerName) key = 'player2'
      await updateDoc(doc(db, 'games', code.toUpperCase()), {
        [`players.${key}.name`]: playerName,
        [`players.${key}.score`]: data.players?.[key]?.score || 0,
      })
      localStorage.setItem('sp_gameId', code.toUpperCase())
      localStorage.setItem('sp_role', 'player')
      localStorage.setItem('sp_playerKey', key)
      setGameId(code.toUpperCase())
      setRole('player')
      setPlayerKey(key)
      return true
    } catch (e) {
      setError('فشل الانضمام: ' + e.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Host: verify password and enter dashboard
  const hostLogin = useCallback(async (code, password) => {
    setLoading(true)
    setError('')
    try {
      const snap = await getDoc(doc(db, 'games', code.toUpperCase()))
      if (!snap.exists()) { setError('رمز الغرفة غير صحيح'); setLoading(false); return false }
      if (snap.data().hostPassword !== password) { setError('كلمة المرور غير صحيحة'); setLoading(false); return false }
      localStorage.setItem('sp_gameId', code.toUpperCase())
      localStorage.setItem('sp_role', 'host')
      setGameId(code.toUpperCase())
      setRole('host')
      return true
    } catch (e) {
      setError('خطأ: ' + e.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Host: navigate to next/prev question
  const setQuestion = useCallback(async (index) => {
    if (!gameId) return
    const questions = gameState?.questions || []
    const bounded = Math.max(0, Math.min(index, questions.length - 1))
    await updateDoc(doc(db, 'games', gameId), {
      currentQuestionIndex: bounded,
      'players.player1.currentAnswer': '',
      'players.player1.answerStatus': null,
      'players.player2.currentAnswer': '',
      'players.player2.answerStatus': null,
    })
  }, [gameId, gameState])

  // Host: accept or reject answer
  const judgeAnswer = useCallback(async (playerKey, verdict) => {
    if (!gameId) return
    const q = gameState?.questions?.[gameState.currentQuestionIndex]
    const pts = verdict === 'accepted' ? (q?.points || 10) : 0
    const currentScore = gameState?.players?.[playerKey]?.score || 0
    await updateDoc(doc(db, 'games', gameId), {
      [`players.${playerKey}.answerStatus`]: verdict,
      [`players.${playerKey}.score`]: verdict === 'accepted' ? currentScore + pts : currentScore,
    })
  }, [gameId, gameState])

  // Host: manually adjust score
  const adjustScore = useCallback(async (playerKey, delta) => {
    if (!gameId) return
    const current = gameState?.players?.[playerKey]?.score || 0
    await updateDoc(doc(db, 'games', gameId), {
      [`players.${playerKey}.score`]: Math.max(0, current + delta),
    })
  }, [gameId, gameState])

  // Host: publish announcement
  const publishAnnouncement = useCallback(async (text) => {
    if (!gameId) return
    const current = gameState?.announcements || []
    await updateDoc(doc(db, 'games', gameId), {
      announcements: [{ text, ts: Date.now() }, ...current].slice(0, 10),
      currentAnnouncement: text,
    })
  }, [gameId, gameState])

  // Host: start/stop game
  const setStatus = useCallback(async (status) => {
    if (!gameId) return
    await updateDoc(doc(db, 'games', gameId), { status })
  }, [gameId])

  // Contestant: submit text answer
  const submitAnswer = useCallback(async (answer) => {
    if (!gameId || !playerKey) return
    await updateDoc(doc(db, 'games', gameId), {
      [`players.${playerKey}.currentAnswer`]: answer,
      [`players.${playerKey}.answerStatus`]: 'pending',
      [`players.${playerKey}.isAnswering`]: false,
    })
  }, [gameId, playerKey])

  // Contestant: set answering state (voice)
  const setAnswering = useCallback(async (val) => {
    if (!gameId || !playerKey) return
    await updateDoc(doc(db, 'games', gameId), {
      [`players.${playerKey}.isAnswering`]: val,
    })
  }, [gameId, playerKey])

  const logout = useCallback(() => {
    localStorage.removeItem('sp_gameId')
    localStorage.removeItem('sp_role')
    localStorage.removeItem('sp_playerKey')
    setGameId('')
    setRole('')
    setPlayerKey('')
    setGameState(null)
  }, [])

  return (
    <GameContext.Provider value={{
      gameId, role, playerKey, gameState, loading, error,
      createGame, joinGame, hostLogin,
      setQuestion, judgeAnswer, adjustScore,
      publishAnnouncement, setStatus,
      submitAnswer, setAnswering,
      logout,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
