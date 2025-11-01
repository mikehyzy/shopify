# Chicago Futures Salon - Custom Shopify Theme

A completely custom Shopify theme for the Chicago Futures Salon—an invitation-only community of senior leaders exploring futures thinking through Surrealist, Situationist, and Futurist methods.

## 🎨 Design Philosophy

This theme embodies an avant-garde, intellectual aesthetic that balances exclusivity with welcoming mystique. Every animation, interaction, and design choice is intentional, creating an experience that feels like entering a digital speakeasy for intellectual futures thinking.

## ✨ Key Features

### Interactive Sections
- **Hero Section**: GSAP-powered animations with parallax effects, morphing SVG shapes, and typewriter text
- **Manifesto Accordion**: Interactive philosophy panels with flip cards and SVG connection lines
- **Events Timeline**: Dynamic event display with category filtering and RSVP functionality
- **Games Showcase**: 3D product cards with quick-shop modals and AJAX cart integration
- **Invitation Form**: Multi-step form with progress tracking and validation

### Technical Stack
- **Shopify Liquid** - Templating engine
- **GSAP** - Advanced animations and scroll effects
- **Alpine.js** - Lightweight interactivity
- **Tailwind CSS** - Utility-first styling
- **React** - Complex interactive components (loaded via CDN)
- **Vite** - Modern build tooling

### Design System
```css
Colors:
- Midnight: #0a0a0a (primary background)
- Deep Blue: #1a1a2e (secondary background)
- Brass: #d4af37 (primary accent)
- Electric: #00d4ff (secondary accent)
- Dream Purple: #9b4dca (tertiary accent)
- Chicago Grey: #6c757d (text/borders)

Typography:
- Heading: Futura PT / Montserrat
- Body: Crimson Text / Georgia
- Accent: Dancing Script
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Shopify CLI 3.0+
- Shopify Partner account with a development store

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Build assets**
```bash
npm run build
```

3. **Connect to Shopify store**
```bash
shopify theme dev --store=your-store.myshopify.com
```

### Development Workflow

```bash
# Start development server
npm run dev

# Build CSS with Tailwind
npm run build:css

# Watch CSS for changes
npm run watch:css

# Lint JavaScript
npm run lint

# Format code
npm run format
```

## 📁 Theme Structure

```
chicago-futures-salon-theme/
├── assets/              # Compiled CSS, JS, images
├── config/             # Theme settings
├── layout/             # Theme layouts
├── sections/           # Reusable sections
├── snippets/           # Reusable code snippets
├── templates/          # Page templates
└── src/                # Source files
    ├── scripts/
    └── styles/
```

## 🎯 Key Sections

- **Hero Section**: Full-viewport hero with GSAP animations
- **Manifesto Section**: Interactive accordion with flip cards
- **Events Section**: Timeline with RSVP functionality
- **Games Section**: Product showcase with quick-shop
- **Invitation Form**: Multi-step application form

## 🎨 Customization

Access theme settings in Shopify Admin:
**Online Store > Themes > Customize**

## 📱 Browser Support

- Chrome, Firefox, Safari, Edge (latest 2 versions)
- iOS Safari (iPhone 12+)
- Chrome Mobile (Android 10+)

## 📄 License

Proprietary software created for Chicago Futures Salon.

---

**The marvelous awaits.** 🎭 
