'use client'

import { AudioLines, Mic2, Sparkles } from 'lucide-react'

import AudioManager from '@/components/audio-manager'
import TextToSpeech from '@/components/text-to-speech'
import Transcript from '@/components/transcript'
import { Progress } from '@/components/ui/progress'
import { useTranscriber } from '@/hooks/useTranscriber'

export default function Home() {
  const transcriber = useTranscriber()

  const modelStatus = transcriber.isModelLoading
    ? 'Loading model'
    : transcriber.modelLoadingProgress === 100
      ? 'Model ready'
      : 'Model not loaded'

  return (
    <main className='min-h-screen'>
      <section className='to-background border-b bg-linear-to-b from-zinc-50 py-16 sm:py-20 dark:from-zinc-950'>
        <div className='container max-w-7xl'>
          <div className='grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end'>
            <div>
              <div className='text-primary mb-4 inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1.5 text-sm font-medium shadow-xs backdrop-blur dark:bg-black/20'>
                <Sparkles className='size-4' />
                Speech AI in your browser
              </div>
              <h1 className='max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl'>
                Transcribe audio. Generate speech.
              </h1>
              <p className='text-muted-foreground mt-5 max-w-2xl text-base leading-7 sm:text-lg'>
                A private browser-based workspace for English speech-to-text and
                text-to-speech.
              </p>
            </div>

            <div className='rounded-2xl border bg-white/75 p-5 shadow-sm backdrop-blur dark:bg-black/20'>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl'>
                  <Mic2 className='size-5' />
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center justify-between gap-3 text-sm font-medium'>
                    <span>Speech recognition</span>
                    <span>{transcriber.modelLoadingProgress.toFixed()}%</span>
                  </div>
                  <p className='text-muted-foreground mt-0.5 text-xs'>
                    {modelStatus}
                  </p>
                </div>
              </div>
              <Progress
                className='mt-4'
                value={transcriber.modelLoadingProgress}
                max={100}
              />
            </div>
          </div>
        </div>
      </section>

      <section className='py-10 sm:py-14'>
        <div className='container max-w-7xl'>
          <div className='mb-5 flex items-center gap-3'>
            <div className='bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl'>
              <AudioLines className='size-5' />
            </div>
            <div>
              <h2 className='text-2xl font-bold'>Speech to Text</h2>
              <p className='text-muted-foreground text-sm'>
                Load or record audio, then create a transcript.
              </p>
            </div>
          </div>

          <div className='grid gap-6 lg:grid-cols-2'>
            <AudioManager transcriber={transcriber} />
            <Transcript transcriber={transcriber} />
          </div>

          <TextToSpeech sourceText={transcriber.output?.text} />
        </div>
      </section>
    </main>
  )
}
