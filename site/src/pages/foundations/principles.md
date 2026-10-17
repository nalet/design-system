---
layout: ../../layouts/Doc.astro
title: principles
description: five principles decide what a screen does and what it leaves out, a baseline that is never traded, and the identity that makes every surface ours.
draft: true
---
# principles

five principles decide what a screen does and what it leaves out. when two pull apart, the earlier one wins. underneath them sits a baseline that is never traded away, and around them an identity that makes every surface recognisably ours.

## 1. the system does the work; people handle the exceptions

routine work — searching, retrying, converting, cleaning up — happens on its own, within limits a person set once. a screen opens on what needs a person, then on what is on its way, and only then on everything else. a list of two thousand things for someone to work through by hand is a missing automation, not a worklist.

- **this:** `needs attention 3 · on its way 12`, with the full backlog one click away.
- **not that:** 2,500 rows, each with its own button.

in practice:
- an operator app lands on its exceptions; the complete list is a drill-down.
- automatic behaviour is on by default within safe limits, explains what it did, and can be undone.
- a person is asked only for what the system cannot decide.

## 2. the outcome is the status

every object has one status, and it answers the question the person actually has — *can i use it yet?* — not which internal step happens to be running. the status means the same in every app that shows the object. the steps behind it are its detail.

- **this:** `needs attention · can't be converted`.
- **not that:** `download completed`, in green, for a file that will never play.

in practice:
- one vocabulary per domain, mapped once onto neutral, information, success, warning and error — see [status vocabulary](/design-system/patterns/status-vocabulary/).
- colour follows meaning: a warning is never green, a failure is never hidden to keep a list looking healthy.
- what cannot be known says so (`can't be checked`) instead of looking empty or fine.

## 3. people's words first, the system's detail one click away

primary text is written for the person in front of the screen, not for the program behind it. ids, file names, codecs, error codes and raw messages stay available — under details, in a tooltip, in the log — but never as the sentence.

- **this:** `The Quiet Harbour · S04E07 · can't be converted`, the file's codec under details.
- **not that:** `Quiet.Harbour.S04E07.2160p.h265-GRP · FAILURE/PAR`.

in practice:
- a message says what is true, what it means, and what the person can do — see [content & voice](/design-system/foundations/content-voice/) and [message handling](/design-system/patterns/message-handling/).
- a button starts with a verb and names its object: `grab 8 selected`, never `ok`.

## 4. one platform, many apps

apps live inside one shell. the shell owns what every app needs in the same way: sign-in, navigation, search, notifications, settings — and the design system itself, loaded once. an app owns its content.

- **this:** one tile per app, opening on that app's exceptions; its setup found under settings, edited in the app.
- **not that:** one tile per tab of an app, and setup screens beside daily work.

in practice:
- a tile opens an app, not a place inside it. task shortcuts are the exception, not the navigation.
- apps link to each other by intent — `open in catalog` — instead of rebuilding each other's screens.
- every app uses the version of the design system the shell provides, so a page never mixes two.
- one shell bar everywhere: the same lockup, notifications and user menu in the portal, in every app and in every product.

## 5. calm and quick

a screen shows what is true and the one next step, and little else. one emphasized action per view, a toolbar or a dialog. no decoration, no motion that isn't feedback, no colour that doesn't mean something. it is fast to scan, fast to load, and complete from the keyboard.

- **this:** one primary button, the rest default or in a menu.
- **not that:** a primary button on every row.

## the baseline — never traded

these are not weighed against the principles; every screen meets them.

- **accessible.** wcag 2.2 aa: every text colour meets 4.5:1 on every background (a test keeps it so), controls have their roles and names, focus is visible and returns where it came from. see [accessibility](/design-system/foundations/accessibility/).
- **keyboard complete.** everything works without a pointer; a composite widget takes one tab stop and moves with the arrow keys.
- **responsive.** a long list stays fast; a screen works at phone width.
- **truthful documentation.** where a component falls short of these principles today, its page says so.

## the identity — what makes it ours

dark canvas, the blue `>` chevron, square frames, monospace for data and labels. the identity can evolve without changing the principles — see [brand](/design-system/styles/brand/).

## using the principles

- in a review, name the principle: *"this breaks 2 — it says completed, but it won't play."*
- when two conflict, the earlier wins. an automation that removes a screen (1) beats a better screen for doing the work by hand (5).
- a pattern or component that cannot be explained by a principle is a candidate for removal.
