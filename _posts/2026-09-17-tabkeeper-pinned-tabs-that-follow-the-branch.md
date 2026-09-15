---
layout: post
title: "Tabkeeper: Pinned Tabs That Follow the Branch"
date: 2026-09-17
published: true
author: Kirk Tolleshaug
categories:
  - engineering-practices
tags:
  - developer-experience
  - tooling
  - visual-studio
  - vs-code
  - side-projects
description: Switching branches shouldn't mean rebuilding your editor layout from memory. Tabkeeper gives each branch its own set of pinned tabs, in both Visual Studio and VS Code, so context-switching costs go back to being about code, not window management.
social_description: A small editor extension that saves and restores pinned tabs per Git branch, created to fix a daily annoyance rather than continue to tolerate it.
social_image: /assets/blog/tabkeeper-pinned-tabs-that-follow-the-branch/social-preview.png
social_image_alt: "Tabkeeper: Pinned Tabs That Follow the Branch, a blog post by Kirk Tolleshaug."
---

Switch branches to review a teammate's pull request, and your editor keeps every tab from the feature you were just in. Switch back, and none of the review's files are pinned anymore. Neither state is what you want; both are what you get, because the editor has no idea that "the files I care about right now" changes every time the branch does.

That gap is small enough to tolerate and constant enough to cost something every day. Tabkeeper is an extension I built to close it, available for both Visual Studio and VS Code, so each Git branch keeps its own set of pinned tabs, and switching branches switches the tabs with it.

## The cost of a tab layout that doesn't know about branches

Pinned tabs exist to answer one question at a glance: what am I working on right now. That answer changes with the branch, but nothing in Visual Studio or VS Code ties the two together. The default behavior is closer to a wipe on every checkout: whatever context you had is just gone, no trace, and you're left to reconstruct it from memory. The result is a small tax paid on every context switch:

- Reviewing a PR means either living with your feature's tabs cluttering the review, or closing them and losing your place when you switch back.
- Jumping onto a hotfix mid-feature means manually re-pinning the two or three files that matter for the fix, then reconstructing the feature's layout from memory afterward.
- Coming back to a branch after a few days means re-opening the same handful of files, in the same order, purely from habit.

None of this is hard. It's just friction, paid in small denominations, often enough per day that it adds up to real time spent on window management instead of the problem in front of you. That is exactly the kind of cost that is easy to keep tolerating and easy to fix once you notice it as a real cost rather than a fact of life.

## What Tabkeeper actually does

Tabkeeper's scope is deliberately narrow: it manages which tabs are pinned, and nothing else.

1. Pin the tabs you want for the branch you're on.
2. Switch branches, in the editor's own Git tooling or in any external Git client.
3. Tabkeeper saves the outgoing branch's pinned tabs and restores the incoming branch's.

One switch, one automatic reaction, no extra step in between. The first time you visit a branch, whatever you already have pinned becomes that branch's saved set, so there's no empty-state cliff on adoption. A branch you've never touched starts with nothing pinned, which is also correct. If a checkout is still writing files when the restore runs, Tabkeeper retries for a few seconds so late-arriving files still get pinned instead of silently skipped.

A few decisions in the design are there specifically to keep the extension trustworthy rather than merely convenient:

- **It never opens, closes, or saves files beyond pinning them, and never touches file contents.** The blast radius of a bug in a tab manager should be "the wrong tabs are pinned," not "a file got modified or closed with unsaved changes."
- **Branch rules let related branches share a set instead of forcing one per branch.** A `feature/*` glob can point at a shared "features" set, while a `release/*` glob opts out entirely. The most specific pattern wins, so `feature/login` gets its own rule ahead of the wildcard.
- **Everything is local and per-machine.** Config, saved tab sets, and an activity log live in the editor's own local data directory, never committed, with tab paths stored repository-relative so moving the repo on disk doesn't break anything.

That last point also shaped the escape hatches: **Export Tab Set** and **Import Tab Set to This Branch** move a saved set between machines as a plain JSON file, and **Clean Up Missing Branches** drops sets for branches that no longer exist locally, so the state doesn't quietly accumulate forever.

## Small scope, real discipline

A tool for one person is still worth building the way you'd build anything you intend to keep using. Tabkeeper has a test project around its core branch-tracking and pin-matching logic, and a CI workflow that builds and tests on every push.

None of this is because a personal editor extension needs enterprise rigor. It's because the discipline of scoping a change tightly, thinking through the failure modes before they become someone's confusing Tuesday, is the same discipline regardless of the audience. A tool used by one person still gets used every day, and "it's just for me" is not a reason to skip the parts that make it reliable. If anything, it's the reason there's no one else around to notice quietly when it breaks.

## Stop tolerating it

Tabkeeper didn't start as a tool I set out to build; it started as an annoyance I decided to stop tolerating. That's usually the best signal for what's worth automating: not "what would make an interesting side project," but "what am I doing by hand, repeatedly, that the machine already has enough information to do for me." The editor already knows which branch is checked out and which tabs are pinned; it just never connected the two.

The project is MIT-licensed, with a `.vsix` published on every release, and listed on:

<ul class="marketplace-links" style="list-style:none;padding:0;margin:1.25em 0;display:flex;flex-direction:column;gap:0.6em;">
  <li style="display:flex;align-items:center;gap:0.6em;">
    <span aria-hidden="true" style="display:inline-block;width:20px;height:20px;flex:none;background-color:currentColor;-webkit-mask:url(/assets/images/github.svg) center/contain no-repeat;mask:url(/assets/images/github.svg) center/contain no-repeat;"></span>
    <a href="https://github.com/ktoll2/Tabkeeper">GitHub</a>
  </li>
  <li style="display:flex;align-items:center;gap:0.6em;">
    <img src="/assets/images/visual-studio.svg" width="20" height="20" alt="" style="flex:none;">
    <a href="TODO-MARKETPLACE-LINK-VS">Visual Studio Marketplace</a>
  </li>
  <li style="display:flex;align-items:center;gap:0.6em;">
    <img src="/assets/images/vscode.svg" width="20" height="20" alt="" style="flex:none;">
    <a href="TODO-MARKETPLACE-LINK-VSCODE">VS Code Marketplace</a>
  </li>
  <li style="display:flex;align-items:center;gap:0.6em;">
    <img src="/assets/images/openvsx.png" width="20" height="20" alt="" style="flex:none;">
    <a href="TODO-MARKETPLACE-LINK-OPENVSX">Open VSX</a>
  </li>
</ul>

If your editor also forgets what you were doing every time you switch branches, it might save you the same small tax it was costing me.
