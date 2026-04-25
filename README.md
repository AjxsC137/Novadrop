# ◈ Urban Mobiles: Premium Phones, Unreal Prices

<a href="https://novadrop-tau.vercel.app/" target="_blank">
  <img src="https://img.shields.io/badge/LIVE%20DEMO-FF0000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
</a>

Welcome to **Urban Mobiles**!  
A premium, high-performance storefront built for a personal mobile phone reselling business based in Delhi NCR. The site combines a bold editorial dark aesthetic with smooth 3D interactions and a frictionless WhatsApp-first enquiry flow — reflecting the speed, trust, and value the business delivers.

---

### ✨ Features

* **🔄 3D Circular Carousel**  
  Phones and accessories are displayed in a fully interactive 3D rotating ring. Cards scale with depth, auto-rotate at a steady pace, and respond to drag-to-spin, click-to-front, and prev/next controls. Each carousel is independently configurable.

* **🌓 Dark / Light Theme Engine**  
  Seamlessly switch between **Dark** and **Light** modes via a toggle in the navbar (desktop) or hamburger menu (mobile). The theme persists across sessions via `localStorage` and always defaults to dark on first visit.

* **📱 Precision-Engineered Responsive Design**  
  Fully optimised across desktop, tablet, and mobile. On mobile, the hero phone card appears inline between the headline and body text. Safe-area insets (`env(safe-area-inset-*)`) ensure nothing bleeds on notch or Dynamic Island iPhones.

* **✨ Smart Interactive Cursor**  
  A custom dual-element cursor — a red dot with a lagging ring follower — reacts to hover states on cards, buttons, and links. Automatically hidden and disabled on touch devices.

* **💬 WhatsApp-First Enquiry Form**  
  Clicking "Enquire Now" on any product scrolls to the contact form and pre-selects the matching phone or accessory. The form validates inputs, builds a clean formatted message, and opens `wa.me` directly — no backend needed.

* **🃏 Interactive About Cards**  
  Four hover-expand feature cards with giant watermark numbers, a sweeping red accent line, a glow effect, and a stat row that slides up on hover — without causing any page layout shift.

* **🎞️ Animated Hero Background**  
  Diagonal line hatching, dual radial red spotlights, a warm-to-dark diagonal gradient, and an animated film grain texture layer — all composited via CSS for a cinematic editorial feel.

* **📋 View All Modals**  
  "View All Phones" and "View All Accessories" open full scrollable grid modals with all products, keyboard-dismissible and click-outside-to-close.

---

### 🛠️ Tech Stack

* **Core**: HTML5, CSS3 (Custom Properties, Grid, Flexbox, `perspective`, `clip-path`)
* **3D Carousel**: Vanilla JavaScript — `requestAnimationFrame` loop with `translateX/translateZ/scale` transforms
* **Animations**: CSS Keyframes & Intersection Observer API
* **Fonts**: Google Fonts — Barlow Condensed, Syne, DM Sans
* **Deployment**: Vercel

---

### 🚦 Setup & Customisation

To run this project locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/urban-mobiles.git
   cd urban-mobiles
   ```

2. **Local Server**  
   Since the project uses local image assets, serve it via a local server rather than opening `index.html` directly:
   ```bash
   # If you have Node/NPX
   npx serve .
   # Or Python
   python -m http.server 3000
   ```

3. **Add Your Images**  
   Place all product images inside the `images/` folder. Filenames must match exactly what is referenced in `index.html` (see the file structure below).

4. **Update Contact Details**  
   Replace all placeholder values in `index.html` and `script.js`:

   | Field | File | Placeholder |
   |---|---|---|
   | WhatsApp number | `script.js` ~line 441 | `919999999999` |
   | WhatsApp link | `index.html` footer | `wa.me/919999999999` |
   | Call link | `index.html` footer | `+919999999999` |
   | Instagram handle | `index.html` footer | `YOURUSERNAME` |

5. **Tuning the 3D Carousel**  
   Adjust card size, ring spread, and rotation speed at the top of `script.js`:
   ```js
   const PHONES_CFG = {
     cardW:      200,    // card width px
     cardH:      240,    // card height px
     mobileCardW: 132,   // mobile card width
     mobileCardH: 207,   // mobile card height
     radiusMult:  1.1,   // ring spread multiplier
     autoDeg:    0.051,  // rotation speed per frame
     minRadius:   480,   // minimum ring radius px
   };
   ```

---

### 🌐 UI & Performance

- **Pure Red Accent (`#FF0000`)**: A single bold accent colour used consistently across all interactive elements, badges, borders, and highlights — no shades, no gradients, just red.
- **Barlow Condensed**: The display typeface for all headlines — ultra-bold, uppercase, condensed — chosen for its cinematic editorial impact.
- **Touch-Optimised**: Custom cursor is fully disabled on touch devices. Carousel supports drag-to-spin and swipe on mobile. Hamburger menu closes on link tap, close button, blank overlay tap, or Escape key.
- **No Framework Overhead**: Zero dependencies beyond Google Fonts. No React, Vue, Tailwind, jQuery, or bundler — ships as three files: `index.html`, `style.css`, `script.js`.

---

### 📁 File Structure

```
urban-mobiles/
├── index.html
├── style.css
├── script.js
├── favicon-32.png
├── favicon-16.png
├── apple-touch-icon.png
└── images/
    ├── hero-phone.png
    ├── iphone-17-pro.png
    ├── iphone-17-pro-max.png
    ├── iphone-17.png
    ├── iphone-16-pro.png
    ├── iphone-15-pro-max.png
    ├── iphone-15.png
    ├── samsung-z-fold-6.png
    ├── samsung-z-flip-6.png
    ├── samsung-s25-ultra.png
    ├── samsung-galaxy-s25-plus.png
    ├── charger-65w.jpg
    ├── earbuds-anc.jpg
    ├── powerbank-20000.jpg
    ├── magsafe-case.jpg
    └── wireless-charger.jpg
```

---

### 🛡️ License

MIT

Made with ❤️ by Ajit
