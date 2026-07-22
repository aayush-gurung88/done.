import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const API_URL = 'http://127.0.0.1:8000'
const today = new Date()

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

function Calendar() {
  const auth = useAuth()
  const userInitial = auth.user?.email?.charAt(0).toUpperCase() || 'U'
  const navigate = useNavigate()

  const handleLogout = () => {
    auth.signOut()
    navigate('/login')
  }

const [currentYear, setCurrentYear] = useState(today.getFullYear())
const [currentMonth, setCurrentMonth] = useState(today.getMonth())
const [selectedDay, setSelectedDay] = useState(null)
const [entries, setEntries] = useState({})
const [streak, setStreak] = useState(0)

const [panelOpen, setPanelOpen] = useState(false)
const [panelContent, setPanelContent] = useState('')
const [saved, setSaved] = useState(false)

const [quote, setQuote] = useState('')
const [quoteAuthor, setQuoteAuthor] = useState('')
const [time, setTime] = useState(new Date())

const editor = useEditor({
  extensions: [StarterKit],
  content: '',
  editable: true,
  onUpdate: ({ editor }) => {
    setPanelContent(editor.getHTML())
    setSaved(false)
  },
})

// useState(new Date()) — stores the current time in React state
// setInterval(() => setTime(new Date()), 1000) — every 1000 milliseconds (1 second) it updates the time state with the current time
// Every time state updates → React re-renders → clock shows new time
// return () => clearInterval(timer) — when the component unmounts, the interval is cleared so it doesn't keep running in the background and cause memory leaks


useEffect(() => {
  const timer = setInterval(() => setTime(new Date()), 1000)
  return () => clearInterval(timer)
}, [])

useEffect(() => {
  const stored = localStorage.getItem('daily_quote')
  const storedTime = localStorage.getItem('daily_quote_time')
  const tenHours = 10 * 60 * 60 * 1000

  if (stored && storedTime && Date.now() - parseInt(storedTime) < tenHours) {
    const parsed = JSON.parse(stored)
    setQuote(parsed.q)
    setQuoteAuthor(parsed.a)
  } else {

     fetch('https://dummyjson.com/quotes/random')
  .then(res => res.json())
  .then(data => {
    setQuote(data.quote)
    setQuoteAuthor(data.author)
    localStorage.setItem('daily_quote', JSON.stringify({ q: data.quote, a: data.author }))
    localStorage.setItem('daily_quote_time', Date.now().toString())
  })
  .catch(() => {
    setQuote('Make each day your masterpiece.')
    setQuoteAuthor('John Wooden')
  })
  }
}, [])

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
const weekdays = ['Su','Mo','Tu','We','Th','Fr','Sa']
const hours = time.getHours() % 12 || 12

useEffect(() => {
  if (!editor) return
  const isReadOnly = selectedDay && isPast(currentYear, currentMonth, selectedDay)
  editor.setEditable(!isReadOnly)
}, [selectedDay, editor])

useEffect(() => {
  fetch(`${API_URL}/entries`, {
    headers: getAuthHeaders()
  })
    .then(res => res.json())
    .then(data => {
      const mapped = {}
      data.forEach(entry => {
        const date = new Date(entry.date)
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        mapped[key] = { content: entry.content, id: entry.id }
      })
      setEntries(mapped)
      setStreak(calculateStreak(mapped))
    })
    .catch(err => console.error('Failed to fetch entries:', err))
}, [])

function calculateStreak(entriesObj) {
  let count = 0
  const check = new Date()
  check.setHours(0, 0, 0, 0)

  while (true) {
    const key = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`
    if (entriesObj[key]) {
      count++
      check.setDate(check.getDate() - 1)
    } else {
      break
    }
  }
  return count
}

const minutes = String(time.getMinutes()).padStart(2, '0')
const seconds = String(time.getSeconds()).padStart(2, '0')
const ampm = time.getHours() >= 12 ? 'PM' : 'AM'

function entryKey(y, m, d) { return `${y}-${m}-${d}` }
function isToday(y, m, d) { return y === today.getFullYear() && m === today.getMonth() && d === today.getDate() }
function isPast(y, m, d) { return new Date(y, m, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate()) }
function isFuture(y, m, d) { return new Date(y, m, d) > new Date(today.getFullYear(), today.getMonth(), today.getDate()) }

function changeMonth(dir) {
  let m = currentMonth + dir
  let y = currentYear
  if (m > 11) { m = 0; y++ }
  if (m < 0) { m = 11; y-- }
  setCurrentMonth(m)
  setCurrentYear(y)
  setSelectedDay(null)
  setPanelOpen(false)
}

const firstDay = new Date(currentYear, currentMonth, 1).getDay()
const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
const blanks = Array(firstDay).fill(null)
const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

const calendarStyles = `
  .nav-arrow:hover { background: #F4E8E6; }
  .close-btn:hover { color: #2C2020 !important; }
  .nav-arrow:focus-visible, .save-button:focus-visible { outline: 3px solid rgba(196,144,138,0.25); outline-offset: 2px; }
  .day-cell-button { transition: all 0.15s; }
  .day-cell-button:hover { transform: translateY(-1px); }
  .past-day:hover { background: #F3E5E2; border-radius: 10px; }
  @keyframes soft-pulse { 0%, 100% { box-shadow: 0 2px 8px rgba(196,144,138,0.35); } 50% { box-shadow: 0 2px 16px rgba(196,144,138,0.6); } }
  .today-day { animation: soft-pulse 3s ease-in-out infinite; }
  .calendar-textarea::placeholder { color: #B7A29F; }
  .calendar-textarea:disabled { background: rgba(247,239,237,0.65); color: #9A7F7A; cursor: not-allowed; }
  .save-button { transition: background 0.2s, transform 0.15s; }
  .save-button:not(:disabled):hover { transform: translateY(-1px); }
  .ProseMirror { outline: none; min-height: 160px; }
  .ProseMirror p { margin: 0 0 8px 0; }
  .ProseMirror h1 { font-size: 20px; font-weight: 600; color: #2C2020; margin: 0 0 8px 0; }
  .ProseMirror h2 { font-size: 17px; font-weight: 600; color: #2C2020; margin: 0 0 8px 0; }
  .ProseMirror ul { list-style-type: disc !important; padding-left: 20px !important; }
  .ProseMirror ol { list-style-type: decimal !important; padding-left: 20px !important; }
  .ProseMirror li { display: list-item !important; }
  .ProseMirror ul { padding-left: 20px; margin: 0 0 8px 0; }
  .ProseMirror li { margin-bottom: 4px; }
  .ProseMirror strong { font-weight: 600; color: #2C2020; }
  .ProseMirror p.is-editor-empty:first-child::before { content: 'completed auth flow...'; color: #B7A29F; pointer-events: none; float: left; height: 0; }
  @keyframes flip {
    0% { transform: rotateX(0deg); }
    50% { transform: rotateX(-90deg); }
    100% { transform: rotateX(0deg); }
  }
  .flip-card { animation: flip 0.6s ease-in-out; }
  .clock-digit {
    background: #F3E6E3;
    color: #2C2020;
    font-family: 'DM Sans', sans-serif;
    font-size: 22px;
    font-weight: 600;
    padding: 8px 12px;
    border-radius: 8px;
    min-width: 42px;
    text-align: center;
    letter-spacing: 1px;
  }
  .clock-separator {
    color: #C4908A;
    font-size: 20px;
    font-weight: 600;
    padding: 0 2px;
    align-self: center;
  }
  .clock-ampm {
    font-size: 11px;
    font-weight: 500;
    color: #8A5F59;
    align-self: flex-end;
    padding-bottom: 2px;
    letter-spacing: 0.08em;
  }
`

  return (
    <div style={{ margin: '0 auto', maxWidth: '92vw', minHeight: '100vh', alignItems: 'flex-start', background: '#F7F3F0', padding: '24px 16px', boxSizing: 'border-box', width: '100%' }}>
      <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', border: '0.5px solid #E0D5D1', overflow: 'hidden', borderRadius: '28px', background: '#FFFFFF', boxShadow: '0 24px 60px rgba(0,0,0,0.08)' }}>
        <style>{calendarStyles}</style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '0.5px solid #E0D5D1', background: '#FFFFFF', boxShadow: '0 1px 15px rgba(0,0,0,0.04)', zIndex: 1 }}>
        
        {/* Logo */}
        <div style={{ fontFamily: 'Lora, serif', fontSize: '20px', fontWeight: 700, color: '#2C2020', letterSpacing: '-0.02em' }}>
          done<span style={{ color: '#C4908A' }}>.</span>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: '#8A5F59', background: '#F3E6E3', border: '0.5px solid #E6D1CE', padding: '5px 12px', borderRadius: '20px', fontWeight: 500 }}>
            🌱 {streak} day streak
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E9D5D2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 500, color: '#8A5F59' }}>
            {userInitial}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            style={{ background: 'transparent', border: '1px solid #D1B1AA', color: '#8A5F59', borderRadius: '12px', padding: '8px 12px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
          >
            Sign out
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '20px' }}>

  <div style={{ flex: 1, minWidth: 0, padding: '32px 34px 40px' }}>

{/* Quote and Clock */}
<div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', marginBottom: '20px', gap: '24px' }}>
  {/* Quote left */}
  {quote && (
    <div style={{ flex: 1, borderRadius: '18px', background: '#FFFFFF', boxShadow: '0 10px 24px rgba(196,144,138,0.12)', textAlign: 'center', padding: '22px 22px 26px' }}>
      <p style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', fontSize: '14px', color: '#8A7F7A', lineHeight: 1.8, margin: 0 }}>
        "{quote}"
      </p>
      <p style={{ fontSize: '12px', color: '#A68E88', marginTop: '8px', letterSpacing: '0.04em' }}>
        — {quoteAuthor}
      </p>
    </div>
  )}

  {/* Clock right */}
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#FFFFFF', borderRadius: '18px', padding: '18px 20px', boxShadow: '0 10px 24px rgba(196,144,138,0.12)', flexShrink: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span className="clock-digit">{String(hours).padStart(2, '0')}</span>
      <span className="clock-separator">:</span>
      <span className="clock-digit">{minutes}</span>
      <span className="clock-separator">:</span>
      <span className="clock-digit">{seconds}</span>
      <span className="clock-ampm">{ampm}</span>
    </div>
  </div>
</div>
    <hr style={{ border: 'none', borderTop: '0.5px solid #E0D5D1', margin: '0 32px 28px 32px' }} />
    {/* Month nav */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
      <button className="nav-arrow" onClick={() => changeMonth(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A5F59', fontSize: '18px', padding: '6px 10px', borderRadius: '6px', transition: 'all 0.15s' }}>←</button>
      <div style={{ fontFamily: 'Lora, serif', fontSize: '20px', fontWeight: 500, color: '#2C2020' }}>
        {monthNames[currentMonth]} {currentYear}
      </div>
      <button className="nav-arrow" onClick={() => changeMonth(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A5F59', fontSize: '18px', padding: '6px 10px', borderRadius: '6px', transition: 'all 0.15s' }}>→</button>
    </div>

    {/* Calendar grid */}
    <div style={{ background: '#FFFFFF', borderRadius: '22px', padding: '18px 14px 20px', boxShadow: '0 10px 24px rgba(196,144,138,0.08)', margin: '0 12px 0 12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '16px' }}>
        {weekdays.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '13px', fontWeight: 500, color: '#8A5F59', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '4px 0' }}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
      {blanks.map((_, i) => <div key={`b-${i}`} />)}
      {days.map(d => {
        const future = isFuture(currentYear, currentMonth, d)
        const todayDay = isToday(currentYear, currentMonth, d)
        const hasEntry = !!entries[entryKey(currentYear, currentMonth, d)]
        const isSelected = selectedDay === d

        let bg = 'transparent'
        let color = '#8A5F59'
        let cursor = 'pointer'
        let fontWeight = 400

        if (todayDay) { bg = isSelected ? '#A86B60' : '#C4908A'; color = '#fff'; fontWeight = 500 }
        else if (future) { color = '#C7B0AB'; cursor = 'not-allowed' }
        else if (isSelected) { bg = '#F3E6E3'; color = '#2C2020' }

        return (
          <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px' }}>
            <div
              className={`day-cell-button ${isPast(currentYear, currentMonth, d) ? 'past-day' : ''} ${todayDay ? 'today-day' : ''}`}
              onClick={() => {
  if (future) return
  if (isSelected) { setSelectedDay(null); setPanelOpen(false); return }
  setSelectedDay(d)
  setPanelOpen(true)
  const existingEntry = entries[entryKey(currentYear, currentMonth, d)]
  const content = existingEntry?.content || ''
  setPanelContent(content)
  if (editor) editor.commands.setContent(content)
  setSaved(false)
}}
              style={{ position: 'relative', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: todayDay ? '50%' : '10px', background: bg, color, cursor, fontWeight, fontSize: '16px', transition: 'all 0.15s' }}
            >
              {d}
              {hasEntry && !todayDay && (
                <span style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: '#C4908A' }} />
              )}
            </div>
          </div>
        )
      })}
    </div>
  </div>
</div>
  {/* Popup card */}
  <div onClick={() => { setSelectedDay(null); setPanelOpen(false) }} style={{ display: panelOpen ? 'flex' : 'none', position: 'fixed', inset: 0, alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.28)', padding: '24px', zIndex: 1000 }}>
    <div onClick={e => e.stopPropagation()} style={{ width: 'min(520px, 100%)', maxHeight: 'calc(100vh - 96px)', overflow: 'hidden', borderRadius: '28px', background: '#FFFFFF', boxShadow: '0 24px 60px rgba(0,0,0,0.16)', position: 'relative', display: 'flex', flexDirection: 'column', padding: '32px 24px' }}>
      <button
        className="close-btn"
        onClick={() => { setSelectedDay(null); setPanelOpen(false) }}
        style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#8A5F59', fontSize: '24px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
      >×</button>

      {/* Date label */}
      <div style={{ fontSize: '13px', fontWeight: 500, color: '#8A5F59', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
        {selectedDay && (() => {
          const d = new Date(currentYear, currentMonth, selectedDay)
          const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
          const monthNames2 = ['January','February','March','April','May','June','July','August','September','October','November','December']
          return `${dayNames[d.getDay()]}, ${monthNames2[currentMonth]} ${selectedDay}`
        })()}
      </div>

      {/* Panel heading */}
      <div style={{ fontFamily: 'Lora, serif', fontSize: '19px', fontStyle: 'italic', color: '#2C2020', marginBottom: '12px' }}>
        {selectedDay && isPast(currentYear, currentMonth, selectedDay) ? 'what got done' : "What did you complete today?"}
      </div>

      {/* Toolbar - hidden for past dates */}
      {!(selectedDay && isPast(currentYear, currentMonth, selectedDay)) && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', paddingBottom: '10px', borderBottom: '0.5px solid #E0D5D1' }}>
          {[
            { label: 'B', action: () => editor.chain().focus().toggleBold().run(), active: editor?.isActive('bold') },
            { label: 'H1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor?.isActive('heading', { level: 1 }) },
            { label: 'H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive('heading', { level: 2 }) },
            { label: '•', action: () => editor.chain().focus().toggleBulletList().run(), active: editor?.isActive('bulletList') },
            { label: '1.', action: () => editor.chain().focus().toggleOrderedList().run(), active: editor?.isActive('orderedList') },
          ].map(btn => (
            <button
              key={btn.label}
              onClick={btn.action}
              style={{ background: btn.active ? '#F3E6E3' : 'transparent', border: '0.5px solid', borderColor: btn.active ? '#C4908A' : '#E0D5D1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: 600, color: btn.active ? '#C4908A' : '#8A5F59', cursor: 'pointer' }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {/* TipTap Editor */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: '0', fontSize: '15px', lineHeight: 1.8, color: '#3A3830', fontFamily: 'DM Sans, sans-serif' }}>
        <EditorContent editor={editor} />
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '0.5px solid #E0D5D1' }}>
        {selectedDay && isPast(currentYear, currentMonth, selectedDay) ? (
          <span style={{ fontSize: '11px', color: '#B5B0A6', fontStyle: 'italic' }}>read only</span>
        ) : (
          <>
            <button
              className="save-button"
              onClick={async () => {
                if (editor.isEmpty) return
                const content = editor.getHTML()
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
                const existingEntry = entries[entryKey(currentYear, currentMonth, selectedDay)]

                if (existingEntry?.id) {
                  // Update existing entry
                  const res = await fetch(`${API_URL}/entries/${existingEntry.id}`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ content })
                  })
                  if (res.ok) {
                    setEntries(prev => ({ ...prev, [entryKey(currentYear, currentMonth, selectedDay)]: { ...existingEntry, content } }))
                    setSaved(true)
                    setTimeout(() => setSaved(false), 2000)
                  }
                } else {
                  // Create new entry
                  const res = await fetch(`${API_URL}/entries`, {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ date: dateStr, content })
                  })
                  if (res.ok) {
                    const data = await res.json()
                    setEntries(prev => ({ ...prev, [entryKey(currentYear, currentMonth, selectedDay)]: { content, id: data.id } }))
                    setSaved(true)
                    setTimeout(() => setSaved(false), 2000)
                  }
                }
              }}
              style={{ fontSize: '13px', fontWeight: 500, background: saved ? '#D9B2A6' : '#C4908A', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer' }}
            >
              {saved ? '✓ Saved' : entries[entryKey(currentYear, currentMonth, selectedDay)]?.id ? 'Update' : 'Save'}
            </button>
          </>
        )}
      </div>
    </div>
  </div>
</div>

    </div>
    </div>
  )
}

export default Calendar
