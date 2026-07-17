import {
  RotateCcw,
  Sparkles,
  TextCursorInput,
  WandSparkles
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { TTS_MAX_TEXT_LENGTH } from '@/lib/tts-types'

interface TtsInputPanelProps {
  text: string
  sourceText?: string
  isGenerating: boolean
  isGenerateDisabled: boolean
  onTextChange: (text: string) => void
  onUseTranscription: () => void
  onGenerate: () => void
  onReset: () => void
}

export default function TtsInputPanel({
  text,
  sourceText,
  isGenerating,
  isGenerateDisabled,
  onTextChange,
  onUseTranscription,
  onGenerate,
  onReset
}: TtsInputPanelProps) {
  const isNearLimit = text.length >= TTS_MAX_TEXT_LENGTH * 0.9

  return (
    <div className='flex min-w-0 flex-1 flex-col p-5 sm:p-7'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex gap-3'>
          <div className='bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl'>
            <WandSparkles className='size-5' />
          </div>
          <div>
            <h3 className='text-lg font-semibold'>Your text</h3>
            <p className='text-muted-foreground mt-1 text-sm'>
              Enter up to two short paragraphs in English.
            </p>
          </div>
        </div>

        <Button
          type='button'
          variant='outline'
          size='sm'
          disabled={!sourceText || isGenerating}
          onClick={onUseTranscription}
        >
          <TextCursorInput className='size-4' />
          Use transcription
        </Button>
      </div>

      <div className='mt-6 flex flex-1 flex-col'>
        <label htmlFor='tts-text' className='mb-2 text-sm font-medium'>
          English text
        </label>

        <Textarea
          id='tts-text'
          dir='auto'
          rows={9}
          maxLength={TTS_MAX_TEXT_LENGTH}
          value={text}
          disabled={isGenerating}
          placeholder='Type or paste your English text here...'
          className='min-h-52 resize-y bg-white/60 leading-7 dark:bg-black/10'
          onChange={event => onTextChange(event.target.value)}
        />

        <div className='mt-2 flex items-center justify-between gap-4 text-xs'>
          <span className='text-muted-foreground'>
            Processing happens locally in your browser.
          </span>
          <span
            className={
              isNearLimit
                ? 'text-destructive font-medium'
                : 'text-muted-foreground'
            }
          >
            {text.length.toLocaleString('en-US')} /{' '}
            {TTS_MAX_TEXT_LENGTH.toLocaleString('en-US')}
          </span>
        </div>
      </div>

      <div className='mt-6 flex flex-wrap gap-3'>
        <Button
          type='button'
          size='lg'
          disabled={isGenerateDisabled}
          onClick={onGenerate}
        >
          <Sparkles className={isGenerating ? 'animate-pulse' : ''} />
          {isGenerating ? 'Generating MP3...' : 'Generate speech'}
        </Button>

        <Button
          type='button'
          size='lg'
          variant='outline'
          disabled={isGenerating || text.length === 0}
          onClick={onReset}
        >
          <RotateCcw />
          Reset
        </Button>
      </div>
    </div>
  )
}
