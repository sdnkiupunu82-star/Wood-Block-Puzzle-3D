# Wood Block Puzzle 3D V1

Proyek game puzzle 8x8, tampilan 3D/rounded, drag-drop, clear baris/kolom, score, best score, undo, game over, responsive web, PWA manifest, dan konfigurasi Capacitor Android.

## Web
Buka `index.html` atau jalankan `python -m http.server 8080` lalu buka http://localhost:8080.

## Android APK lewat GitHub Actions
Upload isi ZIP ini ke repository GitHub. Workflow `.github/workflows/android.yml` akan membuat folder `www`, memasang Capacitor Android, lalu membangun APK debug. Hasilnya dapat diambil pada **Actions > Build Android APK > Artifacts**.

## Build lokal
Node 20+, Java 17, Android SDK diperlukan.

```bash
npm install
mkdir -p www
cp index.html style.css game.js manifest.webmanifest www/
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug --no-daemon
```
APK: `android/app/build/outputs/apk/debug/app-debug.apk`
