# Sivumi — Fully Offline Gemma 3 270M Android Source

This version converts the Google AI Studio React/Vite project into an Android
source project with a native **Gemma 3 270M IT** bridge using Google LiteRT-LM.

The runtime is designed to be completely offline: the Android manifest does
not request Internet permission and there are no cloud-AI/network fallbacks.

## Important: model license

The actual Gemma weight file is **not included in this ZIP** because access to
Gemma weights requires the user to accept Google's Gemma terms. This package
does not bypass that gate.

After accepting the terms, place the real official file:

`gemma3-270m-it-q8.litertlm` (~304 MB)

at:

`android/app/src/main/assets/models/gemma3-270m-it-q8.litertlm`

The Gradle build rejects missing or placeholder model files.

See **BUILD_ANDROID_OFFLINE.md** for the exact build steps.
