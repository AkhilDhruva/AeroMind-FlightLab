# AeroMind — Drone Avionics Training Simulator

A 3D drone training simulator that teaches new operators **pitch, roll, yaw, throttle, telemetry literacy, and safe operating behavior** before they ever touch real hardware. Every control input becomes a visible, explained lesson.

> Educational civilian flight-training simulation — not a real drone control system.

![status](https://img.shields.io/badge/build-prototype-3fa9ff) ![stack](https://img.shields.io/badge/3D-Three.js-36e0c8) ![license](https://img.shields.io/badge/license-MIT-8ea3bf)

---

## ✦ Live demo

The prototype is a single self-contained HTML file — **no build step, no install.**

- **Run locally:** open `index.html` in any modern browser.
- **Deploy:** drag this folder into [Vercel](https://vercel.com), [Netlify](https://netlify.com), or enable GitHub Pages. It is a static site; no configuration needed.
- **Full guide:** see **[`DEPLOYMENT.md`](DEPLOYMENT.md)** for step-by-step deploy paths, pre/post-deploy checklists, an offline (CDN-free) fallback, and troubleshooting.

```bash
# optional: run a local server (nicer than file://)
npx serve .
# then open the printed http://localhost:3000
```

---

## ✦ What it does

| Pillar | In the simulator |
|---|---|
| Beginner-friendly explanations | Plain-language concept card on every module |
| Interactive 3D demonstrations | Rendered quadcopter, training field, real-time flight |
| Visual cause-and-effect learning | Movement/thrust arrows, tilt + angle readouts, rings that light up |
| **Input → Physics → Explanation** | Live feed narrates *what just happened* on every keypress |
| HUD / telemetry literacy | Altitude, speed, heading, battery, GPS, signal, wind, mode + colour-coded warnings |
| Safety-first behavior | Forgiving stabilised flight; smoothness is scored, not speed |
| Scenario-based learning | Low battery, wind drift, signal loss, Return-to-Home |
| Mistake feedback & assessment | Auto-detected objectives, stability score, letter-grade debrief |
| Procedural audio | Throttle-linked motor bed, arming, ring/objective chimes, low-battery & RTH alerts — all Web Audio, no assets |
| Controller support | Gamepad auto-detected; analog sticks map to a real transmitter layout, keyboard always works |
| Premium feel | Boot/arming sequence, hover bob, rotor wash, rim lighting, animated objective completions |
| Comfort & access | Mute, volume, reduced-motion toggle, replayable onboarding, full keyboard help — preferences persist |

---

## ✦ Controls

Both keyboard and gamepad work simultaneously. A connected controller maps to a real
transmitter layout (left stick = throttle/yaw, right stick = pitch/roll) and gives smooth
analog input; the keyboard gives full-deflection digital input.

| Key | Action | Behavior |
|---|---|---|
| `W` / `S` | Pitch | Nose dips & moves forward / lifts & moves back |
| `A` / `D` | Roll | Banks & strafes left / right (no turn) |
| `Q` / `E` | Yaw | Rotates left / right in place |
| `Space` / `Shift` | Throttle | Climb / descend |
| `H` | Mode | Toggle stabilisation vs. manual |
| `R` | Reset | Return to pad, full battery |
| `C` | Camera | Chase → orbit → top-down |
| `M` | Mute | Toggle all sound |
| `?` | Help | Controls & telemetry overlay |
| `P` | Settings | Sound, volume, reduced motion, onboarding |
| `Esc` | Close | Dismiss any open overlay |

| Gamepad | Action |
|---|---|
| Left stick | Throttle (Y) · Yaw (X) |
| Right stick | Pitch (Y) · Roll (X) |
| Triggers | Fine throttle |
| A · B · Y / Start | Stabilise toggle · Reset · Cycle camera |

Mouse: in **Anatomy** mode, click drone parts to inspect them.

> **Safety failsafe.** When battery gets critical or the control link is lost, the aircraft
> sounds an alert and **automatically engages Return-to-Home**, flying itself back to the
> launch pad and landing — pilot input is locked out so the failsafe can finish, exactly as
> on real hardware.

---

## ✦ Training modules

`Anatomy → Throttle → Pitch → Roll → Yaw → Combined Mission → Avionics → Failure Scenarios`

Each module has a concept card, an auto-detected mission, a stability score, and a debrief. See **[`case-study.md`](case-study.md)** for the product story and **[`docs/AeroMind_Design_and_Case_Study.md`](docs/AeroMind_Design_and_Case_Study.md)** for the full design specification.

---

## ✦ Project structure

```
aeromind-drone-simulator/
├── index.html        # the simulator (self-contained, Three.js via CDN)
├── README.md         # this file
├── case-study.md     # portfolio case study (the product story)
├── assets/
│   ├── screenshots/  # drop captured screenshots here
│   └── preview.svg   # social/preview poster (replace with preview.gif when recorded)
├── docs/
│   └── AeroMind_Design_and_Case_Study.md   # full design specification
└── dev/
    └── _check.js     # extracts the inline script and runs `node --check`
```

---

## ✦ Scaling to a production stack

The prototype is intentionally dependency-free. When you want a maintainable codebase, migrate to:

**React + TypeScript + Vite · React Three Fiber + Drei · Rapier physics · Zustand · Tailwind CSS · Blender (glTF) · GitHub → Vercel**

Suggested components mirror the prototype's internal regions: `SimulatorScene`, `DroneModel`, `HUD`, `ControllerPanel`, `LessonPanel`, `ExplanationFeed`, `MissionBar`, `TrainingOverlay`. Keep lesson content as reusable data so adding a module is a data change, not new rendering code. Full build order in the design doc.

---

## ✦ Development

```bash
node dev/_check.js   # syntax-check the simulator's inline JavaScript
```

---

## ✦ Scope & honesty

AeroMind teaches lawful, safety-first operation of standard consumer/commercial drones. It deliberately excludes tactical, weaponised, surveillance, or unauthorized-operation use cases. The physics are a *training abstraction* tuned for learning clarity — the goal is correct intuition and safe habits, not engineering-accurate flight modelling.

## License

MIT — free to use, learn from, and adapt.
