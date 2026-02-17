# Tengri Yurt - Responsive Design Guide

## Breakpoints (Modern Standard)

### 🖥️ Large Desktop (1440px+)
- Default styles
- Full-width layouts
- Max container: 1400px
- Spacing: --spacing-2xl: 8rem

### 💻 Desktop (1200px - 1439px)
- Container padding: 3rem
- Spacing reduced slightly
- 3-column grids maintained

### 💼 Laptop (1024px - 1199px)
- Container padding: 2.5rem
- Navigation: Logo 45px, smaller CTA
- Testimonials: 2 columns
- Showcase: 2 columns
- Why grid: 2 columns

### 📱 Tablet (768px - 1023px)
- Container padding: 2rem
- Navigation: Logo 40px
- Footer: 1 column
- Testimonials: 1 column
- Process timeline: Simplified

### 📱 Mobile Portrait (480px - 767px)
- Container padding: 1.5rem
- All grids: 1 column
- Gallery: 2 columns → 1 column
- Process: Vertical layout
- CTA buttons: Full width stacked
- Reduced spacing throughout

### 📱 Small Mobile (320px - 479px)
- Container padding: 1rem
- Minimum font sizes
- Optimized touch targets
- Maximum compression

## Key Sections Adaptation

### Navigation
- Desktop: Logo center, CTA right
- Mobile: Reduced logo, smaller CTA
- Always fixed position

### Hero Section
- Responsive typography with clamp()
- Video/Image background scales
- Content centered vertically

### Testimonials
- Desktop: 3 columns
- Laptop: 2 columns
- Tablet+: 1 column

### Gallery (Our Spaces)
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column
- Aspect ratios adjusted per device

### Process Timeline
- Desktop: Side numbers with line
- Mobile: Numbers above, no line dots

### Footer
- Desktop: 3 columns
- Tablet+: 1 column stacked

## Typography Scale

All text uses `clamp()` for fluid responsiveness:
- Titles: clamp(1.75rem, 8vw, 4rem)
- Body: clamp(0.9rem, 3vw, 1.1rem)
- Small: clamp(0.65rem, 2vw, 0.85rem)

## Testing Checklist

✅ All breakpoints tested
✅ Touch targets minimum 44x44px
✅ Text readable without zoom
✅ Images scale properly
✅ Buttons accessible
✅ Navigation functional
✅ Forms usable on mobile
✅ No horizontal scroll
✅ Footer readable
