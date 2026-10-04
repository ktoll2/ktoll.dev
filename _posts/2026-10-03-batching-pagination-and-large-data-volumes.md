---
layout: post
title: Batching, Pagination, and the Day the Data Got Big
date: 2026-10-03
published: true
author: Kirk Tolleshaug
categories:
  - engineering-practices
tags:
  - performance
  - pagination
  - batching
  - databases
  - scalability
description: Code that works on hundreds of records often falls over on millions. Bounded reads, keyset pagination, and deliberate batching keep a system predictable as data grows.
social_description: Most performance cliffs are volume cliffs. Designing every read and write to be bounded is how a system survives the day its data gets big.
social_image: /assets/blog/batching-pagination-and-large-data-volumes/social-preview.png
social_image_alt: Batching, Pagination, and the Day the Data Got Big, a blog post by Kirk Tolleshaug.
---

There is a specific kind of production incident that almost never has a cause in the code that changed last. A report that ran in two seconds for years now times out. A nightly job that finished before anyone arrived now runs into the morning. An endpoint that returned instantly starts returning gateway errors for the largest customers and nobody else. Nothing was deployed, no one touched the query, and yet the system has gotten dramatically worse.

What changed was the data. The table that held thousands of rows when the feature was written now holds millions, and every assumption that was quietly true at the original size has stopped being true. The code was never wrong at that scale, because it was never asked to run at that scale. The swap looked safe, and it is the same swap that brings the whole thing down.

{% include post-video.html name="golden_idol" label="Indiana Jones swaps the golden idol for a bag of sand and the temple begins to collapse." credit="<cite>Raiders of the Lost Ark</cite> (1981), directed by Steven Spielberg. Copyright © 1981 Paramount Pictures and Lucasfilm Ltd." %}

This is the most common way that software fails without anyone making a mistake, and it is preventable. The prevention is a habit rather than a technology. It means treating every read and every write as something that must have a bound, and being deliberate about how large a unit of work is allowed to become.

## The unbounded query is a delayed bug

The root of most volume problems is a query, a loop, or an API call that has no upper limit on how much it will handle. In development this is invisible, because the amount of data is small enough that the missing limit never matters. It is a defect that only exists in the future.

The pattern shows up in many disguises. An endpoint returns every order for an account and the client renders the list. A job loads all pending records into memory, iterates over them, and saves the changes. A dashboard counts and groups a whole table on every page load. A search builds a result set first and then filters it in application code. Each of these is correct and even reasonable for a few hundred rows, and each will one day be asked to handle a number that is a thousand times larger.

When that day arrives the symptoms are rarely clean. Memory climbs until the process is recycled. A database call holds locks or connections long enough to starve other requests. A response grows large enough that serialization and transfer dominate the total time. The failure lands somewhere unrelated to the original code, which is what makes it hard to trace back.

The most useful reframing is to ask, for any operation that touches a collection, what the largest realistic size of that collection is, and what happens at ten times that. If the honest answer is that nobody knows, the operation has no bound, and the bound needs to be added before the data forces the question. A bound is a measurement, not a guess. Dig where the data points, not where an assumption does.

{% include post-video.html name="eye_of_ra" label="In the Map Room, the sunbeam through the Staff of Ra points to the location of the Well of Souls." credit="<cite>Raiders of the Lost Ark</cite> (1981), directed by Steven Spielberg. Copyright © 1981 Paramount Pictures and Lucasfilm Ltd." %}

## Pagination is a contract, not a convenience

Once you accept that reads need limits, pagination is the natural tool. It is also easy to implement in a way that works for a while and then degrades, so the details matter.

The familiar approach is offset pagination. Skip a number of rows, take a page. In SQL Server that looks like an `OFFSET` and `FETCH` clause on an ordered query. It is simple, it supports jumping to an arbitrary page, and it is what most tutorials show. Its weakness is that the database still has to walk past every skipped row to find where the page begins. Page one is cheap and page five thousand is expensive, and the cost climbs steadily with depth. A client that pages through a large result is doing progressively more work for each request, and a crawler or an export script can produce load that no human user ever would.

Offset pagination has a second, quieter flaw. If rows are inserted or deleted while someone is paging, the boundaries shift. A record can appear twice or never appear at all, because the meaning of "page three" changed between requests.

Keyset pagination, sometimes called cursor or seek pagination, avoids both problems by remembering where the last page ended instead of how many rows were skipped. The client passes back the last key it saw, and the query asks for the rows that come after it. Because the database can seek directly to that position using an index, the cost of each page is roughly constant regardless of how deep the client has gone, and results stay stable while data changes underneath.

```csharp
public async Task<List<Order>> GetPageAsync(
    int accountId,
    DateTime? lastCreatedAt,
    int? lastId,
    int pageSize,
    CancellationToken cancellationToken)
{
    IQueryable<Order> query = _context.Orders
        .AsNoTracking()
        .Where(o => o.AccountId == accountId);

    if (lastCreatedAt.HasValue && lastId.HasValue)
    {
        // Seek past the last row the client saw, using both columns so ties are stable.
        query = query.Where(o =>
            o.CreatedAt < lastCreatedAt.Value ||
            (o.CreatedAt == lastCreatedAt.Value && o.Id < lastId.Value));
    }

    return await query
        .OrderByDescending(o => o.CreatedAt)
        .ThenByDescending(o => o.Id)
        .Take(pageSize)
        .ToListAsync(cancellationToken);
}
```

Two details in that example deserve attention. The ordering includes a unique tiebreaker, the identifier, because ordering only by a timestamp leaves rows with equal timestamps in an undefined order and produces missing or repeated results across pages. And the query is only fast if an index supports it, which in this case means an index on the account, the creation time, and the identifier in matching order. Pagination and indexing are the same conversation, and a pagination scheme with no supporting index is just a slower way to scan a table.

{% include post-video.html name="warehouse" label="The Ark of the Covenant is wheeled into a vast government warehouse of identical crates." credit="<cite>Raiders of the Lost Ark</cite> (1981), directed by Steven Spielberg. Copyright © 1981 Paramount Pictures and Lucasfilm Ltd." %}

The tradeoff is that keyset pagination gives up random access. You cannot jump to page forty. For most APIs and feeds that is an acceptable loss, and for interfaces that genuinely need numbered pages over a very large set, it is worth asking whether anyone will really navigate that far or whether better filtering would serve them better.

There is also a contract to keep. Whatever pagination scheme an API exposes, it should enforce a maximum page size. A parameter that accepts any value will eventually be given a very large one, either by mistake or on purpose, and the limit you forgot to enforce becomes the unbounded query all over again.

## Counting is not free

A companion problem to pagination is the total count. Interfaces like to show "page 3 of 240" or "12,408 results," and the natural way to produce that is to count the matching rows on every request.

Counting a large filtered set can cost as much as reading it. On a big table with a selective filter it may be fine, and on a broad filter it can dominate the whole request. Teams often discover this only after adding a count to an endpoint that used to be fast, and find that the count is now the slowest part.

There are several honest ways out. An interface can show whether a next page exists without showing a total, which is cheap to compute by fetching one extra row. It can show an approximate count above some threshold, such as "more than 10,000." It can maintain a precomputed count that is updated as data changes, accepting some staleness. What matters is to treat the total as a feature with a cost, not a free property of the result.

## Batching writes and background work

Reads are only half the picture. The same volume problem applies to work that changes data, and it appears in two opposite forms.

The first form is doing too little per operation. A job that processes ten thousand records by issuing one database round trip per record pays the cost of the network and the transaction ten thousand times. Reading, transforming, and writing in groups of a few hundred usually turns a job that takes an hour into one that takes minutes, because the fixed cost of each round trip is spread across many rows. Set-based operations are the extreme version of this. A single `UPDATE` statement that changes every qualifying row is dramatically cheaper than loading each row into memory, changing it, and saving it. Modern versions of Entity Framework Core expose this directly through `ExecuteUpdateAsync` and `ExecuteDeleteAsync`. When one statement does the job, there is no reason to fight each row individually.

{% include post-video.html name="swordman" label="Indiana Jones shoots the swordsman instead of fighting him." credit="<cite>Raiders of the Lost Ark</cite> (1981), directed by Steven Spielberg. Copyright © 1981 Paramount Pictures and Lucasfilm Ltd." %}

The second form is doing too much per operation. A single transaction that touches millions of rows holds locks for its entire duration, grows the transaction log, blocks other work, and if it fails near the end, rolls back all of it. A change to a large table in one statement can effectively take the table offline for the people using it.

The answer to both is the same. Choose a batch size on purpose. A batch that is large enough to amortize overhead and small enough to keep each transaction short is the target, and it usually lands somewhere in the hundreds to low thousands for row-oriented work. The right number depends on the width of the rows, the indexes being maintained, and what else is contending for the table, so it should be measured rather than guessed, and ideally kept configurable so it can be tuned without a deployment.

```csharp
const int BatchSize = 1000;
bool moreWork = true;

while (moreWork)
{
    int affected = await _context.Orders
        .Where(o => o.Status == OrderStatus.Expired && o.ArchivedAt == null)
        .Take(BatchSize)
        .ExecuteUpdateAsync(
            setters => setters.SetProperty(o => o.ArchivedAt, DateTime.UtcNow),
            cancellationToken);

    moreWork = affected == BatchSize;
}
```

This loop does a bounded amount of work per iteration, commits between iterations so locks are released, and can be stopped and resumed without losing progress, because each pass only touches rows that still need it. It is also naturally idempotent, so running it twice does no harm. Those properties matter far more in production than the raw speed of any single pass.

## Memory is part of the bound

Volume problems are not only about the database. A process that streams ten million rows through memory will behave very differently from one that loads them all first, and that gap is often what separates a job that works from one that is killed by the host.

The habit to build is to prefer streaming and incremental processing over materializing whole collections. Reading with an enumerator or a data reader, processing each item or small group, and letting the previous items be collected keeps memory flat regardless of the input size. Calling `ToList` on an unbounded query does the opposite. It makes the memory footprint proportional to the data, and the data is growing.

The same reasoning applies to responses. Returning a huge payload from an API forces the server to build it and the client to receive and parse it, and both ends pay in memory and time. If a caller genuinely needs a very large export, it is usually better to make that an asynchronous job that produces a file than to stretch a request and response past what they are designed to carry.

## Design the limits in from the start

The cheapest time to add a bound is when the feature is designed, and the questions are simple. How many records will this realistically touch, now and in two years? What is the largest a single response should ever be? What is the largest single transaction we are willing to hold open? What happens when a caller asks for more?

Answering these usually improves the feature as well as protecting it. A search that requires at least one filter is often a better search. A report that runs on a schedule and reads from a summary table is often a better report than one that aggregates live data on demand. A list that loads more as you scroll is often a better interface than a table with two thousand rows.

It also helps to test with volume. A development database with fifty rows will never reveal a scan or a missing index, and a feature that looks instant against it can be unusable against production. Keeping a realistic-sized dataset available, or generating one for performance checks, turns future incidents into present-day findings.

## Predictable at any size

The goal is not to make everything fast. It is to make cost predictable, so that the work a request or a job does grows slowly or not at all as the data does. A system built that way behaves the same in its tenth year as in its first, because no operation was allowed to depend on the total size of what it was reading.

That comes down to a few habits applied consistently:

- Limit every read, and enforce the limit.
- Page with a scheme that stays cheap at depth, and back it with an index.
- Count only when the count is worth its cost.
- Write in batches sized deliberately, with short transactions and safe restarts.
- Stream instead of loading.
- Ask, during design, what happens when the data gets big, because it will.

The day the data gets big is not an emergency for a system designed with these habits. It is just another day, and that is the point.

Open the door expecting a few rows. Design for the snakes.

{% include post-video.html name="snakes" label="Indiana Jones looks down into the Well of Souls, which is filled with snakes." credit="<cite>Raiders of the Lost Ark</cite> (1981), directed by Steven Spielberg. Copyright © 1981 Paramount Pictures and Lucasfilm Ltd." %}