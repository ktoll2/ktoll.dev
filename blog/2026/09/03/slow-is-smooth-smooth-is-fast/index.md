---
layout: post
blog_post: true
title: Slow Is Smooth, Smooth Is Fast
date: 2026-09-03
permalink: /blog/2026/09/03/slow-is-smooth-smooth-is-fast/
reading_time: 4
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
social_image: /blog/2026/09/03/slow-is-smooth-smooth-is-fast/social-preview.png
social_image_alt: Slow Is Smooth, Smooth Is Fast, a blog post by Kirk Tolleshaug.
---

“Slow is smooth, smooth is fast” is useful advice because it challenges the kind of speed that only looks fast at the beginning.

Starting immediately can feel decisive. A ticket moves to in progress, code begins to appear, and everyone can see activity. But when the outcome, constraints, ownership, or integration points are still unclear, that early momentum often becomes rework. People make reasonable assumptions in different directions. Interfaces change after downstream work has started. Edge cases emerge late, when they are more expensive to correct.

The goal is not to make every task a ceremony. It is to spend a small, deliberate amount of time making the path through the work smooth enough that execution can stay fast.

## The allure of speed

Something new and exciting appears: a capability to build, a customer request to chase, an incident to solve, or a chance to finally replace a frustrating part of the system. The instinct is to engage the hyperjets and go straight to ludicrous speed.
<figure class="post-media">
  <img src="ludicrousspeedgo.gif" alt="Ludicrous speed scene">
  <figcaption><cite>Spaceballs</cite> (1987), directed by Mel Brooks.</figcaption>
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
  <img src="emergencystop.gif" alt="Emergency stop scene">
  <figcaption><cite>Spaceballs</cite> (1987), directed by Mel Brooks.</figcaption>
</figure>

Speed rarely delivers the results it promises, when it promises them. Reality seldom follows a straight path, and charging ahead without accounting for its turns only gets us to the wrong place faster.  
**Excitement → assumptions → apparent progress → reality → cascading corrections → failure and damage.**

## Avoiding the speed trap

Planning should match the consequence of getting something wrong.

For a small, isolated change, a few minutes of thought may be enough: 
- What is changing?
- How will it be tested?
- What could break? 

For a new integration, a performance-sensitive path, or a migration, the useful questions are broader:
- What outcome are we trying to produce for the user or the business?
- Which systems, teams, and contracts are involved?
- What assumptions need to be verified **before** implementation begins?
- What are the likely failure modes, and how will we detect or recover from them?
- Who owns each decision when the work crosses boundaries?

Answering those questions early is not delay for its own sake. It converts hidden uncertainty into work that can be sized, sequenced, and assigned deliberately.

## Alignment removes waiting

Many delivery delays are not caused by typing speed. They come from waiting for answers, discovering that two teams interpreted a requirement differently, or revisiting a decision after dependent work is already underway.

A short design note, a diagram of the request path, or a focused kickoff can prevent that. The artifact matters less than the shared understanding it creates. The people building, reviewing, operating, and depending on a change should agree on the important contracts before they each optimize their own piece of the system.

That alignment makes parallel work safer. One person can update an API while another prepares a consumer, tests, or observability because the interface and sequence are understood. Without that agreement, parallelism often just creates more places for the same ambiguity to surface.

## Think through failure before it becomes production work

Good planning also makes quality cheaper.

Before implementation, it is worth walking through the unhappy paths: retries, partial failures, duplicate messages, stale data, timeouts, authorization boundaries, schema changes, and rollback. Not every risk needs a large solution, but each one deserves an explicit decision. Ignoring a failure mode does not remove it; it usually moves the decision to an incident, a rushed review, or a late test failure.

This is especially valuable in backend systems, where the happy path can work while the system still behaves poorly under load, during a dependency outage, or after a deploy. Thinking through those conditions early leads to clearer tests, better instrumentation, and fewer surprises for the people on call.

## Keep the planning lightweight and actionable

Planning becomes counterproductive when it is detached from a decision or never turns into execution. The useful version is time-boxed and concrete.

Before starting a meaningful piece of work, I want the team to be able to state:

1. The outcome and the non-negotiable constraints.
2. The approach we are choosing and the alternatives we are rejecting.
3. The dependencies, owners, and order of operations.
4. How we will know the change works in production.
5. What we will do if it does not.

That can fit in a few paragraphs for many changes. The point is not a perfect document. The point is a shared plan that lets people move independently without moving apart.

## Smooth execution is the fast part

Once the important questions have answers, implementation gets calmer. Reviews are more focused because the intent is clear. Testing is more complete because failure cases were considered early. Stakeholders stay informed because the sequence and risks were visible from the start. Fewer decisions are rediscovered halfway through the work.

That is the speed worth optimizing for: not the fastest possible start, but the shortest reliable path from an idea to a working, observable, supportable result.

Slow is smooth. Smooth is fast.
