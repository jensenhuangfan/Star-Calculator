# ✨ Stardust Calculator ✨

> A premium, highly-interactive cosmic math experience built with raw performance and elegant aesthetics.

Stardust Calculator is not just a tool for computation—it is an immersive visual experience. Inspired by the depth of deep space, it features a custom HTML5 canvas background depicting twinkling stars, high-speed shooting meteors, active gravitational mouse repulsion, and a responsive physics-based particle engine.

---

## 🌟 Key Features

- **HTML5 Canvas Particle Backdrop:** A lightweight, high-performance canvas rendering engine simulating hundreds of twinkling stars and dynamic shooting meteors.
- **Active Mouse Gravity Repulsion:** Move your mouse over the screen to watch stars react, warp, and drift dynamically based on gravitational attraction and repulsion vectors.
- **Cyber-Cosmic Glassmorphism HUD:** A modern, sleek glassmorphic UI container with neon glows, subtle borders, and smooth transitions.
- **Sparkling Click Feedback:** Clicking any button triggers an instant, physics-simulated burst of glowing stardust particles color-coded to the button type.
- **Tactile Keyboard Integration:** Full physical keyboard bindings with automatic input mapping, anti-duplicate input handling, and active button scaling animations.
- **Responsive Display Scaling:** Display font dynamically scales to prevent long mathematical outputs from clipping or breaking the interface grid.

---

## 🛠️ How It Was Made (Tech Stack)

The calculator was built from the ground up using pure, modern web standards for maximum compatibility and zero dependency overhead:

1. **HTML5:** Semantic architecture including accessibility roles (`grid`, `gridcell`, `aria-live`) for assistive technology support.
2. **Vanilla CSS3:** Custom-tailored CSS variables, absolute layout placement, glowing neon drop shadows, and scale transforms.
3. **Vanilla JavaScript (ES6+):** 
   - A vector-based particle engine featuring custom decay rates, gravity factors, and velocity transformations.
   - Robust calculator state machine logic preventing multiple consecutive math operators and rounding floating-point numbers to $8$ decimal places to avoid standard IEEE-754 precision bugs.
   - Clean, unified input mapping coordinating mouse clicks and physical keyboard presses.

---

## 🚀 How to Run

Since Stardust Calculator uses zero dependencies or build steps, it can be run instantly in any modern web browser:

1. **Clone or Download** this directory.
2. **Double-click** the [index.html](file:///c:/Users/Will7/Downloads/stardance/Star-Calculator/index.html) file to open it in your browser.
3. Alternatively, serve it locally with any simple static server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve .
   ```
4. Access the server via `http://localhost:8000`.

---

## 🎹 Keyboard Controls

| Key | Calculator Function | Visual Animation |
|:---:|:---:|:---:|
| `0` - `9` | Digits | Highlights digit button & sparks |
| `+`, `-`, `*`, `/` | Arithmetic Operators | Highlights operator button & cyan sparks |
| `%` | Modulo | Highlights `%` button & cyan sparks |
| `.` | Decimal Point | Highlights `.` button & sparks |
| `Enter` or `=` | Evaluate | Highlights `=` button & golden sparks |
| `Backspace` | Delete Last Input | Highlights `⌫` button & orange sparks |
| `Escape` | Clear All | Highlights `C` button & red sparks |

---

*Crafted with cosmic curiosity.* 🌌