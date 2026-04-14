'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'

type Message = { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS: Record<string, string[]> = {
  en: ['What sizes are available?', 'How much does a yurt cost?', 'How long does delivery take?', 'What is the Yurt Hammam?'],
  ru: ['Какие размеры доступны?', 'Сколько стоит юрта?', 'Сколько идёт доставка?', 'Что такое юрта-хаммам?'],
  kk: ['Қандай өлшемдер бар?', 'Киіз үй қанша тұрады?', 'Жеткізу қанша уақыт алады?', 'Юрта-хаммам деген не?'],
  zh: ['有哪些尺寸？', '蒙古包多少钱？', '送货需要多长时间？', '什么是蒙古包浴室？'],
  ar: ['ما الأحجام المتاحة؟', 'كم تكلفة الخيمة؟', 'كم تستغرق الشحن؟', 'ما هو الحمام في الخيمة؟'],
}

const PLACEHOLDER: Record<string, string> = {
  en: 'Ask about yurts…',
  ru: 'Спросите про юрты…',
  kk: 'Киіз үй туралы сұраңыз…',
  zh: '询问有关蒙古包…',
  ar: 'اسأل عن الخيمة…',
}

const TITLE: Record<string, string> = {
  en: 'Tengri Guide',
  ru: 'Tengri Гид',
  kk: 'Tengri Нұсқаушы',
  zh: 'Tengri 指南',
  ar: 'دليل Tengri',
}

function getLocale(pathname: string): string {
  const match = pathname.match(/^\/(en|ru|kk|zh|ar)/)
  return match?.[1] ?? 'en'
}

export function YurtChat() {
  const pathname = usePathname() ?? ''
  const locale = getLocale(pathname)
  const isSupplier = pathname.includes('/supplier')

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Pulse hint after 8s
  useEffect(() => {
    if (isSupplier) return
    const t = setTimeout(() => setPulse(true), 8000)
    return () => clearTimeout(t)
  }, [isSupplier])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setPulse(false)
    }
  }, [open])

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || streaming) return

    const userMsg: Message = { role: 'user', content: trimmed }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setStreaming(true)

    const assistantPlaceholder: Message = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantPlaceholder])

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      })

      if (res.status === 503) {
        setUnavailable(true)
        setMessages(prev => prev.slice(0, -1))
        setStreaming(false)
        return
      }

      if (!res.ok || !res.body) throw new Error('Stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setMessages(prev => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: 'assistant', content: accumulated }
          return copy
        })
      }
    } catch (err: unknown) {
      if ((err as { name?: string })?.name !== 'AbortError') {
        setMessages(prev => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: 'assistant', content: '⚠ Connection error. Please try again.' }
          return copy
        })
      }
    } finally {
      setStreaming(false)
    }
  }, [messages, streaming])

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  if (isSupplier || !isMobile) return null

  const suggs = SUGGESTIONS[locale] ?? SUGGESTIONS.en
  const isRTL = locale === 'ar'

  return (
    <>
      {/* Chat panel */}
      <div
        role="dialog"
        aria-label="Tengri AI Guide"
        style={{
          position: 'fixed',
          bottom: '80px',
          left: 'max(16px, env(safe-area-inset-left, 16px))',
          zIndex: 50,
          width: 'min(360px, calc(100vw - 32px))',
          background: '#1a1510',
          border: '1px solid rgba(201,168,110,0.18)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,110,0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          maxHeight: 'min(520px, calc(100dvh - 160px))',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transform: open ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
          borderBottom: '1px solid rgba(201,168,110,0.1)',
          background: 'rgba(201,168,110,0.06)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #c9a86e, #8a6a3a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5S11.59 1.5 8 1.5Zm0 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm1.5 7.5h-3v-1h.75V7H6.5V6h2.25v4h.75v1Z" fill="rgba(255,255,255,0.9)"/>
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.92)', margin: 0, lineHeight: 1.2 }}>
                {TITLE[locale] ?? 'Tengri Guide'}
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'rgba(201,168,110,0.7)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                AI · Powered by Claude
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'rgba(255,255,255,0.4)', display: 'flex' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.length === 0 && !unavailable && (
            <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
              <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '22px', color: 'rgba(201,168,110,0.9)', margin: '0 0 4px', fontStyle: 'italic' }}>
                Tengri Yurt
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '0 0 16px' }}>
                {locale === 'ru' ? 'Спросите меня что угодно о казахских юртах' :
                 locale === 'kk' ? 'Қазақ киіз үйі туралы кез-келген сұрақ қойыңыз' :
                 locale === 'zh' ? '问我任何关于哈萨克蒙古包的问题' :
                 locale === 'ar' ? 'اسألني أي شيء عن الخيام الكازاخية' :
                 'Ask me anything about Kazakh yurts'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {suggs.map(s => (
                  <button key={s} onClick={() => send(s)} style={{
                    background: 'rgba(201,168,110,0.07)',
                    border: '1px solid rgba(201,168,110,0.15)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(201,168,110,0.14)'
                    e.currentTarget.style.borderColor = 'rgba(201,168,110,0.3)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(201,168,110,0.07)'
                    e.currentTarget.style.borderColor = 'rgba(201,168,110,0.15)'
                  }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {unavailable && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 12px' }}>
                {locale === 'ru' ? 'AI-чат временно недоступен.' :
                 locale === 'kk' ? 'AI-чат уақытша қолжетімсіз.' :
                 'AI chat is currently unavailable.'}
              </p>
              <a
                href={`https://wa.me/77477777888`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', background: '#25D366', borderRadius: '8px',
                  fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600,
                  color: '#fff', textDecoration: 'none',
                }}
              >
                WhatsApp
              </a>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '85%',
                padding: '10px 13px',
                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: msg.role === 'user' ? 'rgba(201,168,110,0.2)' : 'rgba(255,255,255,0.06)',
                border: msg.role === 'user' ? '1px solid rgba(201,168,110,0.25)' : '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                lineHeight: 1.6,
                color: msg.role === 'user' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.82)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {msg.content}
                {msg.role === 'assistant' && msg.content === '' && streaming && (
                  <span style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }}>
                    {[0,1,2].map(j => (
                      <span key={j} style={{
                        width: '4px', height: '4px', borderRadius: '50%',
                        background: 'rgba(201,168,110,0.7)',
                        animation: `chatDot 1.2s ${j * 0.2}s ease-in-out infinite`,
                      }} />
                    ))}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(201,168,110,0.1)',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
          background: 'rgba(0,0,0,0.15)',
          flexShrink: 0,
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={PLACEHOLDER[locale] ?? 'Ask about yurts…'}
            rows={1}
            disabled={streaming || unavailable}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(201,168,110,0.15)',
              borderRadius: '10px',
              color: 'rgba(255,255,255,0.9)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              padding: '9px 12px',
              outline: 'none',
              resize: 'none',
              maxHeight: '100px',
              overflowY: 'auto',
              lineHeight: 1.5,
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || streaming || unavailable}
            aria-label="Send"
            style={{
              width: '36px', height: '36px',
              borderRadius: '10px',
              background: input.trim() && !streaming ? 'var(--sp-gold, #c9a86e)' : 'rgba(255,255,255,0.08)',
              border: 'none',
              cursor: input.trim() && !streaming ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.15s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 8H2M9 3l5 5-5 5" stroke={input.trim() && !streaming ? '#0a0806' : 'rgba(255,255,255,0.3)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close chat' : 'Open AI guide'}
        style={{
          position: 'fixed',
          bottom: '16px',
          left: 'max(20px, env(safe-area-inset-left, 20px))',
          zIndex: 50,
          width: '52px', height: '52px',
          borderRadius: '50%',
          background: open ? '#1a1510' : 'linear-gradient(135deg, #c9a86e 0%, #8a6a3a 100%)',
          border: '1px solid rgba(201,168,110,0.4)',
          boxShadow: open ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(201,168,110,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
          outline: 'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.07)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {/* Pulse ring */}
        {pulse && !open && (
          <span style={{
            position: 'absolute', inset: '-4px',
            borderRadius: '50%',
            border: '2px solid rgba(201,168,110,0.5)',
            animation: 'chatPulse 2s ease-out infinite',
            pointerEvents: 'none',
          }} />
        )}

        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4l10 10M14 4 4 14" stroke="rgba(201,168,110,0.9)" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="9" stroke="rgba(255,255,255,0.85)" strokeWidth="1.25" fill="none"/>
            <path d="M11 7.5v5M11 14.5v.5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}

        {/* Unread dot when pulse */}
        {pulse && !open && (
          <span style={{
            position: 'absolute', top: '2px', right: '2px',
            width: '10px', height: '10px', borderRadius: '50%',
            background: '#c9a86e',
            border: '2px solid #1a1510',
          }} />
        )}
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes chatDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes chatPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}} />
    </>
  )
}
