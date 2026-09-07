# Fletchvale

A colorful kid-friendly archery adventure: campaign levels, free play, a bow shop paid with coins, and sound settings.

The name is **Fletchvale** — a sunny valley where every shot starts with a nocked arrow and a little bit of luck.

## Play

- Bright, easy-to-read menu: Levels, Free Play, Shop, Sound.
- **15 levels** in three worlds (Sunny Meadow, Riverside, Moonlit Forest). Beat one to unlock the next.
- Targets **react as soon as you draw**, but they stay in their own circle so every stage stays completable.
- Layouts change each retry, and every level is a different setup.
- **Coins:** first clears pay well. Replays and Free Play pay less. Better bows get expensive so you want to push the campaign.
- **Bow shop with pictures:** the starter bow only shows tiny trajectory dots. Better bows show more of the arc and hit harder.
- **Free Play:** targets come one after another so you can practice. Fewer coins than levels.
- Music and SFX sliders, plus hit/coin/win animations.

## Run it

```bash
npm install
npm run dev
```

The game opens at `http://localhost:45447`. Progress stays in the browser `localStorage`.

```bash
npm run build
npm run preview
```

## Android APK

Public download (about 72 hours): https://litter.catbox.moe/wc04i2.apk  
Backup page: https://gofile.io/d/wBOygbm3

Local signed build: `public/Nyilvolgy.apk` (or `android/app/build/outputs/apk/release/app-release.apk` after `npm run apk`).

On a phone: allow installs from unknown sources, then open the file. Package: `hu.nyilvolgy.jatek`, Android 7+.

```bash
export ANDROID_HOME=$HOME/android-sdk
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
npm run apk
```
