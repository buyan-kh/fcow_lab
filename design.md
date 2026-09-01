# whop.com — Design System

## 1. Visual Theme & Atmosphere

Whop occupies the intersection of SaaS ambition and underground-internet energy. The dominant mode is dark — near-black backgrounds with high-contrast off-white text — but the brand refuses to be merely “another dark app.” It injects electric bursts of electric-lemon yellow (`#dbf505`) and searing orange-red (`#fa4616`) into an otherwise restrained palette, signalling speed, novelty, and irreverence. The overall atmosphere reads like a neon sign in a blacked-out room: precise, intentional, impossible to ignore. The dual-typeface strategy — a custom grotesque for display, Inter for everything else — keeps the brand voice confident without becoming chaotic.

## 2. Color Palette & Roles

| Role | Value | Usage |
|---|---|---|
| Page canvas | `#111111` | Main content area, section backgrounds |
| Overlay/frosted panel | `rgba(29,29,29,0.85)` | Sticky header — glassmorphic dark panel |
| Elevated surface | `#222222` | Cards, modals |
| Light frosted | `#f9f9f9` | Occasional light-mode inset components |
| Primary text (dark surfaces) | `#eeeeee` | Body copy on dark |
| Primary text (light surfaces) | `#202020` | Body copy on light |
| Muted | `#484848` | Secondary labels, captions |
| Blue (CTA) | `#1754d8` | Primary action buttons, links |
| Lemon yellow | `#dbf505` | Hero badges, highlight banners, energy accents |
| Orange-red | `#fa4616` | Warning badges, pricing highlights, urgency signals |
| Orange tint | `rgba(255,40,0,0.176)` | Soft background for orange-bordered elements |

Borders use `rgba(255,255,255,0.106)` on dark surfaces and `rgba(0,0,0,0.12)` on light surfaces.

## 3. Typography Rules

Whop uses a two-tier font system. AcidGrotesk — or a condensed grotesque fallback — owns headline moments. Inter handles everything functional.

| Selector | Font | Size | Weight | Line Height | Tracking |
|---|---|---|---|---|---|
| H1 | AcidGrotesk | 80px | 700 | 88px | −4.45px |
| H2 | AcidGrotesk | 40px | 500 | 44px | −2.225px |
| Body | Inter | 16px | 400 | 24px | normal |
| Paragraph | Inter | 24px | 400 | 30px | −0.39px |
| Button | Inter | 16px | 500 | 24px | −0.18px |

Large headlines use negative tracking for a dense, authoritative voice. Body copy stays readable and is not reduced to metadata scale. Do not use uppercase transforms; the voice is lowercase confidence.

## 4. Component Styling

Buttons use a 1px inset ring shadow for subtle depth without elevation. Badges use saturated lemon or orange-red backgrounds with matching full-saturation text. The navigation header is a slim frosted dark panel with an almost invisible white border and a subtle blur.

Border radii range from 8px for inputs and small chips to 24px for larger cards and hero panels. Depth comes from flat color layers and inset rings, not large drop shadows.

## 5. Layout Principles

Use full-bleed dark sections with spacing inside components. Keep the header slim and sticky. Avoid exposing a generic max-width dashboard container; use internal column constraints where content needs readable measure.

## 6. Depth & Elevation

The elevation ladder is:

1. `#111111` base canvas
2. `#222222` raised cards
3. `rgba(29,29,29,0.85)` floating header
4. `#f9f9f9` or white focused insets

Use inset 1px rings as the primary depth signal. Avoid ambient drop shadows.

## 7. Do’s and Don’ts

Do:

- Use lemon or orange as a scarce accent, one energetic moment per view.
- Apply negative letter-spacing to display text.
- Keep structural UI dark and reserve white surfaces for focused insets.
- Use Inter at 500 weight for buttons.

Don’t:

- Use AcidGrotesk below 32px.
- Mix lemon and orange in the same visual zone.
- Add elevation drop-shadows.
- Use uppercase transforms.

## 8. Responsive Behavior

Keep sections full-bleed at every width. Reduce header padding on small screens, scale paragraph text down from 24px, and reduce headline tracking proportionally. Navigation collapses to minimal controls without creating a second visual language.

## 9. Application to Frontier Bio Research Diligence

Apply this system to the evidence-backed Research Diligence prototype, not to invent new scientific content. The product remains source-backed and research-only. The UI should make the real decision legible: whether a target deserves another experiment or more capital.

- Use near-black canvas and off-white type for the diligence shell.
- Use lemon for one primary “run diligence” or “verified” moment.
- Use orange-red only for contradiction, uncertainty, or review-needed states.
- Use blue for primary actions and source links.
- Keep labels lowercase and plain; do not add marketing claims.
- Preserve visible source, uncertainty, and research-only boundaries.
- Keep local fixtures clearly labeled as test data; never present them as real evidence.
