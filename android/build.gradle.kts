buildscript {
    dependencies {
        // AGP built-in Kotlin normally uses its bundled KGP version.
        //
        // LiteRT-LM 0.17.1 was compiled with Kotlin 2.4 metadata,
        // so explicitly upgrade the Kotlin Gradle Plugin used by
        // AGP built-in Kotlin.
        classpath(
            "org.jetbrains.kotlin:kotlin-gradle-plugin:2.4.20"
        )
    }
}

plugins {
    // AGP 9.3.1 is within Kotlin 2.4.20's fully supported range.
    id("com.android.application") version "9.3.1" apply false
}
