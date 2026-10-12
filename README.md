# EasyMarg

Front end for easymarg.com: the public site, the customer portal and the staff desk.

- **Public site**: `/`, `/home-loans`, `/treasury`
- **Sign-in**: `/login` (customers by mobile + code, team by email + password)
- **Customer portal**: `/portal` (overview), `/portal/files/[id]` (tracker), `/portal/documents` (record room), `/portal/apply` (new application)
- **Staff desk**: `/desk` (queue), `/desk/files/[id]` (review), `/desk/archive`

## Run it

```bash
npm install
npm run dev
```

Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4 (through PostCSS), TypeScript. No animation or 3D library: the hero scene is hand-written WebGL2 in `src/components/site/hero-road.tsx`.

## This is a demo build

There is no backend yet. Everything behind the sign-in runs on sample records:

- `src/lib/data.ts` holds the data model and the sample files, papers and clients. Every name and figure in it is invented.
- `src/lib/store.ts` keeps records in `localStorage` (shared across tabs) and the session in `sessionStorage` (per tab). Open the portal in one tab and the desk in another to watch a paper move between them.
- Sign-in accepts anything. No SMS is sent and no account is checked.
- "Upload" reads a file's name and size only. Nothing leaves the browser, so "Download" has nothing to return.

To go live, replace `src/lib/store.ts` with real API calls. Screens only touch it through `useDemo()` and the `demo` actions.

## Design rules

The interface is built as ink on paper, and every element stands for something real.

| Element | Means |
| --- | --- |
| Blue | The brand block, the primary action, and your current position on the road |
| Green / amber / red stamps | A paper that is checked / with someone else / sent back to you |
| Mono type | Data only: file numbers, amounts, dates |
| Milestone stone | One step on a file's road. Solid line behind you, dashed line ahead |
| Bordered sheet | A literal document: a file, a register, a position sheet |
| Full-width ink rule | The start of a new section |

Tokens live in `src/app/globals.css`. Type is Archivo (wide cut for headings, normal cut for text) and IBM Plex Mono.

### Motion

Motion follows the same rule: it has to mean something.

| Motion | Means |
| --- | --- |
| Hero scene | The marg itself: a road to the horizon, milestone stones on the left shoulder, a dashed centre line for the road ahead. White lines on a transparent canvas, so it adds no colour |
| Road explorer | Walking a file's road by hand. Solid line fills in behind the stone you are standing at |
| Year scrubber on the register | Drag the year forward and nothing in the record changes |
| Strike-through | A thing we will not do, struck out |
| Bars on the position sheet | The share of each limit that is drawn |
| Rise on scroll, hover on rows | Arrival and feedback only: 600ms once on arrival, 150 to 200ms on hover |

Everything honours `prefers-reduced-motion`: the hero draws one still frame and the rest appears without movement. The hero also stops drawing when it is off screen or the tab is hidden.

## Showcase: three reference directions

`/showcase` lists three complete alternative landing pages, built to show clients what EasyMarg could look like in three different visual worlds. They share the live site's copy and positioning and change nothing on the live pages. Each is a self-contained route with its own fonts, tokens, motion and 3D scene.

| | Direction | Canvas and type | Accent and its role | Scene and signature motion |
| --- | --- | --- | --- | --- |
| 01 | **Nightline** `/showcase/nightline` | Midnight `#06080F`, bone `#F2F2EE`, Instrument Serif + Geist + Geist Mono, white pill CTAs | Cobalt `#5B8CFF`: the route, the current stone, live figures only | A contour-line terrain and a lit route; the camera travels it on scroll, one caption per milestone; glow follows the pointer across panels |
| 02 | **Blueprint** `/showcase/blueprint` | White, ink `#121412`, dotted grid, hairlines, Hanken Grotesk 300 display + JetBrains Mono, 2px radii | Acid green `#8AFC8E`: highlight blocks, line art, stamps; never body text | Six wireframe sheets assemble into one file on scroll; the road is a pinned horizontal scroll with the route line drawn as the panels pass; a year rule the reader scrubs by scrolling |
| 03 | **Clay** `/showcase/clay` | Warm stone `#F3EFEB`, ink `#111111`, 32px cushion panels, black pill CTAs, Bricolage Grotesque + DM Sans + DM Mono | Orange `#FF9900`: a decorative thread only, in the scene and one rule | Six matte clay milestones stand up one by one as the camera comes round; an accordion road; cushions that lift on hover |

Reference locks come from the Refero research in the session that built the live site: Nightline from Origin Financial and Mercury with Sandclock's signal-colour discipline; Blueprint from Exante with Column's grid and 19-86's index rhythm; Clay from Titan with Wealthsimple's sculptural still life and Monzo's cushion panels. None is a copy; each keeps its primary reference's sharp traits and borrows one or two details.

Built with React Three Fiber (three.js), GSAP ScrollTrigger and Lenis. The shared pieces live in `src/showcase/`: the copy, the smooth-scroll provider, and small motion primitives (line-split reveals, rise-on-scroll, magnetic buttons, counters). Every page respects `prefers-reduced-motion`, stops drawing when the scene is off screen, and is marked `noindex`.

## Before launch

- Swap the provisional wordmark in `src/components/brand.tsx` for the registered logo.
- Have the business and legal claims in the site copy reviewed: the "four things we will not do", the footer disclaimer, the treasury desk's scope, and the score bands on `/home-loans`.
