---
layout: post
blog_post: true
title: Documentation Is How Senior Engineers Scale
date: 2026-09-19
permalink: /blog/2026/09/19/documentation-is-how-senior-engineers-scale/
reading_time: 7
published: false
author: Kirk Tolleshaug
categories:
  - engineering-practices
tags:
  - documentation
  - communication
  - mentorship
  - scaling-impact
description: Writing things down replaces repeated meetings with a reference other people can use without you in the room.
social_description: Documentation is how senior engineers scale past the limits of their own calendar.
social_image: /blog/2026/09/19/documentation-is-how-senior-engineers-scale/social-preview.png
social_image_alt: Documentation Is How Senior Engineers Scale, a blog post by Kirk Tolleshaug.
---

<!-- DRAFT: date, slug, reading_time, and social-preview.png are placeholders. Update them and flip published to true when this is ready to release. -->

A senior engineer's calendar fills up for a predictable reason: they are the fastest path to an answer. Someone hits an unfamiliar part of the system, or needs to know why a decision was made, or wants a second opinion before a risky change, and the shortest route to confidence is "ask the person who already knows." That instinct is reasonable. It is also the reason the same explanation gets given six times in six different meetings.

Documentation is what breaks that loop. It is not paperwork bolted onto the real work; it is how the answer you already gave once becomes available to the next five people who need it, without you having to be in the room.

## Meetings are a symptom, not the problem

Every recurring meeting exists because some piece of context does not live anywhere durable. A status meeting exists because the plan is not written down where people can check it themselves. A design review gets scheduled twice because the first version of the decision was never captured, so half the room shows up to relitigate it. An onboarding session gets repeated quarter after quarter because the setup steps live only in someone's memory.

None of this is a scheduling problem. It is a context-storage problem, and meetings are the fallback humans reach for when the storage is missing. A meeting is synchronous, expensive, and forgotten within a week unless someone writes it down anyway. Documentation is the same information made asynchronous, cheap to consult, and durable past the moment it was created.

This does not mean every meeting is avoidable, or that documentation replaces judgment, debate, or the kind of conversation where two people actually change their minds. It means most of the meetings that exist purely to transmit information one more time are a sign that the information should have had a home already.

## Writing is how one person's time becomes many people's leverage

A senior engineer's most limited resource is not skill; it is attention. There are only so many hours to spend explaining the same authentication flow, the same deployment process, the same reason a particular shortcut was rejected two years ago. Every one of those explanations given live, one person at a time, is capped by the number of hours in a day.

Written down once, the same explanation is capped by nothing. A design doc, a runbook, a well-placed comment explaining a non-obvious constraint, an architecture decision record: each of these turns a single conversation into a resource that keeps paying out long after the person who wrote it has moved to the next problem. That is the actual mechanism behind "senior engineers scale their impact." It is not that they are present in more places at once. It is that their reasoning is available in more places at once, because they wrote it down where someone else could find it.

This is also why documentation is disproportionately a senior responsibility, not because juniors cannot write, but because a senior engineer usually has more context worth extracting: more of the "why," more of the tradeoffs that were rejected, more of the failure modes only visible in hindsight. Writing that down is not overhead layered onto the job. It is one of the highest-leverage things the job produces.

## What is worth writing down

Not everything deserves a document, and a pile of stale documentation is its own kind of trap. Documentation earns its cost when it answers a question that will be asked more than once, or when losing the reasoning behind a decision would be expensive to reconstruct later. A few categories consistently qualify:

- The decision and its rejected alternatives, not just the final answer. Future readers need to know what was already considered and why it did not work, or they will propose it again.
- The non-obvious constraint behind a piece of code: a rate limit imposed by a vendor, a historical incident that shaped a retry policy, a compliance rule that looks arbitrary until you know the reason.
- The runbook for anything that will need to be operated by someone other than its author, especially under pressure, at an hour when the author is not reachable.
- The onboarding path for a system, so ramping up a new person becomes reading and asking targeted questions, not shadowing a senior engineer for two weeks.

The test is simple: if you can imagine explaining this same thing again in three months to someone who was not in the room today, it belongs somewhere durable.

## Keep it close to the work, and keep it honest

Documentation that lives far from the code or the decision it describes decays quietly. It stops matching reality, and eventually stops being trusted, which is worse than not existing at all, because now it actively misleads. The fixes that hold up in practice are not complicated: keep design notes and runbooks next to what they describe, update them as part of the change that makes them stale, and prefer a short accurate page over a long one nobody keeps current.

It also helps to write for the reader who is confused and in a hurry, not for the reader who already understands the system. State the outcome first, then the reasoning, then the details. A document that requires already knowing the answer to be useful is not documentation; it is a note to yourself.

## What to carry forward

Every recurring meeting that exists purely to transmit information again is a signal that something should have been written down the first time. The fix is rarely "have fewer meetings" as a goal on its own. It is "make the answer available without a meeting," and let the number of necessary meetings fall out from there.

If you are the person people keep asking, that is a sign your knowledge is valuable, not that your calendar has to absorb the cost of it forever. Write it down once, put it where the next person will actually find it, and your answer keeps working long after the meeting would have ended.
