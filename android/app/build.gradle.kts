plugins {
    id("com.android.application")
}


android {

    namespace = "com.sivumi.offline"

    compileSdk = 36


    defaultConfig {

        applicationId = "com.sivumi.offline"

        minSdk = 26
        targetSdk = 35

        versionCode = 1
        versionName = "1.0-gemma270m"


        ndk {
            abiFilters += listOf(
                "arm64-v8a"
            )
        }
    }


    buildTypes {

        debug {
            isMinifyEnabled = false
        }


        release {

            isMinifyEnabled = true

            proguardFiles(
                getDefaultProguardFile(
                    "proguard-android-optimize.txt"
                ),
                "proguard-rules.pro"
            )
        }
    }


    compileOptions {

        sourceCompatibility =
            JavaVersion.VERSION_17

        targetCompatibility =
            JavaVersion.VERSION_17
    }


    androidResources {

        /*
         * Gemma .litertlm model should remain
         * uncompressed inside the APK.
         */
        noCompress += "litertlm"
    }


    packaging {

        /*
         * Modern AGP native-library packaging.
         */
        jniLibs {
            useLegacyPackaging = false
        }
    }
}


dependencies {

    implementation(
        "androidx.core:core-ktx:1.17.0"
    )

    implementation(
        "androidx.webkit:webkit:1.14.0"
    )

    implementation(
        "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.10.2"
    )

    /*
     * Google LiteRT-LM runtime.
     */
    implementation(
        "com.google.ai.edge.litertlm:litertlm-android:0.17.1"
    )
}


// ============================================================
// Gemma model
// ============================================================

val gemmaModel =
    layout.projectDirectory.file(
        "src/main/assets/models/" +
        "gemma3-270m-it-q8.litertlm"
    ).asFile


// ============================================================
// Verify Gemma model
// ============================================================

val verifyGemmaModel =
    tasks.register(
        "verifyGemmaModel"
    ) {

        group = "verification"

        description =
            "Verify the real Gemma 3 270M Q8 model."


        doLast {

            if (!gemmaModel.exists()) {

                throw GradleException(
                    """
                    Missing Gemma model.

                    Expected:

                    ${gemmaModel.absolutePath}

                    Required filename:

                    gemma3-270m-it-q8.litertlm
                    """.trimIndent()
                )
            }


            val size =
                gemmaModel.length()


            if (size < 250_000_000L) {

                throw GradleException(
                    """
                    Gemma model is too small.

                    Actual:
                    $size bytes

                    Expected:
                    approximately 304 MB.

                    The real Gemma 3 270M Q8
                    LiteRT-LM model is required.
                    """.trimIndent()
                )
            }


            println(
                "Gemma model verified successfully:"
            )

            println(
                gemmaModel.absolutePath
            )

            println(
                "Model size: $size bytes"
            )
        }
    }


// ============================================================
// Verify model before Android build
// ============================================================

tasks.named(
    "preBuild"
).configure {

    dependsOn(
        verifyGemmaModel
    )
}
