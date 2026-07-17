import {
  AudioLines,
  CircleAlert,
  Download,
  LoaderCircle,
  ShieldCheck
} from 'lucide-react'

import AudioPlayer from '@/components/audio-player'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface TtsOutputPanelProps {
  audioUrl?: string
  error?: string
  isGenerating: boolean
  isModelLoading: boolean
  isModelReady: boolean
  modelLoadingProgress: number
}

export default function TtsOutputPanel({
  audioUrl,
  error,
  isGenerating,
  isModelLoading,
  isModelReady,
  modelLoadingProgress
}: TtsOutputPanelProps) {
  return (
    <div className='from-primary/[0.07] via-background to-background flex min-h-96 min-w-0 flex-1 flex-col border-t bg-linear-to-br p-5 sm:p-7 lg:border-t-0 lg:border-l'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex gap-3'>
          <div className='bg-primary text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-xl shadow-sm'>
            <AudioLines className='size-5' />
          </div>
          <div>
            <h3 className='text-lg font-semibold'>Generated audio</h3>
            <p className='text-muted-foreground mt-1 text-sm'>
              Preview and download your MP3 file.
            </p>
          </div>
        </div>

        {isModelReady && (
          <span className='border-primary/15 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium'>
            <ShieldCheck className='size-3.5' />
            Model ready
          </span>
        )}
      </div>

      {isModelLoading && (
        <div className='my-auto py-10' role='status'>
          <div className='mx-auto max-w-sm rounded-2xl border bg-white/65 p-5 shadow-sm backdrop-blur dark:bg-black/10'>
            <div className='flex items-center gap-3'>
              <LoaderCircle className='text-primary size-5 animate-spin' />
              <div className='flex-1'>
                <div className='flex justify-between gap-3 text-sm font-medium'>
                  <span>Loading TTS model</span>
                  <span>{modelLoadingProgress.toFixed()}%</span>
                </div>
                <Progress
                  className='mt-3'
                  value={modelLoadingProgress}
                />
              </div>
            </div>
            <p className='text-muted-foreground mt-4 text-xs leading-5'>
              The first visit takes longer. The browser can reuse cached model files later.
            </p>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className='my-auto flex flex-col items-center justify-center py-12 text-center' role='status'>
          <div className='bg-primary/10 relative flex size-20 items-center justify-center rounded-full'>
            <div className='border-primary/30 absolute inset-0 animate-ping rounded-full border' />
            <AudioLines className='text-primary size-9 animate-pulse' />
          </div>
          <h4 className='mt-6 font-semibold'>Creating your audio</h4>
          <p className='text-muted-foreground mt-2 max-w-xs text-sm'>
            Synthesizing speech and encoding it as a 128 kbps MP3.
          </p>
        </div>
      )}

      {error && !isGenerating && (
        <div className='border-destructive/25 bg-destructive/10 text-destructive my-auto flex gap-3 rounded-2xl border p-4' role='alert'>
          <CircleAlert className='mt-0.5 size-5 shrink-0' />
          <div>
            <p className='font-medium'>Audio generation failed</p>
            <p className='mt-1 text-sm leading-6'>{error}</p>
          </div>
        </div>
      )}

      {!isModelLoading && !isGenerating && !audioUrl && !error && (
        <div className='text-muted-foreground my-auto flex flex-col items-center justify-center py-12 text-center'>
          <div className='bg-muted flex size-20 items-center justify-center rounded-full border'>
            <AudioLines className='size-9 opacity-60' />
          </div>
          <h4 className='text-foreground mt-6 font-semibold'>Ready when you are</h4>
          <p className='mt-2 max-w-xs text-sm leading-6'>
            Add English text, then select Generate speech to create an MP3.
          </p>
        </div>
      )}

      {audioUrl && !isGenerating && (
        <div className='my-auto space-y-4 py-8'>
          <div className='rounded-2xl border bg-white/70 p-4 shadow-sm backdrop-blur dark:bg-black/10'>
            <AudioPlayer audioUrl={audioUrl} mimeType='audio/mpeg' />
          </div>

          <Button asChild size='lg' className='w-full'>
            <a href={audioUrl} download='generated-speech.mp3'>
              <Download />
              Download MP3
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
