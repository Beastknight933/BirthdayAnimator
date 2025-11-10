# Birthday Wishing App - Design Guidelines

## Design Approach
**Reference-Based Approach** inspired by modern celebration platforms (JibJab, Instagram Stories) and greeting card experiences. Focus on emotional impact, delight, and shareability with generous animation throughout.

## Core Design Principles
1. **Celebration-First**: Every interaction should feel festive and joyful
2. **Photo-Centric**: User photos are the hero content, displayed prominently
3. **Dual Experience**: Creation flow (uploader) vs. Viewing flow (recipient) with distinct treatments
4. **Mobile-Optimized**: Birthday wishes are primarily viewed on phones

---

## Typography
**Font Families** (Google Fonts):
- Display: 'Playfair Display' or 'Libre Baskerville' (elegant, celebratory headlines)
- Body: 'Inter' or 'Poppins' (clean, modern readability)

**Hierarchy**:
- Hero Birthday Message: text-6xl md:text-8xl font-bold (display font)
- Age Display: text-8xl md:text-9xl font-black (massive, celebratory)
- Section Headings: text-3xl md:text-4xl font-semibold
- Body/Instructions: text-base md:text-lg
- Buttons/CTAs: text-lg font-medium

---

## Layout System
**Spacing Units**: Tailwind units of 4, 6, 8, 12, 16, 20
- Component padding: p-6 to p-8
- Section spacing: py-12 md:py-20
- Element gaps: gap-4 to gap-8

**Container Strategy**:
- Creation flow: max-w-2xl mx-auto (focused, form-like)
- Viewing flow: Full-width with strategic constraints (max-w-6xl for text)

---

## Creation Flow (Upload Interface)

### Layout Structure
Single-column, centered form experience with clear progression:

1. **Header Section**
   - App branding/logo centered
   - Tagline: "Create a magical birthday surprise"
   - Subtle decorative elements (small floating confetti/balloons)

2. **Photo Upload Zone** (py-12)
   - Large drag-and-drop area with dashed border
   - Visual feedback: hover states, upload progress
   - Grid preview of uploaded photos (grid-cols-2 md:grid-cols-3)
   - Individual photo remove buttons
   - Support 4-8 photos minimum

3. **Details Form** (py-8)
   - Recipient name input (full-width)
   - Age input (numeric, prominent)
   - Optional: Custom message textarea
   - Generous input padding (p-4), rounded corners (rounded-xl)

4. **Generate Button** (py-8)
   - Large, prominent CTA button
   - Icon: gift or sparkle
   - Loading state with animation during link generation

5. **Link Display Panel** (conditional)
   - Shows after generation
   - Shareable link in copy-to-clipboard input
   - Quick share buttons (WhatsApp, SMS, Copy)
   - Preview thumbnail of created experience

---

## Viewing Flow (Recipient Experience)

### Full-Screen Celebration Sequence

**Landing Animation** (Full viewport):
- Immediate confetti burst animation (canvas-based)
- Fade-in animated text: "Happy Birthday [Name]!"
- Floating balloons rising from bottom
- Pulsing age number entrance
- Auto-scroll prompt after 2-3 seconds

**Photo Showcase Section**:
- Full-width carousel/slideshow
- Each photo: Full viewport height with Ken Burns zoom effect
- Smooth fade transitions between photos (3-4 second intervals)
- Progress indicators at bottom
- Photos displayed with subtle vignette overlay
- Touch/swipe navigation on mobile

**Birthday Message Section** (py-16):
- Centered content (max-w-4xl)
- Animated entrance (slide up + fade)
- Large age display with particle effects
- Custom message (if provided) with typewriter animation
- Decorative elements: stars, hearts, or cake icons

**Music Control**:
- Floating toggle button (bottom-right, fixed position)
- Icon-only with tooltip
- Persistent across scroll
- Blurred background for readability

**Footer CTA** (py-12):
- "Create Your Own Birthday Surprise" button
- Links back to creation flow
- Subtle, non-intrusive

---

## Component Library

### Buttons
- Primary CTA: Large (px-8 py-4), rounded-full, shadow-lg
- Secondary: Outlined with hover fill transition
- Icon buttons: Circular (rounded-full), p-3
- All buttons: Smooth hover scale (scale-105)

### Cards
- Photo cards: No border, shadow-md, rounded-2xl
- Upload dropzone: Dashed border-2, rounded-3xl, transition on hover

### Inputs
- Text inputs: Border-2, rounded-xl, p-4, focus ring animation
- File upload: Hidden native input, custom styled trigger

### Animations
**Generous Use**:
- Confetti: Canvas-based particle system, triggered on load
- Balloons: CSS/SVG floating animation, staggered delays
- Photo transitions: Crossfade with scale (Ken Burns effect)
- Text: Typewriter for messages, slide-up for headings
- Background: Subtle gradient shimmer or particle field
- Loading states: Spinner with celebration theme

---

## Images

### Creation Flow Images
No hero image needed - focus on interface clarity

### Viewing Flow Images
**User-Uploaded Photos**: 
- Primary content displayed in full-screen carousel
- Aspect ratio: Cover (object-fit), center-cropped
- Minimum 4 photos, maximum 12 photos
- Mobile: Single column slideshow
- Desktop: Can explore split-screen or grid transitions

**Decorative Elements**:
- Birthday-themed illustrations (cakes, balloons, confetti) as SVG decorative accents
- Use icon libraries for UI elements (gift boxes, music notes, share icons)

---

## Responsive Behavior

### Mobile (Base)
- Single column throughout
- Full-screen photo viewing
- Touch-optimized controls (larger tap targets)
- Simplified animations (performance)

### Tablet/Desktop (md: and up)
- Creation flow: Maintain centered, max-w-2xl
- Viewing flow: Can use wider layouts for photos
- Enhanced animations (more particles, smoother transitions)
- Keyboard navigation support

---

## Accessibility
- Alt text for all user-uploaded photos
- Animation pause/reduce motion preference respected
- Keyboard navigation for photo carousel
- Screen reader announcements for dynamic content
- High contrast focus indicators
- ARIA labels for icon-only buttons