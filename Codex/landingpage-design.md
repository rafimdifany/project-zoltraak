# Landing Page Design Overview

```
C:\project-zoltraak> analyze landing-page
```

- **Overall Layout**  
  The page uses a `max-w-6xl` centered container with generous vertical spacing (`pt-10`, `space-y-24`) to create an airy fintech feel. Sections stack vertically with rounded-rectangle cards framed by subtle borders and shadows that echo glassmorphism.

- **Sticky Navigation**  
  A rounded, semitransparent header sits inside a `sticky top-6` wrapper so it appears to float while scrolling. The nav groups product anchor links (`Overview`, `Product Suite`, `Platform`, `Customers`) with primary CTAs (`Sign in`, `Get started`).

- **Hero / Overview (`#overview`)**  
  Large headline and supporting copy introduce the unified finance command center. CTA buttons (“Start free workspace”, “Talk with finance expert”) sit in front of a blurred gradient highlight, while a data card mockup reinforces credibility with live metrics and AI insights.

- **Product Suite Highlights (`#product`)**  
  A three-column grid presents feature cards with hover-friendly, rounded containers. Each card lists benefits (e.g., multi-entity workflows, predictive cash insights, automated close). Icons can be layered in later to add quick visual cues.

- **Operating Platform (`#platform`)**  
  Split layout contrasts explanatory copy with two stacked cards: the left card outlines platform pillars (“Plan, Operate, Grow”), and the right card focuses on metrics and compliance, showcasing trust signals like SOC 2 and audit readiness.

- **Customer Stories (`#customers`)**  
  Testimonial block and supporting narrative highlight impact metrics (“47% faster board reporting…”) and community proof points. Layout alternates text alignment to keep rhythm and emphasize the quote.

- **Call-to-Action Footer**  
  Final section returns to centered layout with bold headline, supportive copy, and dual CTAs (“Create workspace”, “Schedule demo”) to capture conversions. Rounded card styling ties back to the hero.

- **Visual Language**  
  Tailwind utilities deliver glassy surfaces (`bg-background/80`, `backdrop-blur`), soft borders, and subtle shadows. Color palette leans on neutrals with primary accents, leaving room to introduce the specified Lunaris brand hues. Typography remains modern and legible with Inter, ready for swap to Plus Jakarta Sans if desired.

```
C:\project-zoltraak> task complete
```
