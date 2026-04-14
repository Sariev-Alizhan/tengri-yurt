// Shared singleton audio + state event bus for MusicPlayer ↔ Navbar

let _audio: HTMLAudioElement | null = null

export function getAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  if (!_audio) {
    _audio = new Audio('/audio/kuy-aday-kurmangazy.mp3')
    _audio.loop = true
    _audio.preload = 'none'
  }
  return _audio
}

export function dispatchMusicState(playing: boolean) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('music-state', { detail: { playing } }))
  }
}

export function toggleMusic(): void {
  const audio = getAudio()
  if (!audio) return
  if (audio.paused) {
    audio.play().then(() => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'Адай — Күрмаңғазы',
          artist: 'Traditional Kazakh Kuy',
          album: 'Tengri Yurt Ambient',
          artwork: [{ src: '/images/logo_white.png', sizes: '512x512', type: 'image/png' }],
        })
        navigator.mediaSession.setActionHandler('play',  () => { audio.play();  dispatchMusicState(true) })
        navigator.mediaSession.setActionHandler('pause', () => { audio.pause(); dispatchMusicState(false) })
      }
      dispatchMusicState(true)
    }).catch(() => {})
  } else {
    audio.pause()
    dispatchMusicState(false)
  }
}
