# Browser Speech Studio

A privacy-friendly, browser-based speech workspace built with Next.js. Transcribe English audio with Whisper, convert text back to speech, preview the generated result, and download it as an MP3 — without running AI inference on an application server.

> Speech-to-text and text-to-speech inference run in Web Workers with Transformers.js and ONNX Runtime Web. Model files are downloaded by the browser on first use and may be reused from the browser cache.

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

## Demo

Live demo: `https://YOUR_VERCEL_PROJECT.vercel.app`

Replace the URL above after your first Vercel deployment.

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

- Next.js 15 with App Router
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
git clone https://github.com/YOUR_GITHUB_USERNAME/browser-speech-studio.git
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

## Deployment on Vercel

This project does not require a server-side inference API or environment variables. AI inference and MP3 encoding happen in the user's browser.

### Deploy from GitHub

1. Push this repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) with GitHub.
3. Select **Add New Project**.
4. Import the `browser-speech-studio` repository.
5. Keep the detected framework as **Next.js**.
6. Keep the repository root as the Root Directory.
7. Use `npm install` as the Install Command, or leave the detected default.
8. Use `npm run build` as the Build Command, or leave the detected default.
9. Do not set an Output Directory.
10. No environment variables are required.
11. Select **Deploy**.

Every push to the production branch can trigger a production deployment, while other branches and pull requests can receive preview deployments.

### Deploy with the Vercel CLI

```bash
npm install --global vercel
vercel
```

For a production deployment:

```bash
vercel --prod
```

## Vercel Configuration

A `vercel.json` file is not required. Vercel detects Next.js automatically.

Recommended project settings:

```text
Framework Preset: Next.js
Root Directory: ./
Install Command: npm install
Build Command: npm run build
Output Directory: leave empty
Node.js Version: 20.x or newer supported version
Environment Variables: none
```

## Important Browser Notes

- The first visit can take longer because the browser must download the model files.
- Model loading and inference speed depend on the user's CPU, memory, browser, and network.
- ONNX Runtime may print harmless graph-optimization warnings while loading a model.
- A missing `Content-Length` response header can cause Transformers.js to expand its download buffer dynamically; this does not necessarily indicate a failed download.
- Recording requires a secure context. Production Vercel deployments use HTTPS, while browsers also allow microphone access on `localhost` during development.
- The application currently supports English STT and English TTS.

## Privacy

Audio processing, transcription, speech synthesis, and MP3 encoding run in the browser. The application does not send the user's text or decoded audio to a custom application backend. The browser still downloads model assets from Hugging Face during model loading.

## Model and License Notice

The source code in this repository can be distributed under the MIT License included in `LICENSE`.

The AI models are separate works and remain subject to their own licenses:

- `Xenova/whisper-tiny.en`: see its Hugging Face model page and upstream model license.
- `Xenova/mms-tts-eng`: an ONNX-compatible conversion of Meta's MMS English TTS checkpoint.
- Meta MMS TTS is published under `CC-BY-NC-4.0`, which restricts commercial use.

Review every model license before using this application commercially. The repository's MIT License does not replace or override model licenses.

## Repository Hygiene

Do not commit the following generated or local files:

- `.next/`
- `node_modules/`
- local environment files such as `.env.local`
- build output
- editor and operating-system metadata

The included `.gitignore` covers these paths.

## Security

- Do not commit API tokens or private keys.
- This version does not require a Hugging Face token.
- Enable Dependabot alerts, secret scanning, and push protection in the GitHub repository settings when available.
- Report security issues privately instead of opening a public issue with sensitive details.

## Roadmap

- Optional additional English voices
- Optional multilingual TTS models with compatible browser-ready ONNX weights
- Cancellation for long-running generation
- Audio-history management
- Automated browser tests
- GitHub Actions for lint, type-checking, and production builds

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes.
4. Run lint, type-checking, and a production build.
5. Open a pull request with a clear description.

```bash
npm run lint
npm run typecheck
npm run build
```

## Acknowledgements

- [Hugging Face Transformers.js](https://huggingface.co/docs/transformers.js/)
- [Xenova Whisper Tiny English](https://huggingface.co/Xenova/whisper-tiny.en)
- [Xenova MMS TTS English](https://huggingface.co/Xenova/mms-tts-eng)
- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)

## License

The application source code is available under the MIT License. Model files and third-party packages are governed by their respective licenses.
