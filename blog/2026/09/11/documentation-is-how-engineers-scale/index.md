---
layout: post
blog_post: true
title: Documentation Is How Engineers Scale
date: 2026-09-11
permalink: /blog/2026/09/11/documentation-is-how-engineers-scale/
published: true
author: Kirk Tolleshaug
categories:
  - engineering-practices
tags:
  - documentation
  - scaling-impact
  - maintainability
  - developer-experience
  - ai-assisted-development
description: Writing things down turns an answer given once into a reference others can use without you. Kept with the code, maintained like code, and generated where it can be.
social_description: Write your reasoning down once and it keeps working for whoever needs it next, people and their tools alike.
social_image: /blog/2026/09/11/documentation-is-how-engineers-scale/social-preview.png
social_image_alt: Documentation Is How Engineers Scale, a blog post by Kirk Tolleshaug.
---

A senior engineer's calendar fills up for a predictable reason: they are the fastest path to an answer. Someone hits an unfamiliar part of the system, or needs to know why a decision was made, or wants a second opinion before a risky change, and the shortest route to confidence is "ask the person who already knows."

{% include post-video.html name="whatnewsoftheoutsideworld" label="Gandalf visits Bag End and Frodo asks for news of the outside world." credit="<cite>The Lord of the Rings: The Fellowship of the Ring</cite> (2001), directed by Peter Jackson. Copyright © 2001 New Line Cinema." %}

That instinct is reasonable. It is also the reason the same explanation gets given six times in six different meetings.

Documentation is what breaks that loop. It is not paperwork bolted onto the real work; it is how the answer you already gave once becomes available to the next five people who need it, without you having to be in the room.

It also outlasts you. People change teams, go on leave, or move to other companies; the systems they understood do not politely pause while someone else catches up. Whatever was only ever explained out loud leaves when the person does. Whatever was written down stays.

## Meetings are a symptom, not the problem

Every recurring meeting exists because some piece of context does not live anywhere durable. A status meeting exists because the plan is not written down where people can check it themselves. A design review gets scheduled twice because the first version of the decision was never captured, so half the room shows up to relitigate it. An onboarding session gets repeated quarter after quarter because the setup steps live only in someone's memory.

{% include post-video.html name="councilofelrond" label="The Council of Elrond debates what to do with the Ring." credit="<cite>The Lord of the Rings: The Fellowship of the Ring</cite> (2001), directed by Peter Jackson. Copyright © 2001 New Line Cinema." %}

None of this is a scheduling problem. It is a context-storage problem, and meetings are the fallback humans reach for when the storage is missing. A meeting is synchronous, expensive, and forgotten within a week unless someone writes it down anyway. Documentation is the same information made asynchronous, cheap to consult, and durable past the moment it was created.

This does not mean every meeting is avoidable, or that documentation replaces judgment, debate, or the kind of conversation where two people actually change their minds. It means most of the meetings that exist purely to transmit information one more time are a sign that the information should have had a home already.

## Writing is how one person's time becomes many people's leverage

An engineer's most limited resource is not skill; it is attention. There are only so many hours to spend explaining the same authentication flow, the same deployment process, the same reason a particular shortcut was rejected two years ago. Every one of those explanations given live, one person at a time, is capped by the number of hours in a day.

Written down once, the same explanation is capped by nothing. A design doc, a runbook, a well-placed comment explaining a non-obvious constraint, an architecture decision record: each of these turns a single conversation into a resource that keeps paying out long after the person who wrote it has moved to the next problem. That is the actual mechanism behind "scaling your impact." It is not that you are present in more places at once. It is that your reasoning is available in more places at once, because you wrote it down where someone else could find it.

This is also why the responsibility falls heaviest on whoever holds the most context, not because other people cannot write, but because that person usually has the most worth extracting: more of the "why," more of the tradeoffs that were rejected, more of the failure modes only visible in hindsight. Writing that down is not overhead layered onto the job. It is one of the highest-leverage things the job produces.

## Who you are actually writing for

That leverage only shows up if the writing reaches the people who need it, and that starts with being honest about who they are. It is easy to write for the reader who already understands the system, because that reader is the one in your head while you type. That reader does not need the document.

{% include post-video.html name="thereandbackagain" label="Frodo reads Bilbo's book, There and Back Again." credit="<cite>The Lord of the Rings: The Fellowship of the Ring</cite> (2001), directed by Peter Jackson. Copyright © 2001 New Line Cinema." %}

The people who do are missing the context you have right now, and none of them will have you on hand to fill the gap:

- **The next hire, three months from now**, who holds none of the context you are currently carrying and does not yet know which questions to ask.
- **The engineer on call at 2 a.m.**, staring at an alert for a system they have never touched, who needs the outcome and the next step, not the history.
- **The team that inherits the system** after a reorg, with no one left who was in the original design discussion.
- **A reviewer** trying to judge whether a change is safe without reconstructing every constraint from scratch.
- **You, in a year**, back in this code long enough to have forgotten why it is shaped the way it is, and short on time to rediscover it.
- **The AI assistant** a teammate points at the repository, which can only act on what is written down.

Writing for these readers means saying the thing you would consider too obvious to state out loud, because for them it is not obvious, and that is the whole point. Lead with the outcome, then the reasoning, then the details. A document that only makes sense to someone who already knows the answer is not documentation; it is a note to yourself.

## What is worth writing down

Knowing the reader narrows the next question: what actually needs a document. Not everything does. Writing earns its cost when it answers a question that will be asked more than once, or when losing the reasoning behind a decision would be expensive to reconstruct later. A few categories consistently qualify:

- **The decision and its rejected alternatives**, not just the final answer. Future readers need to know what was already considered and why it did not work, or they will propose it again.
- **The non-obvious constraint behind a piece of code**: a rate limit imposed by a vendor, a historical incident that shaped a retry policy, a compliance rule that looks arbitrary until you know the reason.
- **The runbook for anything that will be operated by someone other than its author**, especially under pressure, at an hour when the author is not reachable.
- **The onboarding path for a system**, so ramping up a new person becomes reading and asking targeted questions rather than shadowing someone who knows it for two weeks.

The test is simple: if you can imagine explaining this same thing again in three months to someone who was not in the room today, it belongs somewhere durable.

{% include post-video.html name="mellon" label="Gandalf speaks the password at the Doors of Durin." credit="<cite>The Lord of the Rings: The Fellowship of the Ring</cite> (2001), directed by Peter Jackson. Copyright © 2001 New Line Cinema." %}

## Keep the documentation in the repository

Once you know what to write, where it lives decides whether it stays true. The closer documentation sits to the code, the more likely it is to be updated in the same change, seen by the same reviewer, and found by the person who needs it. That argues for a few layers, in rough order of how much context each one can carry:

- **Comments in the source**, for the reasoning that only makes sense right next to the line it explains. A comment saying why a retry count is three and not five is worth more than a wiki page nobody will ever connect to that function.
- **Structured comments that tooling can extract**, in whatever doc-comment form the language supports, so the same explanation appears in generated reference docs, in editor tooltips, and in an AI assistant's view of the code, with no second copy to maintain.
- **README files beside the code they describe**, for everything a comment cannot hold: what the module is for, how data moves through it, a diagram of the request path, a worked example, an image of the thing behaving correctly. A README with a dataflow diagram and a concrete example is often the single most useful artifact in a subsystem.

All of it is version-controlled, so the documentation moves with the branch, shows up in the diff, and cannot be missed when the change is reviewed.

## What does not count as documentation

Two things routinely fill the space where real documentation should be. Both sit apart from the code, and neither one does the job.

**A separate documentation platform.** It drifts in two directions at once: it is written for an audience that includes non-engineers, so it stays high-level enough to be safe for that audience and too high-level to answer an implementation question; and it is one more place to keep in sync, disconnected from the change that made it wrong, so it usually is wrong. A polished wiki page describing the system as it was designed two years ago is not documentation; it is a record of a planning process.

**Tickets and pull request history.** A well-written ticket or PR description is genuinely useful for understanding what a specific change was and why it happened, and that record is worth keeping. But it is not where someone goes to learn how the system works now. It is scattered across hundreds of issues, searchable only if you already know what you are looking for, and effectively gone the moment the people involved move on to the next thing. If something learned in a ticket matters past that ticket, it has to be lifted into a doc that lives with the code.

## Documentation is a living artifact, not a one-time deliverable

A home in the repository is necessary but not sufficient. Treating documentation as something you produce once and file away is how it turns into a liability: a page that no longer matches reality is worse than a missing one. A missing page sends someone to ask a person; a wrong page sends them confidently in the wrong direction. Stale documentation does not degrade gracefully. It fails silently, and the reader usually finds out only after acting on it.

{% include post-video.html name="ruins" label="The Fellowship finds the ruined halls of Moria." credit="<cite>The Lord of the Rings: The Fellowship of the Ring</cite> (2001), directed by Peter Jackson. Copyright © 2001 New Line Cinema." %}

Documentation stays useful only when it is maintained the way code is maintained:

- **It changes in the same commit as the code.** If a change makes a document wrong, fixing the document is part of that change, not a follow-up ticket that never gets picked up. Updating the doc in the same pull request also gives the reviewer a chance to catch a mismatch.
- **It gets deleted when it is dead.** Four contradictory pages about the same subsystem is not four times as documented; it is undocumented with extra steps. Removing what is no longer true is maintenance, not loss.
- **It is checked for accuracy when someone is already in the area.** Not on a rigid schedule, but when a person touches the code and notices that the page and reality have drifted apart, closing that gap is the work, not a distraction from it.

{% include post-video.html name="rivendell" label="The hidden valley of Rivendell." credit="<cite>The Lord of the Rings: The Fellowship of the Ring</cite> (2001), directed by Peter Jackson. Copyright © 2001 New Line Cinema." %}

None of this makes documentation a lesser artifact that merely props up the code. The code shows what the system does; for anyone who was not there when it was written, the documentation is the only place the reasoning survives: the approaches that were tried and abandoned, the failure that shaped a design, the constraint that makes an obvious simplification wrong. Losing that is losing part of the system, even when every line still compiles. A short, accurate page that is kept current beats a thorough one that no one trusts.

## Automate the parts that can be generated

Keeping pages current is easier when fewer of them are written by hand. Some documentation should not be: when the source of truth already exists in the code, the job is to render it, not to transcribe it.

- **API reference from the interface itself.** An OpenAPI spec generated from the handlers and published as browsable docs stays correct because it is derived from the same code the service runs. A hand-maintained endpoint list drifts the first time someone forgets to update it.
- **Reference docs and a browsable wiki from doc comments.** The structured comments in the source compile into a navigable site, so the explanation written once next to the code becomes the page a reader actually lands on.
- **Diagrams from declarations.** Dependency graphs, schema diagrams, and sequence diagrams generated from code or from a checked-in definition update themselves when the thing they describe changes.

Presentation is part of the value here. A generated site with search, cross-links, and rendered diagrams is a place people will go; a raw file that requires cloning the repo to read, valuable as it is, is not. Wire the generation into CI so it runs on every merge, and the published docs stay within one commit of reality without anyone having to remember them.

## AI lowers the cost of the part a person still has to write

Generation covers what the code can already describe about itself. The rest still needs a person, and the honest reason that part gets skipped is that writing it well is slow and tedious, with a payoff that is deferred and diffuse. That cost is exactly what current AI tools are good at lowering:

- **Turning work you already did into a first draft.** A design discussion, a pull request description, a thread where a decision got made: an assistant can turn any of these into a structured draft of a design doc or an architecture decision record, so the task becomes editing rather than facing a blank page.
- **Explaining unfamiliar code as a starting point.** Pointed at a module, an assistant can produce a walkthrough that someone who knows the system can correct in minutes, which is faster than writing it from nothing.
- **Finding what has gone stale.** Asked to compare a document against the current code, an assistant is good at spotting the paragraph that no longer matches a function signature, a renamed field, or a changed default.
- **Keeping the mechanical parts current.** Configuration references, parameter lists, environment setup steps: the pieces that rot fastest are the ones a tool can regenerate or verify on each change.

Two caveats matter. First, an assistant can produce a draft, but a person still has to check it: it will state a plausible but incorrect reason for a decision, and only someone with the context can catch that. Second, assistants are not only writers of documentation anymore; they are readers of it too. Teams increasingly point AI assistants at their own repositories to answer questions and make changes, and those assistants can only work from what is written down. Good documentation used to scale your reasoning to other people; now it scales your reasoning to the tools those people use as well. The constraint you never wrote down is the one an assistant will violate on your behalf.

## What to carry forward

Every recurring meeting that exists purely to transmit information again is a signal that something should have been written down the first time. The fix is rarely "have fewer meetings" as a goal on its own. It is "make the answer available without a meeting," and let the number of necessary meetings fall out from there.

None of this works without the discipline to actually do it. Structure, tooling, and automation lower the cost of good documentation; they do not remove the need to sit down and write the part only a person knows, or to fix the page when the code moves under it. That habit is the whole thing. The time it costs is small and spent now; the time it saves is large and paid back every time someone finds the answer without needing you.

If you are the person people keep asking, that is a sign your knowledge is valuable, not that your calendar has to absorb the cost of it forever. Write it down, put it where the next person will actually find it, keep it honest as the system changes, and let the tools that now read your repository do some of the upkeep. Your answer keeps working long after the meeting would have ended.

{% include post-video.html name="accountofisildur" label="Gandalf reads Isildur's account in the archives of Minas Tirith." credit="<cite>The Lord of the Rings: The Fellowship of the Ring</cite> (2001), directed by Peter Jackson. Copyright © 2001 New Line Cinema." %}