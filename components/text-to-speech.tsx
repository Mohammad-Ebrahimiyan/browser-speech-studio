'use client'

import { useState } from 'react'
import { AudioWaveform, Cpu, FileAudio } from 'lucide-react'

import TtsInputPanel from '@/components/tts/tts-input-panel'
import TtsOutputPanel from '@/components/tts/tts-output-panel'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'
import { TTS_MAX_TEXT_LENGTH } from '@/lib/tts-types'

interface TextToSpeechProps {
  sourceText?: string
}

export default function TextToSpeech({ sourceText }: TextToSpeechProps) {
  const [text, setText] = useState('')
  const {
    audioUrl,
    error,
    isGenerating,
    isModelLoading,
    isModelReady,
    modelLoadingProgress,
    generate,
    clearAudio
  } = useTextToSpeech()

  const isGenerateDisabled =
    text.trim().length === 0 ||
    text.length > TTS_MAX_TEXT_LENGTH ||
    isGenerating ||
    !isModelReady

  const handleTextChange = (nextText: string): void => {
    setText(nextText)
    clearAudio()
  }

  const handleUseTranscription = (): void => {
    if (!sourceText) {
      return
    }

    setText(sourceText.slice(0, TTS_MAX_TEXT_LENGTH))
    clearAudio()
  }

  const handleReset = (): void => {
    setText('')
    clearAudio()
  }

  return (
    <section className='mt-10' aria-labelledby='tts-heading'>
      <div className='mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <div className='text-primary mb-2 flex items-center gap-2 text-sm font-medium'>
            <AudioWaveform className='size-4' />
            Private, in-browser synthesis
          </div>
          <h2 id='tts-heading' className='text-3xl font-bold tracking-tight'>
            Text to Speech
          </h2>
          <p className='text-muted-foreground mt-2 max-w-2xl text-sm leading-6'>
            Turn English text or your latest transcription into downloadable
            speech without sending the text to an application server.
          </p>
        </div>

        <div className='text-muted-foreground flex flex-wrap gap-2 text-xs'>
          <span className='bg-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5'>
            <Cpu className='size-3.5' />
            Browser inference
          </span>
          <span className='bg-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5'>
            <FileAudio className='size-3.5' />
            MP3 output
          </span>
        </div>
      </div>

      <div className='bg-card overflow-hidden rounded-2xl border shadow-sm lg:grid lg:grid-cols-2'>
        <TtsInputPanel
          text={text}
          sourceText={sourceText}
          isGenerating={isGenerating}
          isGenerateDisabled={isGenerateDisabled}
          onTextChange={handleTextChange}
          onUseTranscription={handleUseTranscription}
          onGenerate={() => generate(text)}
          onReset={handleReset}
        />

        <TtsOutputPanel
          audioUrl={audioUrl}
          error={error}
          isGenerating={isGenerating}
          isModelLoading={isModelLoading}
          isModelReady={isModelReady}
          modelLoadingProgress={modelLoadingProgress}
        />
      </div>
    </section>
  )
}
