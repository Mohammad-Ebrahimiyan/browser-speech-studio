import { useCallback, useEffect, useRef, useState } from 'react'
import {
  type TextToSpeechState,
  type TtsWorkerRequest,
  type TtsWorkerResponse
} from '@/lib/tts-types'

export function useTextToSpeech(): TextToSpeechState {
  const workerRef = useRef<Worker | null>(null)
  const audioUrlRef = useRef<string | undefined>(undefined)

  const [audioUrl, setAudioUrl] = useState<string>()
  const [error, setError] = useState<string>()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(true)
  const [isModelReady, setIsModelReady] = useState(false)
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0)

  const revokeCurrentAudioUrl = useCallback((): void => {
    if (!audioUrlRef.current) {
      return
    }

    URL.revokeObjectURL(audioUrlRef.current)
    audioUrlRef.current = undefined
  }, [])

  const clearAudio = useCallback((): void => {
    revokeCurrentAudioUrl()
    setAudioUrl(undefined)
    setError(undefined)
  }, [revokeCurrentAudioUrl])

  useEffect(() => {
    const worker = new Worker(
      new URL('../lib/tts-worker.ts', import.meta.url),
      { type: 'module' }
    )

    workerRef.current = worker

    const handleMessage = (event: MessageEvent<TtsWorkerResponse>): void => {
      const message = event.data

      switch (message.status) {
        case 'loading':
          setIsModelLoading(true)
          setModelLoadingProgress(current =>
            Math.max(current, message.progress)
          )
          break

        case 'ready':
          setIsModelLoading(false)
          setIsModelReady(true)
          setModelLoadingProgress(100)
          setError(undefined)
          break

        case 'generating':
          setIsGenerating(true)
          setError(undefined)
          break

        case 'complete': {
          revokeCurrentAudioUrl()

          const blob = new Blob([message.audio], {
            type: message.mimeType
          })
          const nextAudioUrl = URL.createObjectURL(blob)

          audioUrlRef.current = nextAudioUrl
          setAudioUrl(nextAudioUrl)
          setIsGenerating(false)
          setError(undefined)
          break
        }

        case 'error':
          setIsGenerating(false)
          setIsModelLoading(false)
          setError(message.message)
          break
      }
    }

    const handleWorkerError = (event: ErrorEvent): void => {
      setIsGenerating(false)
      setIsModelLoading(false)
      setIsModelReady(false)
      setError(event.message || 'The text-to-speech worker failed.')
    }

    worker.addEventListener('message', handleMessage)
    worker.addEventListener('error', handleWorkerError)

    const loadRequest: TtsWorkerRequest = { type: 'load' }
    worker.postMessage(loadRequest)

    return () => {
      worker.removeEventListener('message', handleMessage)
      worker.removeEventListener('error', handleWorkerError)
      worker.terminate()
      workerRef.current = null
      revokeCurrentAudioUrl()
    }
  }, [revokeCurrentAudioUrl])

  const generate = useCallback(
    (text: string): void => {
      if (!workerRef.current || !isModelReady || isGenerating) {
        return
      }

      clearAudio()
      setIsGenerating(true)

      const request: TtsWorkerRequest = {
        type: 'generate',
        text
      }
      workerRef.current.postMessage(request)
    },
    [clearAudio, isGenerating, isModelReady]
  )

  return {
    audioUrl,
    error,
    isGenerating,
    isModelLoading,
    isModelReady,
    modelLoadingProgress,
    generate,
    clearAudio
  }
}
