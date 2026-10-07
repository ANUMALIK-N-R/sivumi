# Build Sivumi as a completely offline Android app with Gemma 3 270M

This project uses the existing React/Vite Sivumi UI plus a native Android
WebView bridge. Gemma inference runs natively through Google's LiteRT-LM.
There is no `INTERNET` permission in `AndroidManifest.xml`.

## 1. Obtain the real Gemma model (required)

Google's Gemma model files are gated by the Gemma license, so the model is not
redistributed in this source ZIP. Sign in to Hugging Face, accept the Gemma
terms, then download this official LiteRT Community file:

- Repository: `litert-community/gemma-3-270m-it`
- File: `gemma3-270m-it-q8.litertlm`
- Expected size: about 304 MB

Copy it to exactly:

`android/app/src/main/assets/models/gemma3-270m-it-q8.litertlm`

The Android Gradle build intentionally fails if that file is missing or less
than 250,000,000 bytes. Do not create a zero-byte placeholder.

## 2. Build the web UI

From the project root:

```bash
bun install
bun run build
bun run android:assets
```

The last command copies the actual Vite `dist/` output into:

`android/app/src/main/assets/www/`

## 3. Open Android Studio

Open the `android/` folder as the Android Studio project.

Recommended build setup:

- Android Studio 2026.x
- Gradle JDK: 21
- Android SDK / compile SDK: 37
- Physical ARM64 Android device

The project uses:

- Android Gradle Plugin 9.4.0
- Kotlin 2.4.10
- LiteRT-LM Android 0.17.1
- CPU backend for Gemma 3 270M

## 4. Build the debug APK

In Android Studio use **Build > Build APK(s)**, or if you have a Gradle 9.6
installation/wrapper available:

```bash
cd android
gradle assembleDebug
```

Expected APK location:

`android/app/build/outputs/apk/debug/app-debug.apk`

Because the model is bundled, expect the APK to be hundreds of MB.

## Runtime privacy/offline guarantees in this source

- No `android.permission.INTERNET`
- No Gemini API
- No Ollama / LM Studio HTTP requests
- No WebLLM runtime model download
- No Google Fonts/CDN
- Gemma model comes from APK assets and is copied to private app storage
- Wellness/chat state remains in WebView local storage

## Why CPU is the default

The generic `gemma3-270m-it-q8.litertlm` model is used with LiteRT-LM's CPU
backend for broad compatibility. Do not switch this build to GPU without
retesting the current LiteRT-LM/model combination on your target device.
