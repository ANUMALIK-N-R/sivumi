REAL MODEL FILE REQUIRED — NO PLACEHOLDER IS INCLUDED

Download after accepting Google's Gemma license:
Repository: litert-community/gemma-3-270m-it
File: gemma3-270m-it-q8.litertlm
Approximate file size: 304 MB

Place it exactly here:
android/app/src/main/assets/models/gemma3-270m-it-q8.litertlm

The Gradle preBuild verification deliberately FAILS if the model is missing
or smaller than 250,000,000 bytes. This prevents creating an APK that only
pretends to include Gemma.
