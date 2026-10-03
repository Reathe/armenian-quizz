# Learn the Armenian Alphabet

> A lightweight, installable web app (PWA) for learning the 39 letters of the Eastern Armenian alphabet
> (Այբուբեն, *Aybuben*). Explore every letter with its sounds and handwritten form, then test yourself with
> configurable quizzes.

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?logo=bootstrap&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-offline_ready-5A0FC8?logo=pwa&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

### 🔗 Live at [**hay.rafserver.com**](https://hay.rafserver.com)

## Features

### 📖 Alphabet explorer (`/aybuben`)

A grid of all 39 letters. Click a letter to open a card with:

- uppercase and lowercase forms
- Latin transcription (e.g. `Ժ ժ → [zh]`)
- the **handwritten** form (SVG)
- an **audio recording** of its pronunciation

### ❓ Quiz (`/quiz`)

Multiple-choice questions (4 answers) where you choose both the **question type** and the **answer type**,
from *uppercase*, *lowercase*, *handwritten*, *transcription* and *pronunciation*. For example:
"hear a sound → pick the letter" or "see a handwritten letter → pick its transcription".

- **Random** mode picks a pair that makes sense: one "letter" category (uppercase, lowercase, handwritten)
  is always paired with one "meaning" category (transcription, pronunciation, handwritten).
- After each answer, a card shows every representation of the correct letter.

### 📱 Progressive Web App

- **Installable** on mobile and desktop (web manifest and icons)
- **Works offline**: on install, the service worker pre-caches the pages, scripts, styles, alphabet data,
  handwritten SVGs and all 39 audio files (converting partial `206` audio responses so they can be cached)
- **Dark mode** toggle, remembered across visits
- Responses are compressed with `Flask-Squeeze`

## Getting started

### Run with Python

```bash
git clone https://github.com/Reathe/armenian-quizz
cd armenian-quizz
pip install -r requirements.txt
python src/app.py                           # production server (Waitress) on http://localhost:8080
FLASK_ENV=development python src/app.py     # Flask dev server with auto-reload
```

### Run with Docker

```bash
docker compose up --build                   # builds the image and serves on http://localhost:8080
```

or with the published image (built for `linux/arm64`):

```bash
docker run -p 8080:8080 reathe/armenian-alphabet
```

### Building and publishing the image

`make-docker.ps1` builds, pushes and/or runs the image (it builds for `linux/arm64`):

```powershell
./make-docker.ps1 -build -push latest      # build and push reathe/armenian-alphabet:latest
./make-docker.ps1 -build -run              # build and run the :dev tag locally
```

## Architecture

```
src/
├── app.py                 # Flask app: routes, alphabet data, /get_alphabet JSON API, PWA endpoints
├── templates/             # Jinja2 templates (base layout, alphabet grid, quiz)
└── static/
    ├── js/
    │   ├── aybuben.js     # Alphabet grid and letter details card
    │   ├── quiz.js        # Question generation, category pairing, answer checking
    │   └── utils.js       # Rendering SVG / audio, fetching the alphabet
    ├── service-worker.js  # Offline caching strategy
    ├── manifest.json      # PWA manifest
    ├── handwritten/       # 39 handwritten letter SVGs
    └── sounds/            # 39 pronunciation recordings
```

The server keeps the alphabet as a single data structure and exposes it through `/get_alphabet`. All quiz
logic runs client-side in vanilla JavaScript, so once the data is cached the app needs no network at all.
