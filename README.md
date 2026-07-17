# Browser Speech Studio

A privacy-friendly, browser-based speech workspace built with Next.js. Transcribe English audio with Whisper, convert text back to speech, preview the generated result, and download it as an MP3 — without running AI inference on an application server.

> Speech-to-text and text-to-speech inference run in Web Workers with Transformers.js and ONNX Runtime Web. Model files are downloaded by the browser on first use and may be reused from the browser cache.

## Live Demo

[https://browser-speech-studio.vercel.app/](https://browser-speech-studio.vercel.app/)

## Features

- English speech-to-text with `Xenova/whisper-tiny.en`
- English text-to-speech with `Xenova/mms-tts-eng`
- Browser-side AI inference using Web Workers
- Audio input from a URL or microphone recording
- Reuse the latest transcript as TTS input
- Client-side MP3 encoding and download
- Model-loading progress indicators
- Responsive interface built with Tailwind CSS and shadcn/ui
- No application API key or inference server required
- Compatible with Vercel deployment

## Screenshots

Add a screenshot to `public/browser-speech-studio.png`, then uncomment the following line:

<!-- ![Browser Speech Studio](./public/browser-speech-studio.png) -->

## How It Works

### Speech to Text

1. The user loads or records audio.
2. The browser decodes the audio and converts it to the format expected by Whisper.
3. A dedicated Web Worker loads `Xenova/whisper-tiny.en` through Transformers.js.
4. The transcript is returned to the React interface.

### Text to Speech

1. The user enters English text or reuses the latest transcript.
2. A separate Web Worker loads `Xenova/mms-tts-eng`.
3. The model generates a mono PCM waveform.
4. `@breezystack/lamejs` encodes the waveform as a 128 kbps MP3.
5. The browser creates a temporary Blob URL for preview and download.

## Architecture

```text
React UI
├── Speech to Text
│   ├── AudioManager
│   ├── useTranscriber
│   └── Whisper Web Worker
└── Text to Speech
    ├── TextToSpeech
    ├── TtsInputPanel
    ├── TtsOutputPanel
    ├── useTextToSpeech
    └── TTS Web Worker
        ├── Transformers.js / ONNX Runtime Web
        └── MP3 encoder
```

## Technology Stack

- Next.js with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui and Radix UI
- Transformers.js
- ONNX Runtime Web
- Web Workers
- `@breezystack/lamejs`
- Lucide React

## Requirements

- Node.js 20 or later is recommended
- npm
- A current desktop browser with WebAssembly and Web Worker support
- Internet access on first model load
- Microphone permission when using audio recording

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Mohammad-Ebrahimiyan/browser-speech-studio.git
cd browser-speech-studio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
```

- `npm run dev`: starts the development server
- `npm run lint`: runs ESLint against source files
- `npm run typecheck`: runs TypeScript without emitting files
- `npm run build`: creates a production build
- `npm run start`: starts the production server after a successful build

## Usage

### Create a transcript

1. Load an English audio URL or record audio with the microphone.
2. Wait for the speech-recognition model to become ready.
3. Select **Transcribe**.
4. Read the generated transcript in the transcription panel.

### Generate speech

1. Wait for the TTS model to become ready.
2. Enter English text, or select **Use transcription**.
3. Select **Generate speech**.
4. Preview the result in the audio player.
5. Select **Download MP3** to save the file.

## Important Browser Notes

- The first visit can take longer because the browser must download the model files.
- Model loading and inference speed depend on the user's CPU, memory, browser, and network.
- ONNX Runtime may print harmless graph-optimization warnings while loading a model.
- A missing `Content-Length` response header can cause Transformers.js to expand its download buffer dynamically; this does not necessarily indicate a failed download.
- Recording requires a secure context. The live Vercel deployment uses HTTPS, while browsers also allow microphone access on `localhost` during development.
- The application currently supports English STT and English TTS.

## Privacy

Audio processing, transcription, speech synthesis, and MP3 encoding run in the browser. The application does not send the user's text or decoded audio to a custom application backend. The browser still downloads model assets from Hugging Face during model loading.

## Acknowledgements

- [Hugging Face Transformers.js](https://huggingface.co/docs/transformers.js/)
- [Xenova Whisper Tiny English](https://huggingface.co/Xenova/whisper-tiny.en)
- [Xenova MMS TTS English](https://huggingface.co/Xenova/mms-tts-eng)
- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
