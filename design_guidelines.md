# ShiftSavvy Design Guidelines

## Design Approach

**Selected System**: Hybrid approach combining Apple Human Interface Guidelines (minimalism, clarity) with Material Design 3 (interactive feedback, data visualization)

**Rationale**: ShiftSavvy is a utility-focused financial tracking tool requiring precision, trust, and efficiency. Service workers need quick, reliable access to earnings data on-the-go. The clean, minimalist aesthetic ensures clarity while subtle interactive feedback provides confidence in actions taken.

**Core Principles**:
- Clarity over decoration - financial data demands precision
- Efficiency-first interactions - minimize taps to common actions
- Trust through consistency - predictable patterns build confidence
- Mobile-optimized for one-handed use in fast-paced environments

---

## Typography System

**Primary Font**: Inter (Google Fonts) - exceptional legibility for data/numbers
**Accent Font**: Poppins (Google Fonts) - friendly headings that soften financial anxiety

**Hierarchy**:
- **Display**: Poppins Bold, 28px/32px - Dashboard headings, welcome screens
- **H1**: Poppins SemiBold, 24px/28px - Section headers, modal titles
- **H2**: Poppins Medium, 20px/24px - Card headers, subsection titles
- **H3**: Inter SemiBold, 18px/22px - Data labels, form sections
- **Body Large**: Inter Regular, 16px/24px - Primary content, descriptions
- **Body**: Inter Regular, 14px/20px - Secondary text, helper text
- **Caption**: Inter Medium, 12px/16px - Metadata, timestamps, micro-copy
- **Number Display**: Inter SemiBold, varying sizes - All currency and numerical data for enhanced legibility
- **Tabular Numbers**: Use tabular/monospaced number variant of Inter for financial tables and aligned data columns

---

## Layout & Spacing System

**Tailwind Spacing Primitives**: Standardize on 2, 4, 6, 8, 12, 16, 20, 24 units
- **Micro spacing** (p-2, gap-2): Icon-to-text, tight groupings
- **Component spacing** (p-4, gap-4): Card padding, list item spacing
- **Section spacing** (p-6, gap-6): Between grouped elements
- **Layout spacing** (p-8, gap-8): Major component separation
- **Breathing room** (p-12, py-16): Section dividers, page margins
- **Major sections** (py-20, py-24): Dashboard section separation

**Mobile Layout Structure**:
- **Safe Zones**: Respect iOS/Android bottom navigation bars and notches
- **Thumb Zones**: Primary actions within bottom 60% of screen
- **Max Width**: Content constrained to 600px on tablets/landscape
- **Grid System**: 4-column grid on mobile, 8-column on tablet
- **Bottom Navigation**: 64px height for primary navigation bar
- **Top Bar**: 56px height for headers with back/action buttons

---

## Component Library

### Navigation
**Bottom Tab Bar** (Primary Navigation):
- Fixed 64px height with 5 tabs maximum
- Icons with labels (icon: 24px, label: 12px Inter Medium)
- Active state: Elevated icon position (translate-y-[-4px])
- Items: Dashboard, Add Shift, Reports, Jobs, Profile

**Top App Bar**:
- 56px height, sticky positioning
- Left: Back button or menu (44px touch target)
- Center: Page title (Poppins SemiBold 18px)
- Right: Action buttons or settings (44px touch targets)

### Dashboard Components

**Stat Cards**:
- Rounded-2xl (16px radius) with subtle shadow
- Padding: p-6
- Structure: Icon (32px) + Label (Caption) + Value (H1/Number Display) + Change indicator
- Layout: 2-column grid on mobile (grid-cols-2 gap-4)

**Earnings Chart**:
- Full-width card with p-6 padding
- Time period selector as pill buttons above chart
- Bar/line chart using recharts library with touch-optimized tooltips
- Minimum height: 280px for readability
- Interactive legends with tap-to-toggle series

**Quick Actions Panel**:
- Horizontal scroll of action cards (snap-x scroll-snap-type)
- Each card: 140px width × 120px height
- Icon (40px) + Label (Body) centered vertically
- 4px gap between cards, px-4 container padding

### Form Components

**Shift Logging Form**:
- Single-column layout with generous spacing (gap-6)
- Grouped sections with H3 headers
- Field structure: Label (Inter SemiBold 14px) + Input + Helper text (Caption)
- Input fields: 48px height with p-4 horizontal padding for comfortable tapping
- Currency inputs: Leading $ symbol, right-aligned numbers
- Date/Time pickers: Native mobile pickers with clear visual affordance

**Input Field Styles**:
- Border radius: rounded-xl (12px)
- Border: 2px solid with focus state 2.5px
- Height: 48px minimum (56px for complex selects)
- Icon integration: 20px icons with 12px right margin
- Error states: Red border with error message below (Caption, red text)
- Success states: Green border with checkmark icon

### Cards & Containers

**Shift History Card**:
- Rounded-2xl with p-5 padding
- Header row: Date (H3) + Total earned (Number Display SemiBold)
- Detail rows: Job name • Hours worked • Hourly rate (Body, separated by •)
- Tip breakdown: Cash/Credit split with icons (16px)
- Footer: Swipe actions hint or tap-to-expand indicator

**Job Card** (Multi-job tracking):
- Horizontal layout: Job icon (48px) + Details + Quick add button
- Details: Job name (H3) + Last shift date (Caption)
- Rounded-xl with p-4 padding
- Quick add: Floating action button (40px) aligned right

### Data Display

**Tax Summary Panel**:
- Expandable accordion style
- Header: Federal/State/Local label + Estimated amount
- Expanded: Calculation breakdown in table format
- Table: 2-column (Label | Amount), tabular numbers, 48px row height
- Divider lines between categories (1px, subtle)

**Filters & Sorting**:
- Pill-style filter chips (rounded-full)
- Height: 36px with px-4 horizontal padding
- Icon + Label, 8px gap
- Horizontal scroll container (gap-2)
- Active state: Slightly elevated with stronger border

### Buttons & Actions

**Primary Action Button**:
- Height: 56px on mobile, 48px on tablet+
- Width: Full-width in forms, auto with min-width: 120px elsewhere
- Rounded-2xl (16px radius)
- Text: Poppins SemiBold 16px
- Icon optional: 20px with 8px margin

**Secondary Button**:
- Same dimensions as primary
- Outlined variant with 2px border
- Background: transparent

**Floating Action Button** (Add Shift):
- 64px diameter circle
- Fixed positioning: bottom-24 right-6 (above tab bar)
- Icon: 28px plus symbol
- Drop shadow: large elevation

**Icon Buttons**:
- 44px minimum touch target
- Icon: 24px centered
- Rounded-full or rounded-lg

### Overlays & Modals

**Bottom Sheet**:
- Slides up from bottom, max-height: 90vh
- Rounded top corners: rounded-t-3xl (24px)
- Drag handle: 32px wide, 4px height, rounded-full, centered, mt-2
- Content padding: p-6
- Backdrop: Semi-transparent overlay

**Action Sheets** (Delete confirmation, Export options):
- Same bottom sheet structure
- List items: 56px height, clear tap zones
- Destructive actions: Red text, bottom position
- Cancel button: Separated by divider, bottom-most

**Toast Notifications**:
- Fixed top position (top-4) or bottom (bottom-20, above nav)
- Max-width: calc(100vw - 32px)
- Padding: p-4, rounded-xl
- Icon (20px) + Message (Body) + Close button
- Auto-dismiss: 4 seconds
- Swipe-to-dismiss gesture

### Empty States

**No Data Illustration Area**:
- Centered vertically in available space
- Icon or simple illustration (120px)
- Heading (H2) + Description (Body) + CTA Button
- Vertical spacing: gap-6 between elements
- Max-width: 320px, horizontally centered

---

## Export & Reports

**PDF/CSV Export Preview**:
- Full-screen modal with white background
- Preview area: Simulated paper (rounded-xl, shadow, max-width: 600px)
- Controls: Top bar with Download/Share/Close actions
- Filters recap: Chip display showing selected date range/jobs

---

## Offline Indicator

**Connection Status**:
- Persistent banner when offline: Top of viewport, 40px height
- Icon (20px) + "Offline - Changes will sync" message
- Subtle animation: Pulsing indicator
- Dismissible but reappears on navigation

---

## Dark Mode Adaptations

- Maintain same layout, spacing, and component structure
- Adjust only surface treatments, shadows become glows
- Text contrast: Ensure WCAG AAA compliance for numbers
- Charts: Adjust axis lines and grid opacity, not structure

---

## Accessibility

- All interactive elements: Minimum 44×44px touch targets
- Form labels: Visible, not placeholder-dependent
- Focus indicators: 3px offset outline on keyboard navigation
- Screen reader: Proper ARIA labels for all icons and charts
- Semantic HTML: nav, main, section, article tags
- Swipe actions: Also accessible via long-press menu

---

## Images

**No hero image** - ShiftSavvy is a utility-focused dashboard app that leads directly with data and actions. The app should open to the earnings dashboard showing immediate value.

**Illustrations**: Use simple, friendly line-art illustrations (Undraw style) for empty states only:
- Empty shift history: Illustration of a server/bartender with tablet
- No jobs added: Illustration of multiple location markers
- First-time onboarding: Welcome illustration of money/tips

**Icons**: Material Icons (via CDN) for consistency across interface elements, navigation, and data categories.