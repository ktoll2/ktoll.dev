---
layout: post
blog_post: true
title: Slow Is Smooth, Smooth Is Fast
date: 2026-09-05
permalink: /blog/2026/09/05/slow-is-smooth-smooth-is-fast/
reading_time: 8
published: true
author: Kirk Tolleshaug
categories:
  - engineering-practices
tags:
  - planning
  - collaboration
  - software-delivery
  - reliability
description: Taking time to clarify the work, align the people involved, and surface failure modes makes delivery faster where it matters.
social_description: Deliberate planning reduces coordination overhead, defects, and rework, creating the fastest reliable path to production.
social_image: /blog/2026/09/05/slow-is-smooth-smooth-is-fast/social-preview.png
social_image_alt: Slow Is Smooth, Smooth Is Fast, a blog post by Kirk Tolleshaug.
---

“Slow is smooth, smooth is fast” has become more than a military saying. It is a principle that applies in many contexts.

Taking a deliberate approach helps work move forward without unnecessary hiccups. Fewer setbacks and less rework create the fastest path to a reliable outcome.

The goal is not to make every task a ceremony. It is to spend a small, deliberate amount of time making the path through the work smooth enough that execution can stay fast and predictable.

## The allure of speed

Something new and exciting appears: a capability to build, a customer request to chase, an incident to solve, or a chance to finally replace a frustrating part of the system. The instinct is to engage the hyperjets and go straight to ludicrous speed.
<figure class="post-media">
  <video class="post-animation" loop muted playsinline preload="metadata" poster="ludicrousspeedgo-still.jpg" aria-label="Ludicrous speed scene">
    <source src="ludicrousspeedgo.webm" type="video/webm">
    <source src="ludicrousspeedgo.mp4" type="video/mp4">
  </video>
  <figcaption><cite>Spaceballs</cite> (1987), directed by Mel Brooks. Copyright © 1987 Metro-Goldwyn-Mayer.</figcaption>
</figure>

The excitement is not the problem. The problem is allowing it to crowd out every other consideration. Going fast at all costs rests on a few attractive assumptions:

- The unanswered questions will stay small.
- The first implementation proves the direction is right.
- Anything missed can be cleaned up later.

Visible activity then becomes evidence of progress. A branch exists, code is moving, and decisions are turning into implementation. The ambiguity has not disappeared; it has only moved downstream, where changing direction will be more expensive.

Sooner or later, reality catches up: a new bug surfaces, an old dependency fails, or the requirements shift. Changing course now feels like losing ground. “Just get it done” becomes the response precisely when the team is uncovering the information it needed to make the right decision.

What follows is not one correction, but a cascade:

- A rushed change introduces another bug, so the next fix is rushed too.
- An unclear contract breaks a consumer, so the interface expands beyond what either side needs.
- A missed failure mode becomes an urgent patch layered onto an already unstable change.

Each correction adds more assumptions, more coordination, and more momentum in the wrong direction. Before long, “We can’t stop, we have to slow down first” stops being a joke and becomes the project’s operating condition.
<figure class="post-media">
  <video class="post-animation" loop muted playsinline preload="metadata" poster="emergencystop-still.jpg" aria-label="Emergency stop scene">
    <source src="emergencystop.webm" type="video/webm">
    <source src="emergencystop.mp4" type="video/mp4">
  </video>
  <figcaption><cite>Spaceballs</cite> (1987), directed by Mel Brooks. Copyright © 1987 Metro-Goldwyn-Mayer.</figcaption>
</figure>

Speed rarely delivers the results it promises when it promises them. Reality seldom follows a straight path, and charging ahead without accounting for its turns only gets us to the wrong place faster.

**Excitement → assumptions → apparent progress → reality → cascading corrections → failure and damage.**

## Avoiding the speed trap

The slow part happens before implementation. It sets the work up so that people can move with confidence and removes the uncertainty most likely to create rework.

Before starting, take enough time to make a few things explicit:

- Define the outcome, the non-negotiable constraints, and what "done" means.
- Identify the first unknowns to resolve rather than burying them in implementation.
- Break the work into a sensible sequence, including dependencies and decision points.
- Decide how the change will be tested and how its behavior will be observed after release.
- Name the people who need to make decisions, review the work, or be ready to support it.

For a small, isolated change, this may take five minutes and a short note in the ticket. For a new integration, a performance-sensitive path, or a migration, it may mean a design note, a diagram, or a focused conversation before anyone starts coding. Planning should match the consequence of getting something wrong.

The allure of speed is strongest when activity can be mistaken for progress. A branch, a prototype, or a quick implementation can make it feel as though the work is already underway, even when its most important questions are unanswered.

Counter that impulse by time-boxing the setup work and making open questions visible. Treat an unverified assumption as a risk to resolve rather than a detail to clean up later. When a critical question remains unanswered or unclear, delay implementation until it is resolved.

This preparation turns hidden uncertainty into work that can be sized, sequenced, and assigned deliberately, so the team can accelerate without creating the next round of corrections.

## Alignment reduces waiting

Planning for a decision is not complete until the people needed to make or carry it out have a shared understanding of it. That may include the people defining the need, building the change, reviewing it, operating it, and depending on its interfaces or outcomes. Leaving out a relevant perspective does not remove its constraints; it usually means discovering them later.

Bring those perspectives together early enough to validate the goal, not merely the implementation. Confirm the outcome everyone is working toward, the constraints that cannot be compromised, the assumptions that still need evidence, and the decisions that have already been made. A short design note, a diagram of the request path, or a focused kickoff can make that conversation concrete.

The artifact matters less than the confirmation it creates: the people involved should be able to explain the goal, their role, the important contracts, and what happens next. That alignment makes parallel work safer. One person can update an API while another prepares a consumer, tests, or observability because the interface and sequence are understood. Without it, parallelism often just creates more places for the same ambiguity to surface.

## Think through failure before it becomes a production incident

Good planning also makes quality cheaper, but it does not mean predicting every possible failure. The aim is to identify the pain points most likely to affect users, operators, and the team's ability to deliver.

<figure class="post-media">
  <video class="post-animation" loop muted playsinline preload="metadata" poster="whatwhatandthewhat-still.jpg" aria-label="Dark Helmet looks confused beside Colonel Sandurz, with the caption: What? What? What?">
    <source src="whatwhatandthewhat.webm" type="video/webm">
    <source src="whatwhatandthewhat.mp4" type="video/mp4">
  </video>
  <figcaption><cite>Spaceballs</cite> (1987), directed by Mel Brooks. Copyright © 1987 Metro-Goldwyn-Mayer.</figcaption>
</figure>

Before implementation, walk through the unhappy paths that are plausible and costly: retries, partial failures, duplicate messages, stale data, timeouts, authorization boundaries, schema changes, and rollback. Ask where the system is fragile, where a person will be blocked or confused, and what will be hardest to diagnose under pressure. Not every risk needs a large solution, but the important ones deserve an explicit decision.

Addressing those pain points early may mean simplifying a flow, validating an assumption, adding a test, improving an error message, or defining a rollback path. This is especially valuable in backend systems, where the happy path can work while the system still behaves poorly under load, during a dependency outage, or after a deploy. Ignoring a likely failure mode does not remove it; it moves the decision to an incident, a rushed review, or a late test failure.

## Keep the planning lightweight and actionable

Planning becomes counterproductive when it pursues a perfect document instead of the answers needed to move forward. Agile planning is not the absence of planning; it is doing only enough planning to make the next decision with confidence, then adapting as the work reveals new information. The useful version is time-boxed, concrete, and connected to action.

Before starting a meaningful piece of work, the people involved should be able to answer:

1. The outcome and the non-negotiable constraints.
2. The approach we are choosing and the alternatives we are rejecting.
3. The dependencies, owners, and order of operations.
4. How we will know the change works in production.
5. What we will do if it does not.

For many changes, those answers fit in a few paragraphs, a ticket, or a short conversation. The format is not the goal. The goal is to ensure everyone is working from the same understanding of the outcome, the approach, and the next steps. That shared plan lets people move independently without moving apart.

## The work behind the work

This preparation takes real effort. It may mean bringing people together for a meeting, tracking down an answer from another team, reading unfamiliar code, or waiting for someone to validate an assumption. Those activities can feel slower than opening an editor and starting immediately.

<figure class="post-media">
  <video class="post-animation" loop muted playsinline preload="metadata" poster="spaceballs-preparing-still.jpg" aria-label="Dark Helmet looks through binoculars beside Colonel Sandurz, with the caption: What are you preparing? Just go!">
    <source src="spaceballs-preparing.webm" type="video/webm">
    <source src="spaceballs-preparing.mp4" type="video/mp4">
  </video>
  <figcaption><cite>Spaceballs</cite> (1987), directed by Mel Brooks. Copyright © 1987 Metro-Goldwyn-Mayer.</figcaption>
</figure>

That cost is real, but the cost of proceeding without the answer is greater: interrupted work, conflicting implementations, late changes, and incidents that pull even more people away from their work. A focused conversation now is often cheaper than many fragmented conversations after the work has already begun.

Not every question needs a meeting, and not every dependency needs exhaustive investigation. The discipline is to spend effort where uncertainty creates meaningful risk, make that effort visible as part of the work, and stop when the team has enough shared understanding to move safely.

## Smooth execution is the fast part

Once the important questions have answers, execution has room to flow. People can focus on their work instead of repeatedly stopping to clarify intent, wait for a decision, or undo a choice made on an incomplete assumption. Handoffs are cleaner, reviews are more focused, and work moves from one step to the next without the same friction.

Testing is more complete because failure cases were considered early. Stakeholders stay informed because the sequence, ownership, and risks were visible from the start. When something does change, the team can respond quickly because it understands the goal, the constraints, and the consequences of each option. Fewer decisions are rediscovered halfway through the work, and fewer surprises become emergencies.

That is the speed worth optimizing for: not the fastest possible start, but the shortest **reliable** path from an idea to a working, observable, supportable result. Smooth work is not effortless work. It is work whose effort is spent moving forward rather than recovering from **avoidable** friction.

Slow is smooth. Smooth is fast.
<figure class="post-media">
  <video class="post-animation" loop muted playsinline preload="metadata" poster="everybodygotthat-still.jpg" aria-label="Dark Helmet addresses the crew and says, Everybody got that? Good!">
    <source src="everybodygotthat.webm" type="video/webm">
    <source src="everybodygotthat.mp4" type="video/mp4">
  </video>
  <figcaption><cite>Spaceballs</cite> (1987), directed by Mel Brooks. Copyright © 1987 Metro-Goldwyn-Mayer.</figcaption>
</figure>
