# Sapehive — Music Assets

Drop your `.mp3` soundtrack files here.

## YC Journey Section (Two-Track System)

The YC section uses exactly **two** tracks that alternate in a continuous loop.
Name your files exactly as shown:

```
public/assets/music/yc-track-1.mp3   ← First track
public/assets/music/yc-track-2.mp3   ← Second track
```

**Behavior:**
- Track 1 plays → 1-second gap → Track 2 plays → 1-second gap → Track 1 again...
- Loops forever while the YC section is open
- Smooth 2-second fade-in / 1.4-second fade-out transitions
- Automatically stops when leaving the YC section
- If files are missing, the player shows a friendly error (no crash)

**Track URLs are configured in:**
`app/hooks/use-yc-dual-audio.ts` → `YC_TRACK_URLS`

---

## Ambient Player (Portal-wide)

The floating ambient player in the portal sidebar supports additional tracks.
Configure them in: `app/hooks/use-music-player.ts` → `AMBIENT_TRACKS`

Set `url: "/assets/music/your-file.mp3"` to activate a track.
Set `url: null` to mark it as coming soon (player skips it gracefully).

---

*Files placed here are served statically. No build step required.*
