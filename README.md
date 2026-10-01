# Wood Block Puzzle 3D V2

Versi baru memakai mekanik **falling block**: balok muncul dari atas dan turun otomatis. Tidak ada drag & drop.

## Kontrol
- ← / → : geser
- ↑ : putar
- ↓ : soft drop
- Space : hard drop
- P / tombol Pause : jeda
- Tombol layar tersedia untuk HP

## Fitur
- Suara menggunakan Web Audio API, tanpa file audio eksternal
- Efek visual glass/neon dan balok pseudo-3D
- Ghost piece
- Score, best score, level, lines, combo
- Next piece
- Responsive mobile
- PWA manifest
- GitHub Pages workflow
- GitHub Actions untuk APK Capacitor

## APK
Workflow `.github/workflows/main.yml` memakai Node 22 dan Java 21, sesuai kebutuhan Capacitor Android yang digunakan proyek ini.

## Web
Aktifkan GitHub Pages dengan source **GitHub Actions** di Settings > Pages. Workflow `web.yml` akan deploy versi web setiap push ke `main`.
