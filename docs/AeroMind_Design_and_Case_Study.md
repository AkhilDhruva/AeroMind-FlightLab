# AeroMind — Drone Avionics Training Simulator

### Design specification & portfolio case study

> AeroMind is a 3D drone avionics training simulator that helps new operators understand flight controls, telemetry, and safety behavior before interacting with real drone hardware. It turns pitch, roll, yaw, throttle, and avionics data into visible, interactive lessons — reducing training risk while building operator confidence.

This document is the design backbone for the project and a ready-to-paste portfolio case study. It is paired with a working prototype, `AeroMind.html`, that you can open in any modern browser. Throughout, *the prototype* refers to that file, and design choices are tied back to what it already demonstrates.

---

## 1. Training goal

The goal is not "fly a drone game." It is to make a beginner understand *why a drone moves the way it moves* so that their first real flight is informed rather than improvised.

A trainee who completes AeroMind should be able to do five things. First, explain what each control axis does and, just as important, what it does *not* do — for example, that yaw changes where the aircraft faces, not where it goes. Second, predict the aircraft's behavior before moving a stick, because they have internalised the "tilt first, then move" relationship at the heart of multirotor flight. Third, read a telemetry HUD and say out loud what the battery, GPS, signal, heading, altitude, and wind values mean for the safety of the current flight. Fourth, recognise the early signs of a failure — drift, sag, link degradation — and respond with smooth, corrective input instead of panic. Fifth, trust and observe automated failsafes such as Return-to-Home rather than fighting them.

The measurable training objective is a shift from *button knowledge* ("I know which stick is throttle") to *behavioral understanding* ("I know what happens to lift, attitude, and battery when I move it, and what I should watch while I do"). Every design decision below serves that single outcome.

---

## 2. Learner profile

The primary learner is a **complete or near-complete beginner**: a hobbyist about to buy their first drone, a new commercial operator preparing for certification, an enterprise field technician being cross-trained onto drone inspection, or a student in an aviation, robotics, or defense-adjacent program. They are motivated and technically curious but have little or no stick time, and a real crash would cost them money, confidence, or both.

Three characteristics shape the design. They learn best from **cause and effect they can see**, not from manuals — so the simulator narrates the physics of every input in plain language. They are **risk-averse and easily discouraged** by early failure, so the default flight mode is forgiving (auto-stabilised, altitude-holding) and mistakes are framed as lessons, never as "game over." And they have **limited working memory for jargon**, so terminology (IMU, ESC, ATTI mode, RTH) is introduced one piece at a time, always attached to a visible consequence.

A secondary learner is the **training designer, instructor, or recruiter** evaluating the product itself. The interface is therefore legible as a *training system*: objectives, scoring, scenario selection, and feedback are visible on screen, so an observer immediately understands the pedagogy, not just the graphics.

---

## 3. Simulator modules

AeroMind is organised as a progression of self-contained modules. Each is selectable from the bottom navigation bar in the prototype, and each owns its own scene props, objectives, and feedback. The order is deliberate: understand the machine, then each axis in isolation, then all axes together, then the instruments, then failure.

**Module 00 — Drone Anatomy.** A clickable inspection view. The learner orbits the aircraft and selects components (flight controller, battery, motor + ESC, propeller, camera gimbal) to read a one-line explanation of each. This teaches the machine before the movement, so later lessons can refer to "the rear rotors" or "the IMU" and mean something.

**Module 01 — Throttle (lift).** Isolates vertical control. The learner takes off, holds a stable hover, and lands softly, learning that throttle sets lift for all four motors together and that smoothness near the ground prevents hard landings.

**Module 02 — Pitch (forward/back).** The core "tilt first, then move" lesson, taught by flying forward through three rings. The aircraft visibly dips its nose before it accelerates.

**Module 03 — Roll (sideways).** Strafing through a cone gate while keeping the nose pointed forward, teaching that roll changes lateral position *without* changing heading.

**Module 04 — Yaw (rotation).** Rotating in place to aim the nose/camera at coloured markers, teaching that yaw changes facing, not position.

**Module 05 — Combined Flight Mission.** The first full sortie: take off, hover, fly out, rotate, return, and land. All four axes must be coordinated.

**Module 06 — Avionics & Telemetry.** A reading-the-instruments lesson where the mission goals are defined in terms of telemetry (fly out until signal drops, return until it recovers) rather than maneuvers.

**Scenario modules — Failure training.** Low Battery, Wind Drift, and Signal Loss, each a controlled emergency the learner survives safely (see §9).

---

## 4. 3D scene design

The environment reads as a **premium industrial training facility**, not an arcade. The look is dark, technical, and calm: a deep navy ground plane, a faint blue measurement grid, soft directional sunlight casting real shadows, a cyan rim light for depth, and atmospheric fog that fades the horizon so the scene feels bounded and focused.

The aircraft is the hero asset and is built to feel technical and credible: a matte carbon-black quadcopter body, four arms with motors and continuously spinning two-blade propellers, a front-facing camera gimbal, an underslung battery pack, landing skids, and navigation lights — white at the front, red at the rear — that blink so the learner can always read the aircraft's orientation at a glance.

The training field is furnished with purpose, not decoration. A central **landing pad** with a glowing ring and an "H" marker is home base and the reference point for every "return and land" objective. Three **green target rings** float along the forward axis for the pitch lesson. **Amber cones** form a gate for the roll lesson. Four **coloured heading markers** ring the field for the yaw lesson. A **training tower** with a red beacon doubles as a landmark for heading work and a future site for the compass-interference demo. A translucent red **safety boundary ring** marks the edge of the legal flying area and gently repels the aircraft, modelling a geofence.

Visual overlays do the teaching that geometry alone cannot. A **blue movement arrow** projects from the aircraft in its direction of travel; a **cyan thrust arrow** shows vertical lift or descent; rings turn from cyan to green the instant they are cleared; markers flash white when the nose is aligned. These are the visual grammar of "what is happening right now."

Three **camera modes** (press C) support different learning needs: a chase camera for flying, a slow auto-orbit for inspection and for appreciating attitude changes, and a top-down view for understanding ground track and position relative to home.

---

## 5. Controls and interactions

The prototype uses keyboard control mapped to mimic a real transmitter's two-stick layout, shown live on the left panel so the learner connects keys to stick deflection.

| Input | Axis | What the aircraft does |
|---|---|---|
| `W` / `S` | Pitch | Nose dips and it moves **forward** / nose lifts and it moves **back** |
| `A` / `D` | Roll | Banks and slides **left** / **right** without turning |
| `Q` / `E` | Yaw | Rotates **counter-clockwise** / **clockwise** in place |
| `Space` / `Shift` | Throttle | Climbs / descends |
| `H` | Mode | Toggles stabilisation (auto-level + altitude hold) vs. manual |
| `R` | Reset | Returns the aircraft to the pad with a full battery |
| `C` | Camera | Cycles chase → orbit → top-down |

The **left "transmitter" panel** animates both virtual sticks and highlights the active key, so the learner sees the left stick handling throttle/yaw and the right stick handling pitch/roll exactly as on real hardware. The **interaction model is forgiving by default**: stabilisation is on, so releasing all keys returns the aircraft to a level hover. Toggling it off (`H`) exposes "manual" behavior — the aircraft sinks without throttle — to preview what advanced rate flying feels like, with a clear explanation of the trade-off.

In **Anatomy mode** the interaction switches from flying to *clicking*: the cursor selects components and the aircraft auto-orbits, a deliberately different mode of engagement that signals "inspect, don't fly."

A production build would add gamepad support (the Gamepad API maps cleanly to the same axes) and on-screen touch sticks for tablets, but the keyboard mapping is sufficient to teach every concept.

---

## 6. HUD / telemetry design

The HUD is designed to build **instrument literacy** — the habit of scanning the aircraft's state, not just looking at the drone. It is laid out the way avionics displays are: a single top strip of telemetry, a heading ribbon below it, and contextual warnings that appear only when relevant.

The top strip shows altitude, ground speed, heading, pitch angle, roll angle, yaw rate, battery percentage, GPS satellite count, signal strength, wind speed, distance from home, and flight mode. Each value is a small "card," and cards **change colour by health** — green when nominal, amber when marginal, red when critical — so the learner's eye is trained to the same colour language used in real ground-station software. The heading **compass ribbon** scrolls under a fixed needle, reinforcing cardinal directions during yaw practice.

The **flight mode indicator** is a small but important teaching element. It reads STAB in normal stabilised flight, switches to ATTI when GPS degrades (position hold is lost but attitude hold remains), MANUAL when stabilisation is off, and RTH during an automated return — mirroring the mode labels learners will meet on real aircraft.

A **warning bar** surfaces plain-language alerts only when conditions warrant them: Low Battery, Critical Battery, Weak GPS, High Wind Drift, Excessive Tilt, Signal Loss Risk, Approaching Safety Boundary, and Return-To-Home Active. Showing warnings contextually — rather than as a static list — teaches the learner to associate a specific aircraft state with a specific instruction.

---

## 7. Lesson flow

Every module follows the same instructional rhythm, which is what makes AeroMind feel like courseware rather than a toy.

A lesson opens with a **concept card** on the right: an eyebrow label (e.g. "Module 02 · Forward/Back"), a title, and two or three sentences of plain explanation that state the mental model up front ("the drone tilts first, then moves"). Below it sits the **objectives card** — a short checklist of what the learner must accomplish. Below that is the **live explanation feed**, the product's signature element (see §17 of the original concept, realised here): the moment the learner touches a control, a line appears explaining *input → physics → result* in one sentence. Pressing forward produces "Forward pitch applied — the rear rotors spin up, the nose dips, and the drone accelerates forward; notice it tilts before it moves."

As the learner flies, objectives **auto-detect and tick off** with a confirming feed entry, the bottom progress bar fills, and a running stability score updates. When all objectives are met, a **completion toast** appears with a letter grade and a one-line debrief that references how the learner actually flew ("Controlled and stable throughout" vs. "Watch those firm landings next time"). The learner then advances to the next module from the navigation bar, or resets (`R`) to re-attempt for a better score.

The flow is intentionally **loopable and low-stakes**: there is no failure state that ends the session, only feedback that informs the next attempt — which suits the risk-averse beginner profile.

---

## 8. Practice missions

Missions are the assessable core of each module. Each is built from small, machine-detectable objectives so the learner gets immediate, specific credit.

**Throttle mission:** lift off above 1.5 m, hold a stable hover for three seconds, then descend and land with no hard impact — teaching smooth vertical control end to end.

**Pitch mission:** climb to ring height, fly forward cleanly through all three rings, and stop smoothly past the last one — teaching coordinated forward flight and braking.

**Roll mission:** hold altitude, strafe right through the cone gate, and keep the nose pointed forward throughout — proving the learner understands roll as lateral movement, not turning.

**Yaw mission:** rotate to aim the nose at the blue (0°), green (90°), amber (180°), and red (270°) markers in turn — proving heading control without translation.

**Combined mission (first full sortie):** take off and hover, fly at least 12 m from home, rotate at least 90°, then return and land within 3 m of the pad — the integration test for all four axes.

**Avionics mission:** climb and observe the instruments update, fly out until signal drops below 70%, then return until it recovers above 90% — making telemetry itself the objective.

Each mission rewards **smoothness and stability**, not speed, so the behaviors being reinforced are exactly the ones that keep real hardware intact.

---

## 9. Safety scenarios

Failure training is where the simulator earns its keep, because it lets the learner experience and survive emergencies that would be dangerous or expensive in the field. Each scenario is a controlled setup with a recognise → respond → recover arc.

**Low Battery.** Battery drains rapidly. The learner must notice the amber and then red warnings, abandon the mission, and bring the aircraft home before the failsafe forces a landing. If they wait too long, the aircraft auto-triggers Return-to-Home — itself a lesson in why early recognition matters.

**Wind Drift.** A crosswind continuously pushes the aircraft off position. The learner must recognise the drift on the HUD and correct it with smooth, opposite stick input, holding station near the pad. The teaching point is *gentle* correction; over-correction is penalised by the stability score.

**Signal Loss.** The control link degrades toward zero. As it does, the aircraft automatically engages Return-to-Home, and the learner's job is to *observe and trust* the failsafe — climb to a safe altitude, fly to home, and descend — rather than fight it. This builds the single most important emergency instinct: understanding what the aircraft does on its own.

**GPS Weakness** (designed, extendable in the prototype). Satellites drop and position hold becomes unreliable; the mode indicator switches to ATTI and the aircraft drifts more readily, teaching the learner not to over-trust position hold and to be ready to stabilise manually.

Across all scenarios, the **Return-to-Home demonstration** is a first-class teaching moment: the aircraft climbs to a safe altitude, flies a direct path home, faces its direction of travel, and descends to land — visibly modelling the behavior every operator must understand before relying on it.

---

## 10. Assessment logic

Assessment is continuous and behavioral rather than pass/fail. Three layers work together.

**Objective completion** is binary and machine-detected: each mission objective has a condition (altitude crossed, ring passed within radius while moving forward, heading aligned within tolerance, landed within distance of home, signal threshold reached) that the engine evaluates every frame. Completion is immediate and specific, which is what makes feedback feel earned.

**A stability score (0–100)** runs continuously and is the product's proxy for *quality* of flight. It rewards smooth, measured input and penalises jerky, simultaneous full-deflection commands and hard landings. This operationalises the core safety message — that smoothness, not speed, keeps hardware alive — into a number the learner wants to raise.

**A letter grade and debrief** translate the score into guidance at lesson completion: A ("smooth & precise"), B ("solid control"), C ("keep practising inputs"), or D ("work on smoothness"), each paired with a sentence that references how the learner actually flew. The debrief is formative, not punitive.

This logic is designed to **extend cleanly** into learner progression: per-module scores roll up into a profile, modules can gate on prerequisite completion, and the same detectors that score a mission can feed a competency checklist suitable for a real training curriculum (e.g. "demonstrates controlled descent," "maintains heading during lateral movement," "recognises and responds to low battery").

---

## 11. Portfolio case-study positioning

Position AeroMind as **a simulation-based technical training product**, not a 3D demo. The headline pitch:

> *AeroMind is a 3D drone avionics training simulator that helps new operators understand flight controls, telemetry, and safety behavior before interacting with real drone hardware. The simulator transforms pitch, roll, yaw, throttle, and avionics data into visible, interactive lessons — reducing training risk while improving operator confidence.*

Structure the case-study page as a narrative: a **hero** (the aircraft hovering in the training facility, with a "Launch Simulator" call to action); a **why-it-exists** section contrasting an expensive field crash with a free, repeatable simulated mistake; an interactive **control-fundamentals** preview; an **avionics HUD** showcase framed as "operators learn to monitor the aircraft, not just move it"; a **mission-based learning** card grid; a **real drone vs. simulator** comparison table; and a closing call to action — "Train the operator before risking the equipment."

The skills this project demonstrates are worth naming explicitly for a reviewer: instructional design and scenario-based learning, simulation and 3D interaction design, human–machine-interface and telemetry literacy training, safety-first behavioral design, and performance-feedback/assessment systems. That combination maps directly to roles in technical training design, simulation/XR learning design, instructional design for technical systems, and HMI/operator training for aviation, robotics, and defense-adjacent products.

The strongest single thing to foreground is the **"Input → Physics → Explanation"** mechanic: the design insight that *every control input is an opportunity to teach* is what elevates the project from a tech demo to a piece of instructional design.

---

## 12. Prototype build instructions

### What ships today

`AeroMind.html` is a complete, self-contained prototype: a single HTML file that loads Three.js from a CDN and needs no build step or server. Open it in any modern browser and it runs — which makes it ideal for a portfolio link a reviewer can open in one click. It already implements the 3D environment and aircraft, the four flight axes with forgiving stabilised physics, the full telemetry HUD and warning system, the live explanation feed, all lesson modules and missions, scoring, and the failure scenarios with Return-to-Home.

**Deploying the single file** is trivial and free: drag the folder into Vercel, Netlify, or GitHub Pages and the static file is live at a shareable URL such as `aeromind-simulator.vercel.app`. No configuration is required for a static HTML deploy.

### Scaling up to the production stack

When you want a maintainable codebase to keep extending, migrate to the component stack you validated — it is the right choice for this product:

| Layer | Choice | Why |
|---|---|---|
| Framework | React + TypeScript + Vite | Component model for HUD, panels, lessons, scoring; fast dev/build |
| 3D | Three.js via React Three Fiber | Declarative Three.js scenes as React components |
| Helpers | Drei | Ready-made camera controls, loaders, environment helpers |
| Physics | Rapier (react-three-rapier) | Real rigid-body collision, gravity, landing, drift when you want true physics |
| State | Zustand | Lightweight global store for flight state, telemetry, mission progress |
| Styling | Tailwind CSS | Fast, consistent HUD and panel styling |
| Assets | Blender → glTF/GLB | A polished drone and environment beyond primitive geometry |
| Deploy | GitHub → Vercel | Push to GitHub, import the repo, automatic deploys on every push |

A clean component structure mirrors the prototype's internal regions: `SimulatorScene`, `DroneModel`, `HUD`, `ControllerPanel`, `LessonPanel`, `ExplanationFeed`, `MissionBar`, and `TrainingOverlay`, with lesson content kept as **reusable data** (an array of module definitions with title, copy, scenario flags, and objective check functions) exactly as the prototype already does — so adding a module is a data change, not new rendering code.

**Recommended build order (matches the original phase plan).** Phase 1: port the flyable core (drone, environment, four-axis controls, HUD) into R3F. Phase 2: add the structured lessons, missions, and scoring. Phase 3: deepen the avionics simulation (battery model, GPS/signal, wind). Phase 4: add failure scenarios and Return-to-Home. Phase 5: polish the Blender assets and ship the portfolio case-study page wrapping the simulator.

### Deployment flow (production)

Build locally with Vite (`npm run build`), push the project to GitHub, import the repository into Vercel, let Vercel build and host it, and embed the resulting live URL in your portfolio case study. Every subsequent push redeploys automatically.

---

### Scope and honesty note

AeroMind is an **educational civilian flight-training simulation**. It teaches lawful, safety-first operation of standard consumer/commercial drones and deliberately excludes any tactical, weaponised, surveillance, or unauthorized-operation use cases. The physics are a *training abstraction* tuned for learning clarity, not an engineering-accurate flight model — the goal is correct intuition and safe habits, which is precisely what a first-time operator needs before touching real hardware.
