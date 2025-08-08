# 🎯 faktix - Brand Identity

## 📊 **Brand Overview**

**faktix** is a modern invoice management system with a sleek, minimalist design featuring a distinctive green accent color scheme.

## 🎨 **Visual Identity**

### **Logo**
- **Symbol**: Lowercase "f" in a rounded square with green border
- **Typography**: Custom monospace font with bold weight
- **Style**: Modern, tech-focused, minimalist
- **Interactive**: Hover effects with rotation, scaling, and glow

### **Color Palette**
```css
/* Primary Colors */
--color-black: #000000;        /* Main background */
--color-white: #ffffff;        /* Text and borders */

/* Money Green Accent */
--color-money: #00ff88;        /* Primary green */
--color-money-dark: #00cc66;   /* Darker green */
--color-money-light: #33ff99;  /* Lighter green */
--color-money-glow: rgba(0, 255, 136, 0.3); /* Glow effect */
```

### **Typography**
- **Primary**: Inter (Headings, UI text)
- **Secondary**: JetBrains Mono (Logo, code-like elements)
- **Weights**: Regular (400), Bold (700), Black (900)

## 🎭 **Design Language**

### **Logo Animations**
- **Hover Scale**: 105% with 2° rotation
- **Color Transition**: White → Money Green
- **Glow Effect**: Dynamic shadow with green tint
- **Particles**: Floating dots on hover

### **Interactive Elements**
- **Buttons**: Green fills with black text
- **Links**: Hover transitions to green
- **Cards**: Subtle borders with hover effects
- **Icons**: Green accents for active states

## 🏗️ **Implementation**

### **React Components**
```tsx
import { FaktixLogo } from "@/components/FaktixLogo";

// Full logo with text
<FaktixLogo size="lg" />

// Icon only
<FaktixIcon size="md" />
```

### **CSS Classes**
```css
.text-money        /* Green text */
.bg-money          /* Green background */
.border-money      /* Green border */
.money-glow        /* Green shadow */
.hover-money       /* Green on hover */
```

## 📱 **Applications**

### **Used In**
- ✅ Landing page header
- ✅ Authentication pages (login/register)
- ✅ Dashboard sidebar
- ✅ Loading screens
- ✅ Footer branding

### **Responsive Behavior**
- **Small**: 24px × 24px (sm)
- **Medium**: 32px × 32px (md)
- **Large**: 48px × 48px (lg)
- **Extra Large**: 64px × 64px (xl)

## 🎯 **Brand Values**
- **Modern**: Clean, contemporary design
- **Professional**: Serious business tool
- **Efficient**: Quick and streamlined UX
- **Trustworthy**: Solid, reliable appearance
- **Tech-Forward**: Modern development approach

## 💚 **The "Money Green" Story**
The distinctive green color represents:
- 💰 **Financial Success**
- 📈 **Growth and Profit**
- ✅ **Completed Transactions**
- 🚀 **Modern Fintech**
- 🔋 **Energy and Vitality**

## 🔧 **Technical Details**

### **File Structure**
```
src/components/FaktixLogo.tsx    # Main logo component
src/app/globals.css              # Brand colors & effects
```

### **Features**
- TypeScript support
- Size variants (sm, md, lg, xl)
- Icon-only variant
- Tailwind CSS integration
- Hover animations
- Accessibility compliant
- Mobile responsive

---

**faktix** - Where invoicing meets modern design! 🚀💚 