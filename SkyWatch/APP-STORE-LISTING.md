# App Store listing — SkyWatchNEO 1.0.0

Copy-paste source for App Store Connect. Keep this in step with the app: if a feature changes, the
description changes with it. Character limits are Apple's and are enforced on paste.

---

## App Information (app-level, sidebar)

**Name** (30 max)
```
SkyWatchNEO
```

Optional discovery-friendly alternative — the App Store indexes the name, so a descriptor here does
real work:
```
SkyWatchNEO: Asteroid Tracker
```

**Subtitle** (30 max)
```
Near-Earth asteroid flybys
```

**Category**
- Primary: **Education**
- Secondary: **Reference**

Education fits because the Learn section and the hazard explanations are a real part of the app, not
a footnote. Reference is the natural second.

**Content Rights** — Yes, contains/shows/accesses third-party content, and you confirm you have the
rights. NASA's NeoWs data is US-government public data, free to use.

**Age Rating** — answer every question **None** / **No**. Result: **4+**.

**Copyright**
```
2026 Austin Zurbuchen
```

---

## Privacy (sidebar → App Privacy)

**Privacy Policy URL**
```
https://austinzurbuchen.github.io/sky-watch/privacy.html
```

**Data collection** — *"No, we do not collect data from this app."*

True as built: no accounts, no analytics SDK, no ads, no identifiers. NASA requests carry only a date
range and the API key. The watchlist and settings live in on-device storage and are never
transmitted.

---

## Version 1.0.0

**Promotional Text** (170 max — editable later without a new build)
```
See which near-Earth asteroids pass this week, using live NASA data. Follow the ones you care about, and get a heads-up only on days with a potentially hazardous flyby.
```

**Keywords** (100 max, comma-separated, no spaces after commas)

If you keep the name **SkyWatchNEO**:
```
NEO,space,astronomy,meteor,comet,orbit,tracker,science,planetary,impact,PHA,stargazing,cosmos
```

If you use the alternative name **SkyWatchNEO: Asteroid Tracker**, drop `tracker` — it's already in
the name and would be a wasted slot — and spend it elsewhere:
```
NEO,space,astronomy,meteor,comet,orbit,science,planetary,impact,PHA,stargazing,cosmos,telescope
```

Both deliberately avoid repeating words already in the name and subtitle. Apple indexes those
fields, so "asteroid", "near-earth" and "flyby" here would be wasted characters.

**Description** (4000 max)
```
SkyWatchNEO shows you which near-Earth asteroids are passing by this week, using live data from NASA's Center for Near Earth Object Studies.

A WEEK AT A GLANCE
Scroll the day strip to see what's coming. Days with a potentially hazardous flyby are marked, and running counts show the totals for the week, for today, and how many are flagged as hazardous.

EVERY FLYBY, DAY BY DAY
Pick any day to see the objects passing that day — each with its closest-approach time, estimated diameter, miss distance, and whether NASA classifies it as potentially hazardous.

FULL DETAIL ON ANY OBJECT
Tap through for miss distance, relative velocity, estimated diameter range, absolute magnitude, and orbit class.

A WATCHLIST THAT STICKS
Save the objects you want to follow. Saved asteroids stay readable even after they drop out of the current week's window.

QUIET, USEFUL ALERTS
Turn on hazard notifications and you'll get a single morning heads-up only on days when a potentially hazardous asteroid is passing. No daily noise, no badge spam.

LEARN WHAT THE NUMBERS MEAN
Plain-language explanations of what "potentially hazardous" actually means, why astronomers measure these distances in lunar distances, and how close a close approach really is.

MEASURED YOUR WAY
Switch between lunar distances (LD) and kilometers, and choose how much of the past week to include.

PRIVATE BY DEFAULT
No account. No sign-up. No analytics, no tracking, no ads. Your watchlist and settings never leave your device.

ABOUT THE DATA
Flyby data comes from NASA's public NeoWs API. "Potentially hazardous" is NASA's own classification for objects whose orbits bring them within 0.05 AU of Earth's orbit and that are larger than roughly 140 meters. It is a monitoring category, not a prediction of impact — most of these objects pass millions of kilometers away.

SkyWatchNEO is an independent app. It is not affiliated with, endorsed by, or sponsored by NASA.
```

**Support URL**
```
https://austinzurbuchen.github.io/sky-watch/
```

**Marketing URL** — leave blank.

**What's New** — not required for a first release.

**Version Release** — "Manually release this version" if you want to pick the moment; otherwise
automatic on approval.

---

## App Review Information

**Sign-in required:** No — leave the demo account fields empty.

**Notes**
```
No account or sign-in is required. All features are available immediately on launch.

Data source: NASA's public NeoWs API (https://api.nasa.gov). The app is independent and not affiliated with NASA.

Testing hazard notifications: Settings > Hazard notifications. Notifications are scheduled for 9:00 AM local time, and only on days when a potentially hazardous asteroid is passing, so one may not arrive during a short review session. This is intended behavior, not a defect. All other features work immediately.

The optional "NASA API Key" field in Settings > Advanced lets a user supply their own key if they hit NASA's public rate limit. It is not required — the app ships with a working key.
```

That third paragraph matters: without it a reviewer who toggles notifications, sees nothing, and
marks the feature broken.

---

## Screenshots

Upload the four in `screenshots/1.0.0/iPhone 16 Pro Max/` under the **6.9" iPhone** size. No iPad set
is needed — `ios.supportsTablet` is unset, so the app is iPhone-only.

---

## Wording rules to keep

NASA data is free to use, but the listing must never imply NASA endorses or produced this app.

- Attribution is fine: "data from NASA's NeoWs API", "NASA's Center for Near Earth Object Studies".
- Never: "official", NASA's logo or insignia anywhere in the icon or screenshots, or leading the app
  name with NASA.
- The non-affiliation line at the end of the description is deliberate — keep it.
