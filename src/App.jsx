import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import mantraUrl from './assets/audio/mantra.ogg'

const BEAD_COUNT = 9
const SKINS = [
  { id: 'glass', label: 'Glass' },
  { id: 'wood', label: 'Wood' },
  { id: 'stone', label: 'Stone' },
  { id: 'metal', label: 'Metal' },
  { id: 'light', label: 'Light' },
]
const PRESETS = [9, 27, 54, 108]

/** Fallback chime if the bundled ogg can't be decoded (e.g. older Safari). */
function playChime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const now = ctx.currentTime
    ;[440, 660, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.25 / (i + 1), now + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 2.6)
    })
  } catch {
    /* audio unavailable — nothing to do */
  }
}

export default function App() {
  const [beadIndex, setBeadIndex] = useState(0)
  const [rounds, setRounds] = useState(0)
  const [reverse, setReverse] = useState(false)
  const [target, setTarget] = useState(108)
  const [skin, setSkin] = useState(() => localStorage.getItem('mala.skin') || 'glass')
  const [skinOpen, setSkinOpen] = useState(false)
  const [done, setDone] = useState(false)
  const audioRef = useRef(null)
  // mirror of the counters: taps fired faster than React re-renders must never be dropped
  const countRef = useRef({ bead: 0, rounds: 0, done: false })

  useEffect(() => {
    localStorage.setItem('mala.skin', skin)
  }, [skin])

  const remaining = Math.max(0, target - rounds)

  const positions = useMemo(
    () =>
      Array.from({ length: BEAD_COUNT }, (_, i) => {
        const angle = (i / BEAD_COUNT) * Math.PI * 2 - Math.PI / 2
        return { x: 50 + Math.cos(angle) * 38, y: 50 + Math.sin(angle) * 38 }
      }),
    []
  )

  const celebrate = useCallback(() => {
    setDone(true)
    const el = audioRef.current
    if (!el) return playChime()
    el.currentTime = 0
    const p = el.play()
    if (p && p.catch) p.catch(playChime)
  }, [])

  /** Any tap on the screen advances, except on the controls (marked .no-count). */
  const advance = useCallback(
    (e) => {
      if (e.target.closest('.no-count')) return
      if (navigator.vibrate) navigator.vibrate(8)
      const c = countRef.current
      c.bead = (c.bead + 1) % BEAD_COUNT
      setBeadIndex(c.bead)
      if (c.bead !== 0) return
      c.rounds += 1
      setRounds(c.rounds)
      if (reverse && c.rounds >= target && !c.done) {
        c.done = true
        celebrate()
      }
    },
    [reverse, target, celebrate]
  )

  const reset = () => {
    countRef.current = { bead: 0, rounds: 0, done: false }
    setBeadIndex(0)
    setRounds(0)
    setDone(false)
    const el = audioRef.current
    if (el) {
      el.pause()
      el.currentTime = 0
    }
  }

  /** re-arm the completion chime after a mode/target change */
  const clearDone = () => {
    countRef.current.done = false
    setDone(false)
  }

  const changeTarget = (value) => {
    const n = Math.max(1, Math.min(9999, Math.round(Number(value) || 0)))
    setTarget(n)
    clearDone()
  }

  return (
    <div className="app" onClick={advance}>
      <header className="topbar no-count">
        <div className="modes glass">
          <button
            className={!reverse ? 'mode on' : 'mode'}
            onClick={() => {
              setReverse(false)
              clearDone()
            }}
          >
            Count up
          </button>
          <button
            className={reverse ? 'mode on' : 'mode'}
            onClick={() => {
              setReverse(true)
              clearDone()
            }}
          >
            Countdown
          </button>
        </div>
      </header>

      <section className="readout">
        <div className={done ? 'bignum complete' : 'bignum'}>{reverse ? remaining : rounds}</div>
        <div className="label">
          {done ? 'mala complete' : reverse ? `rounds left of ${target}` : 'rounds completed'}
        </div>
      </section>

      {reverse && (
        <div className="targetbar glass no-count">
          {PRESETS.map((p) => (
            <button
              key={p}
              className={p === target ? 'chip on' : 'chip'}
              onClick={() => changeTarget(p)}
            >
              {p}
            </button>
          ))}
          <input
            className="chip input"
            type="number"
            inputMode="numeric"
            min="1"
            max="9999"
            value={target}
            onChange={(e) => changeTarget(e.target.value)}
            aria-label="Target rounds"
          />
        </div>
      )}

      <main className="ringwrap">
        <div className={`ring skin-${skin}`}>
          <div className="ring-glow" />
          {positions.map((pos, i) => (
            <div
              key={i}
              className={`bead${i === beadIndex ? ' active' : ''}${i < beadIndex ? ' passed' : ''}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            />
          ))}
          <div className="hub glass">
            <span className="hub-num">{beadIndex + 1}</span>
            <span className="hub-den">/ {BEAD_COUNT}</span>
          </div>
        </div>
      </main>

      <footer className="controls no-count">
        <button className="ctrl glass" onClick={reset}>
          Reset
        </button>
        <button className="ctrl glass" onClick={() => setSkinOpen(true)}>
          Beads: {SKINS.find((s) => s.id === skin)?.label}
        </button>
      </footer>

      {skinOpen && (
        <div className="sheet-backdrop no-count" onClick={() => setSkinOpen(false)}>
          <div className="sheet glass" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-title">Bead skin</div>
            <div className="sheet-grid">
              {SKINS.map((s) => (
                <button
                  key={s.id}
                  className={`swatch skin-${s.id}${s.id === skin ? ' on' : ''}`}
                  onClick={() => {
                    setSkin(s.id)
                    setSkinOpen(false)
                  }}
                >
                  <span className="swatch-bead" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} src={mantraUrl} preload="auto" />
    </div>
  )
}
