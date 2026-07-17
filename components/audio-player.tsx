'use client'

import { useEffect, useRef } from 'react'

interface AudioPlayerProps {
  audioUrl: string
  mimeType: string
}

export default function AudioPlayer({ audioUrl, mimeType }: AudioPlayerProps) {
  const playerRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const player = playerRef.current

    if (!player) {
      return
    }

    player.pause()
    player.currentTime = 0
    player.load()
  }, [audioUrl, mimeType])

  return (
    <audio
      ref={playerRef}
      controls
      preload='metadata'
      className='h-12 w-full'
      aria-label='Audio player'
    >
      <source src={audioUrl} type={mimeType} />
      Your browser does not support audio playback.
    </audio>
  )
}
