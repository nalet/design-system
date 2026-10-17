---
layout: ../../layouts/Doc.astro
title: principles
description: Five principles decide what a screen does and what it leaves out, a baseline that is never traded, and the identity that makes every surface ours.
draft: true
---
# principles

Five principles decide what a screen does and what it leaves out. When two pull apart, the earlier one wins. Underneath them sits a baseline that is never traded away, and around them an identity that makes every surface recognisably ours.

## 1. the system does the work; people handle the exceptions

Routine work — searching, retrying, converting, cleaning up — happens on its own, within limits a person set once. A screen opens on what needs a person, then on what is on its way, and only then on everything else. A list of two thousand things for someone to work through by hand is a missing automation, not a worklist.

- **This:** `needs attention 3 · on its way 12`, with the full backlog one click away.
- **Not that:** 2,500 rows, each with its own button.

In practice:
- An operator app lands on its exceptions; the complete list is a drill-down.
- Automatic behaviour is on by default within safe limits, explains what it did, and can be undone.
- A person is asked only for what the system cannot decide.

## 2. the outcome is the status

Every object has one status, and it answers the question the person actually has — *Can I use it yet?* — not which internal step happens to be running. The status means the same in every app that shows the object. The steps behind it are its detail.

- **This:** `needs attention · can't be converted`.
- **Not that:** `download completed`, in green, for a file that will never play.

In practice:
- One vocabulary per domain, mapped once onto neutral, information, success, warning and error — see [status vocabulary](/design-system/patterns/status-vocabulary/).
- Colour follows meaning: a warning is never green, a failure is never hidden to keep a list looking healthy.
- What cannot be known says so (`can't be checked`) instead of looking empty or fine.

## 3. people's words first, the system's detail one click away

Primary text is written for the person in front of the screen, not for the program behind it. IDs, file names, codecs, error codes and raw messages stay available — under details, in a tooltip, in the log — but never as the sentence.

- **This:** `The Quiet Harbour · S04E07 · can't be converted`, the file's codec under details.
- **Not that:** `Quiet.Harbour.S04E07.2160p.h265-GRP · FAILURE/PAR`.

In practice:
- A message says what is true, what it means, and what the person can do — see [content & voice](/design-system/foundations/content-voice/) and [message handling](/design-system/patterns/message-handling/).
- A button starts with a verb and names its object: `grab 8 selected`, never `ok`.

## 4. one platform, many apps

Apps live inside one shell. The shell owns what every app needs in the same way: sign-in, navigation, search, notifications, settings — and the design system itself, loaded once. An app owns its content.

- **This:** one tile per app, opening on that app's exceptions; its setup found under settings, edited in the app.
- **Not that:** one tile per tab of an app, and setup screens beside daily work.

In practice:
- A tile opens an app, not a place inside it. Task shortcuts are the exception, not the navigation.
- Apps link to each other by intent — `open in catalog` — instead of rebuilding each other's screens.
- Every app uses the version of the design system the shell provides, so a page never mixes two.
- One shell bar everywhere: the same lockup, notifications and user menu in the portal, in every app and in every product.

## 5. calm and quick

A screen shows what is true and the one next step, and little else. One emphasized action per view, a toolbar or a dialog. No decoration, no motion that isn't feedback, no colour that doesn't mean something. It is fast to scan, fast to load, and complete from the keyboard.

- **This:** one primary button, the rest default or in a menu.
- **Not that:** a primary button on every row.

## the baseline — never traded

These are not weighed against the principles; every screen meets them.

- **Accessible.** WCAG 2.2 AA: every text colour meets 4.5:1 on every background (a test keeps it so), controls have their roles and names, focus is visible and returns where it came from. See [accessibility](/design-system/foundations/accessibility/).
- **Keyboard complete.** Everything works without a pointer; a composite widget takes one tab stop and moves with the arrow keys.
- **Responsive.** A long list stays fast; a screen works at phone width.
- **Truthful documentation.** Where a component falls short of these principles today, its page says so.

## the identity — what makes it ours

Dark canvas, the blue `>` chevron, square frames, monospace for data and labels. The identity can evolve without changing the principles — see [brand](/design-system/styles/brand/).

## using the principles

- In a review, name the principle: *"This breaks 2 — it says completed, but it won't play."*
- When two conflict, the earlier wins. An automation that removes a screen (1) beats a better screen for doing the work by hand (5).
- A pattern or component that cannot be explained by a principle is a candidate for removal.
