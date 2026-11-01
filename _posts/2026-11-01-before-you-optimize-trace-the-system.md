---
layout: post
title: Before You Optimize, Trace the System
date: 2026-11-01
published: true
author: Kirk Tolleshaug
categories:
  - engineering-practices
tags:
  - performance
  - tracing
  - troubleshooting
  - backend
description: Saying the API is slow is rarely a diagnosis. Map the full path of work first, then decide whether the fix belongs in the code, the data access, or the architecture.
social_description: Slow systems are fixed by understanding the whole path of work, not by guessing at the part that looks suspicious.
social_image: /assets/blog/before-you-optimize-trace-the-system/social-preview.png
social_image_alt: Before You Optimize, Trace the System, a blog post by Kirk Tolleshaug.
---

"The API is slow" may be one of the most common sentences in software and surely one of the least useful. It describes a feeling, not a cause. It does not say which requests, for which users, at what volume, or since when. It does not say whether the time is going to computation, to the database, to a network hop, or to a queue that nobody remembered was in the path.
{% include post-video.html name="houstonwehaveaproblem" label="Mission Control hears the Apollo 13 crew report, Houston, we have a problem." credit="<cite>Apollo 13</cite> (1995), directed by Ron Howard. Copyright © 1995 Universal Pictures and Imagine Entertainment." %}

The instinct on hearing it is to go find something to fix. Someone remembers a query that looked expensive, or a loop that could be tighter, or a library with a faster alternative. A change gets made, the numbers move a little or not at all, and a week has gone into improving something that was never the bottleneck. Nobody did anything unreasonable. They just started with a solution before they had a diagnosis. The better instinct is the one Mission Control had in Apollo 13: work the problem, and do not make it worse by guessing.
{% include post-video.html name="guessing" label="Gene Kranz tells Mission Control: Let's work the problem, people. Let's not make things worse by guessing." credit="<cite>Apollo 13</cite> (1995), directed by Ron Howard. Copyright © 1995 Universal Pictures and Imagine Entertainment." %}

The alternative is less exciting and far more reliable. Before optimizing anything, trace the system. Follow one unit of work from the moment it enters to the moment it finishes, and write down everywhere it goes and everything it waits on. The best fixes usually come after the system is understood, not before.

## Slow is too vague to act on

Slowness is a symptom that can come from very different places, and each one calls for a different response. A request can be slow because it does too much work, because it does the same work repeatedly, because it waits on something else, or because it is competing with other work for a shared resource. Those are four separate problems that look identical from the outside, and fixing the wrong one changes nothing.

Turning the vague report into a testable one is usually a matter of asking a few plain questions. 

- Slow for whom? Every user, or only some accounts, some tenants, some regions? 
- Slow when? Always, at particular times of day, after a deploy, only under load? 
- Slow compared to what? Yesterday, last month, an agreed target, or a feeling? 
- Slow at which percentile? A healthy median can hide a tail that ruins the experience for a real share of requests.

Sometimes the answers settle the matter before any tooling is opened. A problem that appears only for the largest customers is almost always about data volume. A problem that appears at the top of every hour points at a scheduled job. A problem that started on a specific date points at a specific change. What began as a shrug becomes a narrow question, and a narrow question is far cheaper to investigate than a broad complaint.

## Finding the actual path of work

Once the question is specific, map the path. This is the step most often skipped, because everyone believes they already know it. In practice, the path a request takes in production is longer and stranger than the one in the architecture diagram, and the surprises are usually where the time is hiding.

Start at the edge and walk inward. A request passes through a load balancer or gateway, then a middleware pipeline that may authenticate it, log it, and apply filters before any of your code runs. Then come the controllers and services, which validate, map, and orchestrate. Then data access, which includes every database call, and not only the ones you wrote but the ones an ORM issues implicitly through lazy loading or change tracking. Then caches, with their hit and miss behavior. Then any external dependency, another service, a third-party API, a file store, an identity provider. Then anything published to a queue or handed to background work. Finally the response itself, including serialization, compression, and the trip back across the network.

The purpose of this exercise is not a tidy diagram. It is to notice the parts you did not know about. An extra call to a permissions service on every request, a serializer that walks an entire object graph, a synchronous audit write sitting in the middle of a hot path, a retry policy that quietly triples the latency of a failing dependency, these are typical discoveries, and none of them are visible from reading the one method everyone assumed was responsible.

## Measure where the time actually goes

A map tells you where time could go. Measurement tells you where it does. Wrap the major stops in timings, or use distributed tracing if you have it, and look at real requests rather than synthetic ones.

The shape of the timing matters as much as the total. A request that takes nine hundred milliseconds could be a single slow call or forty medium ones, and those need different fixes. The total hides the difference, and a breakdown by stage reveals it. It is also worth comparing a slow case against a fast one. The same endpoint called for a small account and a large one often differs in exactly one place, and that difference is the lead.

Even crude instrumentation beats intuition. A stopwatch around a stage, with the result written to a log alongside the size of the work, is enough to start.

```csharp
Stopwatch stopwatch = Stopwatch.StartNew();
List<Order> orders = await _orderRepository.GetOpenOrdersAsync(accountId, cancellationToken);
stopwatch.Stop();

_logger.LogInformation(
    "Loaded {OrderCount} orders for account {AccountId} in {ElapsedMs} ms",
    orders.Count,
    accountId,
    stopwatch.ElapsedMilliseconds);
```

The important part of that log line is that the count sits next to the duration. A timing without a size is hard to interpret, while a timing with a size shows immediately whether the cost grows with the data.

## What tends to turn up

With the path mapped and timed, the same handful of patterns account for most of what is found. Knowing them by name makes them faster to recognize.

Repeated work is the most common. The same lookup performed once per item in a loop, the same configuration loaded on every request, the same permission checked five times in a single call. It is also often the cheapest to fix, because removing repetition rarely changes behavior.

Blocking calls in sequence come next. Three independent calls made one after another when they could run together, or a synchronous call sitting in a path that has no reason to wait on it.

Bad query shapes are a frequent third. A query that returns far more rows or columns than the caller uses, a join that multiplies rows, or the well-known pattern where one query quietly becomes hundreds because each row triggers another. Related to this is work that scales with the wrong thing, such as cost that grows with the total size of a table instead of the size of the result.

Then there are outdated assumptions, which are the hardest to see because nothing is broken in the code. It was reasonable when a table held thousands of rows and is expensive at millions. The code did not change, the data did.

The last category explains a class of problem that no amount of single-request profiling will find. A request that is fast alone and slow under load is not a code problem in the usual sense. It is a contention problem. Locks, connection pool limits, thread pool starvation, a shared resource that only shows its cost under concurrency. Finding it requires including in the trace what else was happening at the same time.

## Deciding where the fix belongs

Tracing also answers a question that is surprisingly easy to get wrong, is this a code problem, a data access problem, or an architecture problem? The right response differs sharply among them, and choosing the wrong layer is expensive.

When the work itself is wasteful, the fix belongs in the code. Repeated calculations, needless allocations, sequential calls that could be concurrent, or serialization of data nobody reads. These fixes are local, cheap, and low risk.

When the time is spent in the database, or in how the application talks to it, the fix belongs in data access. A missing index, a query that fetches too much, an ORM generating a shape nobody intended, a chatty pattern that should be one set-based operation. These fixes often deliver the largest gains for the least code, which is why data access deserves suspicion early.

When the design no longer fits the load, the fix is architectural. Work that should be asynchronous but is done inline, a read path that should be served from a different store, a boundary that forces a network hop on every request. These are the most expensive and disruptive fixes, so they should be the conclusion of evidence and never the starting assumption.

A sensible rule is to exhaust the cheaper layers first, but only after measurement confirms where the time is. Rewriting a service because it feels slow, when an index would have solved it, is a failure of diagnosis rather than a failure of design.

## Knowing the fix worked

The trace is also how you finish. A fix is not done when the change merges. It is done when the same measurement, taken the same way, shows the improvement.
{% include post-video.html name="odysseydoyouread" label="Mission Control calls Odyssey during the re-entry blackout and hears only static." credit="<cite>Apollo 13</cite> (1995), directed by Ron Howard. Copyright © 1995 Universal Pictures and Imagine Entertainment." %}

That means recording a baseline before changing anything. The timings, the percentiles that matter, and the conditions they were taken under. After the change, repeat the measurement under comparable conditions and compare. Change one thing at a time, because two simultaneous changes make it impossible to know which helped or whether one hurt. Test with realistic data, because an optimization proven against a small development database says little about a production table. Watch the tail as well as the average, since a fix that improves the median while worsening the worst cases can be a net loss. And check for relocation, because speeding up one path by pushing work elsewhere may only move the cost.

This closing step is what separates engineering from folklore. Without it, a team accumulates a set of beliefs about what made things faster, none verified and some wrong. With it, each fix leaves behind a number, and the number is a record of what was true.
{% include post-video.html name="thisisodyssey" label="The Odyssey crew answers after the blackout: Hello, Houston, this is Odyssey, it's good to see you again." credit="<cite>Apollo 13</cite> (1995), directed by Ron Howard. Copyright © 1995 Universal Pictures and Imagine Entertainment." %}

## Trace before you touch

The discipline is small and easy to state. Turn "it's slow" into a specific question. Map the path a piece of work really takes. Measure where the time goes. Decide which layer the fix belongs in. Confirm with the same measurement that it worked.

For the first hour this can feel slower than opening the code and starting to change things. But the alternative is a sequence of confident changes to the wrong place, each adding complexity to a system that still has its original problem.

The best performance fixes are usually boring once the cause is known. An index, a batched call, a removed loop, a cache in the right place. They are boring because the hard part already happened. Someone traced the system and understood it, and after that the change was obvious.

Do not trust the diagram. Trace the system.
{% include post-video.html name="whatitcando" label="Gene Kranz tells Mission Control: I don't care what anything was designed to do. I care about what it can do." credit="<cite>Apollo 13</cite> (1995), directed by Ron Howard. Copyright © 1995 Universal Pictures and Imagine Entertainment." %}
