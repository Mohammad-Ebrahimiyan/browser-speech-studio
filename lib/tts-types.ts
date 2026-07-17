export const TTS_MODEL = 'Xenova/mms-tts-eng'
export const TTS_MAX_TEXT_LENGTH = 2000
export const TTS_OUTPUT_MIME_TYPE = 'audio/mpeg' as const

export type TtsWorkerRequest =
  { type: 'load' } | { type: 'generate'; text: string }

export type TtsWorkerResponse =
  | { status: 'loading'; progress: number }
  | { status: 'ready' }
  | { status: 'generating' }
  | {
      status: 'complete'
      audio: ArrayBuffer
      mimeType: typeof TTS_OUTPUT_MIME_TYPE
    }
  | { status: 'error'; message: string }

export interface TextToSpeechState {
  audioUrl?: string
  error?: string
  isGenerating: boolean
  isModelLoading: boolean
  isModelReady: boolean
  modelLoadingProgress: number
  generate: (text: string) => void
  clearAudio: () => void
}
