# MindElevate Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from premium coaching and mentorship platforms (Notion, Linear, modern SaaS aesthetics) combined with counseling/wellness industry standards. The design should convey professionalism, trust, and approachability while maintaining a premium, modern feel.

## Core Design Principles
- **Trust & Credibility**: Professional yet warm aesthetic that builds confidence
- **Clarity & Focus**: Clean layouts that guide users toward key actions (booking sessions, exploring services)
- **Premium Feel**: Polished, sophisticated UI that reflects 16 years of expertise
- **Accessibility**: Welcoming to diverse audiences (students, parents, professionals)

---

## Typography System

### Font Families
- **Primary (Headings)**: 'Plus Jakarta Sans' - Modern, friendly, professional
- **Secondary (Body)**: 'Inter' - Clean, highly readable for long-form content

### Type Scale
- **Hero Headline**: text-6xl md:text-7xl lg:text-8xl, font-bold, tracking-tight
- **Section Headings**: text-4xl md:text-5xl, font-bold
- **Subsection Headings**: text-2xl md:text-3xl, font-semibold
- **Card Titles**: text-xl md:text-2xl, font-semibold
- **Body Large**: text-lg md:text-xl, font-normal
- **Body Regular**: text-base, font-normal, leading-relaxed
- **Small Text**: text-sm, font-medium

---

## Layout System

### Spacing Primitives
**Standardized Tailwind Units**: 2, 4, 6, 8, 12, 16, 20, 24, 32
- **Component padding**: p-6 to p-8
- **Section spacing**: py-16 md:py-24 lg:py-32
- **Card gaps**: gap-6 to gap-8
- **Element margins**: mb-4, mb-6, mb-8

### Container Strategy
- **Full-width sections**: w-full with inner max-w-7xl mx-auto px-4 md:px-6 lg:px-8
- **Content sections**: max-w-6xl mx-auto
- **Text-focused content**: max-w-4xl mx-auto
- **Reading width**: max-w-prose for blog articles

### Grid Layouts
- **Services Cards**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-6 to gap-8
- **Blog Preview**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-8
- **Testimonials**: Horizontal scrolling slider on mobile, 2-3 column grid on desktop
- **Stats/Impact**: grid-cols-2 md:grid-cols-4, gap-6

---

## Component Library

### Navigation
- **Desktop**: Horizontal nav with inline links, right-aligned CTA buttons
- **Mobile**: Hamburger menu with full-screen overlay
- **Structure**: Logo (left) → Nav Links (center) → CTA Buttons (right)
- **Links**: Smooth underline animation on hover
- **CTA Buttons**: Primary + Secondary button styles with glass-morphism effect

### Hero Section
- **Layout**: Full viewport height (min-h-screen) with centered content
- **Background**: Large professional hero image of Dr. Gladis or counseling setting (use placeholder with blur-load effect)
- **Content Overlay**: Semi-transparent gradient overlay for text readability
- **Headline**: Large, bold typography with gradient text effect
- **Subtext**: max-w-2xl centered below headline
- **CTA Group**: Two buttons (Book Free Call + Explore Services) with blurred background for contrast
- **Badge/Trust Element**: "16 Years of Experience" badge in top corner

### About Section
- **Layout**: Two-column split (image left, content right) on desktop, stacked on mobile
- **Image**: Professional photo of Dr. Gladis with rounded corners and subtle shadow
- **Content**: Headline + bio text + key highlights (icon + text pairs)
- **Highlights**: Grid of 4 key strengths with icons (Heroicons)
- **Quote**: Highlighted pull-quote in italic with decorative element

### Services Cards
- **Card Design**: Elevated cards with subtle shadow, rounded-2xl corners
- **Hover Effect**: Lift animation (transform scale + shadow increase)
- **Icon**: Large icon at top (Heroicons - AcademicCapIcon, BriefcaseIcon, PresentationChartBarIcon)
- **Structure**: Icon → Title → Description → "Learn More" link with arrow
- **Layout**: 3-column grid on desktop, single column on mobile

### Why MindElevate Section
- **Background**: Subtle gradient background (blue to purple tint)
- **Stats Grid**: 4 key metrics with large numbers + labels
- **Who We Help**: 4 audience cards with icons and descriptions
- **Why Choose Us**: Bulleted list with checkmark icons, two-column layout

### Testimonials Slider
- **Design**: Card-based testimonials with photos
- **Card Contents**: Quote → Name/Title → Photo (circular)
- **Navigation**: Dot indicators below, arrow navigation on hover
- **Auto-play**: 5-second intervals with smooth transitions
- **Layout**: 1 card mobile, 2 cards tablet, 3 cards desktop

### Blog Preview Grid
- **Card Design**: Image thumbnail (16:9) + title + excerpt + "Read More" link
- **Hover**: Image zoom effect + shadow lift
- **Modal**: Full-screen modal overlay with close button, scrollable content
- **Grid**: 3 columns desktop, 2 columns tablet, 1 column mobile

### Contact Section
- **Layout**: Two-column (form left, info right)
- **Form**: Name, Email, Phone, Service Interest dropdown, Message textarea
- **Inputs**: Modern floating label style or outlined with clear labels
- **Submit Button**: Full-width primary button with loading state
- **Contact Info**: Phone, email, social icons in card format
- **Social Links**: Icon buttons with hover lift effect

### Payment Page
- **Layout**: Centered card with max-w-md
- **Package Options**: Radio button cards with pricing
- **Razorpay Button**: Primary styled, full-width
- **Trust Indicators**: Secure payment badge, money-back guarantee text

### Footer
- **Layout**: 4-column grid (About, Quick Links, Services, Contact)
- **Newsletter**: Email input + subscribe button
- **Social Icons**: Row of social media icons with hover color change
- **Copyright**: Centered bottom text with links

### Admin Dashboard
- **Sidebar Navigation**: Fixed left sidebar with icons + labels
- **Content Area**: Tables for CRUD operations with action buttons
- **Forms**: Clean input fields with validation states
- **Data Tables**: Sortable, searchable with pagination
- **Action Buttons**: Edit (blue), Delete (red), Add New (green)

---

## Animations & Interactions

### Scroll Animations
- **Fade-in-up**: Sections fade in and slide up as they enter viewport
- **Stagger Effect**: Cards/items animate with slight delay between each

### Hover Effects
- **Cards**: Subtle lift (translateY(-4px)) + shadow increase
- **Buttons**: Background color shift + scale(1.02)
- **Links**: Underline slide-in animation
- **Images**: Slight zoom (scale 1.05) on hover

### Transitions
- **Duration**: transition-all duration-300 ease-in-out (standard)
- **Modals**: Fade in background + scale-up content
- **Navigation**: Smooth dropdown with slide-down effect

**Critical**: Use animations sparingly and purposefully. Focus on polish, not distraction.

---

## Images

### Hero Section
- **Primary Image**: Professional photo of Dr. Gladis Diana Sivakumar in counseling setting or against soft gradient background
- **Alternative**: Warm office environment showing counseling session setup
- **Treatment**: Subtle overlay gradient (blue/purple tint) for text contrast
- **Position**: Background cover with center positioning

### About Section
- **Profile Image**: High-quality professional headshot of Dr. Gladis
- **Shape**: Rounded-lg with subtle shadow and border treatment
- **Size**: Approximately 400px × 500px on desktop

### Services Section
- **Icons**: Use Heroicons for service representations (academic cap, briefcase, presentation chart)
- **Optional**: Small illustrative icons or imagery within cards

### Blog Section
- **Thumbnails**: 16:9 ratio placeholder images representing article topics
- **Style**: Modern, professional stock photos or custom illustrations

### Testimonials
- **Client Photos**: Circular avatar images (placeholder or actual client photos if available)
- **Size**: 60-80px diameter

---

## Responsive Breakpoints
- **Mobile**: < 768px (base Tailwind)
- **Tablet**: md: (768px+)
- **Desktop**: lg: (1024px+)
- **Large Desktop**: xl: (1280px+)

### Mobile Considerations
- Stack all multi-column layouts to single column
- Reduce font sizes by 1-2 steps
- Full-width buttons
- Hamburger navigation
- Reduced padding/margins (use responsive spacing)

---

## Accessibility Requirements
- All interactive elements must have clear focus states (ring-2 ring-offset-2)
- Sufficient color contrast for all text (WCAG AA minimum)
- Semantic HTML structure throughout
- ARIA labels for icon-only buttons
- Keyboard navigation support for all interactive elements
- Alt text for all images