# Sapehive Soundtrack Files

Place your `.mp3` soundtrack files in this folder.

## Expected files

| Filename           | Description                          |
|--------------------|--------------------------------------|
| `yc-theme.mp3`     | Main YC Journey cinematic soundtrack |
| `founder-mode.mp3` | Focus / deep work session music      |
| `deep-work.mp3`    | Late-night coding atmosphere         |

## How to add music

1. Drop your `.mp3` file here (e.g. `yc-theme.mp3`)
2. The app will automatically detect and use it
3. If a file is missing, the app falls back gracefully — no crashes

## Track configuration

Edit `app/data/portal-data.ts` → `MUSIC_TRACKS` array to add or rename tracks.
The `url` field should be `/assets/music/your-file.mp3` for local files.
