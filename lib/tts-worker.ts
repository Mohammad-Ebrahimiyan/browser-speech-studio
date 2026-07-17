/// <reference lib="webworker" />

import { env, pipeline } from '@xenova/transformers'
import * as lame from '@breezystack/lamejs'
import {
  TTS_MAX_TEXT_LENGTH,
  TTS_MODEL,
  TTS_OUTPUT_MIME_TYPE,
  type TtsWorkerRequest,
  type TtsWorkerResponse
} from '@/lib/tts-types'

const workerScope = self as unknown as DedicatedWorkerGlobalScope

env.allowLocalModels = false

type TextToSpeechOutput = {
  audio: Float32Array
  sampling_rate: number
}

type TextToSpeechPipeline = (text: string) => Promise<TextToSpeechOutput>

type ModelProgress = {
  progress?: number
}

const MP3_CHANNELS = 1
const MP3_BIT_RATE = 128
const MP3_SAMPLE_BLOCK_SIZE = 1152

let synthesizerPromise: Promise<TextToSpeechPipeline> | undefined

function postWorkerMessage(
  message: TtsWorkerResponse,
  transfer: Transferable[] = []
): void {
  workerScope.postMessage(message, transfer)
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'An unknown text-to-speech error occurred.'
}

function clampProgress(progress: unknown): number {
  if (typeof progress !== 'number' || !Number.isFinite(progress)) {
    return 0
  }

  return Math.min(100, Math.max(0, progress))
}

function isTextToSpeechOutput(output: unknown): output is TextToSpeechOutput {
  if (typeof output !== 'object' || output === null) {
    return false
  }

  const candidate = output as Partial<TextToSpeechOutput>

  return (
    candidate.audio instanceof Float32Array &&
    typeof candidate.sampling_rate === 'number' &&
    Number.isFinite(candidate.sampling_rate) &&
    candidate.sampling_rate > 0
  )
}

async function createSynthesizer(): Promise<TextToSpeechPipeline> {
  const instance = pipeline('text-to-speech', TTS_MODEL, {
    quantized: true,
    progress_callback: (data: ModelProgress) => {
      if (typeof data.progress === 'number') {
        postWorkerMessage({
          status: 'loading',
          progress: clampProgress(data.progress)
        })
      }
    }
  }) as unknown as Promise<TextToSpeechPipeline>

  try {
    const synthesizer = await instance
    postWorkerMessage({ status: 'ready' })
    return synthesizer
  } catch (error) {
    synthesizerPromise = undefined
    throw error
  }
}

function getSynthesizer(): Promise<TextToSpeechPipeline> {
  synthesizerPromise ??= createSynthesizer()
  return synthesizerPromise
}

function float32ToInt16(audio: Float32Array): Int16Array {
  const samples = new Int16Array(audio.length)

  for (let index = 0; index < audio.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, audio[index]))
    samples[index] = Math.round(sample < 0 ? sample * 32768 : sample * 32767)
  }

  return samples
}

function pushEncodedChunk(chunks: Uint8Array[], chunk: Uint8Array): void {
  if (chunk.length > 0) {
    chunks.push(Uint8Array.from(chunk))
  }
}

function mergeChunks(chunks: Uint8Array[]): ArrayBuffer {
  const byteLength = chunks.reduce(
    (total, chunk) => total + chunk.byteLength,
    0
  )
  const result = new Uint8Array(byteLength)
  let offset = 0

  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.byteLength
  }

  return result.buffer
}

function encodeMp3(audio: Float32Array, samplingRate: number): ArrayBuffer {
  const samples = float32ToInt16(audio)
  const encoder = new lame.Mp3Encoder(MP3_CHANNELS, samplingRate, MP3_BIT_RATE)
  const chunks: Uint8Array[] = []

  for (
    let offset = 0;
    offset < samples.length;
    offset += MP3_SAMPLE_BLOCK_SIZE
  ) {
    const block = samples.subarray(
      offset,
      Math.min(offset + MP3_SAMPLE_BLOCK_SIZE, samples.length)
    )

    pushEncodedChunk(chunks, encoder.encodeBuffer(block))
  }

  pushEncodedChunk(chunks, encoder.flush())

  if (chunks.length === 0) {
    throw new Error('The MP3 encoder returned an empty audio file.')
  }

  return mergeChunks(chunks)
}

function normalizeText(text: string): string {
  const normalizedText = text.trim().replace(/\s+/g, ' ')

  if (!normalizedText) {
    throw new Error('Please enter some English text.')
  }

  if (normalizedText.length > TTS_MAX_TEXT_LENGTH) {
    throw new Error(
      `Text cannot be longer than ${TTS_MAX_TEXT_LENGTH} characters.`
    )
  }

  return normalizedText
}

async function generateSpeech(text: string): Promise<void> {
  const normalizedText = normalizeText(text)
  postWorkerMessage({ status: 'generating' })

  const synthesizer = await getSynthesizer()
  const output: unknown = await synthesizer(normalizedText)

  if (!isTextToSpeechOutput(output)) {
    throw new Error('The TTS model returned an invalid audio response.')
  }

  const mp3 = encodeMp3(output.audio, output.sampling_rate)

  postWorkerMessage(
    {
      status: 'complete',
      audio: mp3,
      mimeType: TTS_OUTPUT_MIME_TYPE
    },
    [mp3]
  )
}

workerScope.addEventListener(
  'message',
  async (event: MessageEvent<TtsWorkerRequest>) => {
    try {
      if (event.data.type === 'load') {
        await getSynthesizer()
        return
      }

      await generateSpeech(event.data.text)
    } catch (error) {
      postWorkerMessage({
        status: 'error',
        message: getErrorMessage(error)
      })
    }
  }
)
