---
title: Improving our Influx Parser- A Story in Four Acts
author: The Tremor Team
author_image_url: https://avatars.githubusercontent.com/u/60009416?s=200&v=4
tags: [perf]
draft: false
hide_table_of_contents: false
description: The process of improving the performance of our influx line protocol parser.
---
 
# Influx Parsing Performance
 
Yesterday, we spent the day on a report [that our influx parser was slow](https://github.com/tremor-rs/tremor-runtime/issues/82), and it turns out it was indeed.
 
This is an exciting topic as a few days ago, we [gave a talk at BoBKonf 2020](https://bobkonf.de/2020/ennis-gies.html) on this topic, so this is a great opportunity to show some of the topics and our process in action.
 
All the topics in this blog are links; the main one above this text is to the pull request, the titles of each section link to the commit that implements the topic discussed. Go ahead, click on some, and take a look!
 
There are two tools worth introducing here that we used during this performance session.
 
One is [perf](http://brendangregg.com/perf.html), which we used with a minimal setup of `perf record` and `perf report`. We use this to get a glance at where code is spending time. This is not perfect, but it is quick for decent results.
 
The other one is [criterion](https://docs.rs/criterion/0.3.1/criterion/), an excellent Rust framework for microbenchmarks based on the [haskell framework](https://hackage.haskell.org/package/criterion) with the same name. It is so helpful since it allows us to show changes in performance between changes. That makes it perfect for the kind of incremental improvements our process favors.

<!--truncate-->
 
## [Act 1 - Allocation](https://github.com/tremor-rs/tremor-runtime/pull/87/commits/42ee11637bc5cd3a215cce1cb841afe791b944b4)
 
We talked a bit about allocations and how they can slow down programs in our talk. We tackled two main areas there, and both of them applied to this benchmark.
 
First, we switched our allocator to ensure we use the same allocator in both our builds, and the benchmark can make a significant difference!
 
Second, we found a few places where we used `String::new()` and then push to this String - this is one of the patterns we mentioned in our talk, and as you can see in this PR, something we still do wrong at times.
 
From prior experience, we know that tag names, values, and field names rarely, if ever, are larger than `256` characters, so we preallocate with this to eliminate almost all string relocations during parsing.
 
As you can see, this change already had a decent impact on performance.
 
```
base-value            time:   [540.03 ns 540.27 ns 540.53 ns]
                       change: [-14.017% -13.948% -13.884%] (p = 0.00 < 0.05)
                       Performance has improved.
 
int-value               time:   [314.67 ns 314.90 ns 315.14 ns]
                       change: [-8.9227% -8.8709% -8.8179%] (p = 0.00 < 0.05)
                       Performance has improved.
Found 13 outliers among 100 measurements (13.00%)
 1 (1.00%) low mild
 12 (12.00%) high mild
 
str-value               time:   [460.68 ns 460.92 ns 461.16 ns]
                       change: [-11.668% -11.617% -11.564%] (p = 0.00 < 0.05)
                       Performance has improved.
Found 4 outliers among 100 measurements (4.00%)
 1 (1.00%) low mild
 2 (2.00%) high mild
 1 (1.00%) high severe
 
escaped-value           time:   [477.57 ns 478.02 ns 478.51 ns]
                       change: [-13.262% -12.894% -12.594%] (p = 0.00 < 0.05)
                       Performance has improved.
Found 1 outliers among 100 measurements (1.00%)
 1 (1.00%) high mild
```
 
## [Act 2 - Degeneralisation](https://github.com/tremor-rs/tremor-runtime/pull/87/commits/d1490fb940ad99ca3570e4af8c5f5407c4d054e6)
 
When we originally wrote the code, what we did is generalize the "find a character" logic between the cases where we were looking for one, two, or three distinct characters to terminate a token.
 
That made sense from the perspective of not duplicating code, however looking at the output of perf, it showed that we're spending an awful lot of time in this one particular function.
 
So we split this function into its three cases and implemented each on its own, allowing simplified code for one and two termination characters. This simplifies the logic and, in result, improves performance for those cases.
 
 
```
base-value            time:   [533.13 ns 534.49 ns 536.02 ns]
                       change: [-1.5482% -1.3801% -1.1996%] (p = 0.00 < 0.05)
                       Performance has improved.
Found 3 outliers among 100 measurements (3.00%)
 2 (2.00%) high mild
 1 (1.00%) high severe
 
int-value               time:   [287.45 ns 287.61 ns 287.78 ns]
                       change: [-8.5277% -8.4504% -8.3783%] (p = 0.00 < 0.05)
                       Performance has improved.
 
str-value               time:   [428.11 ns 428.38 ns 428.68 ns]
                       change: [-7.2129% -7.1458% -7.0775%] (p = 0.00 < 0.05)
                       Performance has improved.
Found 2 outliers among 100 measurements (2.00%)
 1 (1.00%) low mild
 1 (1.00%) high mild
 
escaped-value           time:   [446.53 ns 447.30 ns 448.53 ns]
                       change: [-6.6970% -6.5679% -6.4161%] (p = 0.00 < 0.05)
                       Performance has improved.
Found 7 outliers among 100 measurements (7.00%)
 6 (6.00%) high mild
 1 (1.00%) high severe
```
 
## [Act 3 - Outside help](https://github.com/tremor-rs/tremor-runtime/pull/87/commits/6c9ee7ce64d1474bbd609f7ad99e4303b0ee98df)
 
Not all performance improvements have to be written in code, sometimes asking the right question and looking for the right thing can do the trick.
 
[lexical](https://docs.rs/lexical/) is a rust library that implements a faster version of number parsing, which is a significant part of what influx line protocol is.
 
The changes are minimal, and as you can see, the impact isn't that huge, but every percentage point counts.
 
```
base-value            time:   [522.24 ns 522.45 ns 522.69 ns]
                       change: [-0.3955% -0.2589% -0.1477%] (p = 0.00 < 0.05)
                       Change within noise threshold.
Found 13 outliers among 100 measurements (13.00%)
 2 (2.00%) low mild
 4 (4.00%) high mild
 7 (7.00%) high severe
 
int-value               time:   [295.19 ns 295.38 ns 295.56 ns]
                       change: [-1.9771% -1.6929% -1.5006%] (p = 0.00 < 0.05)
                       Performance has improved.
Found 5 outliers among 100 measurements (5.00%)
 3 (3.00%) low mild
 1 (1.00%) high mild
 1 (1.00%) high severe
 
str-value               time:   [421.03 ns 421.25 ns 421.46 ns]
                       change: [-3.0571% -2.9466% -2.8421%] (p = 0.00 < 0.05)
                       Performance has improved.
Found 8 outliers among 100 measurements (8.00%)
 3 (3.00%) low severe
 1 (1.00%) low mild
 3 (3.00%) high mild
 1 (1.00%) high severe
 
escaped-value           time:   [433.66 ns 434.61 ns 435.77 ns]
                       change: [-2.9065% -2.7290% -2.5090%] (p = 0.00 < 0.05)
                       Performance has improved.
Found 4 outliers among 100 measurements (4.00%)
 1 (1.00%) high mild
 3 (3.00%) high severe
```
 
## [Act 4 - Borrow vs. Owned](https://github.com/tremor-rs/tremor-runtime/pull/87/commits/eb24fd9c3f5982a2dae743abd41a75a4253eec07)
 
The last act is a bit more exciting, so we'll spend extra time on it (both here and when implementing it).
 
This touches on something we didn't discuss in detail during our talk for the sake of time. It is that owned values instead of borrowed values are
significantly more expensive.
 
While 'owned' and 'borrowed' are very Rust-specific terms, you can think about it this way:
 
An owned value is a value that has its own memory, on creation, it allocates that memory copies the data in, and when it gets freed, the memory too gets freed.
 
A borrowed value doesn't own the memory it refers to. Instead, it borrows the memory from another value, and now those two are tied to each other. Rust uses lifetimes to represent this- this is a vast topic of its own, so we'll not go into details here, but think about it that a borrowed value in some way is a pointer to someone else's memory.
 
For influx data, a lot of the strings can are perfectly fine represented inside the initial memory; they don't need modification or change to be then used in the final data representation.
 
The first implementation ignored this fact and always created a newly owned data structure - this is expensive (as you will see below). However, it's not only that. Not all strings can be passed, pointing to the original memory. Influx uses some escaping in its line protocol that makes this impossible.
 
Fortunately, Rust has a data structure that allows representing the situation where we often return borrowed data but sometimes need to own it- it's named a `Cow`. No, not that cow, it doesn't eat grass, it is a Copy On Write structure that we can use to cover the "we sometimes need to own the data" situation.
 
In short, a `Cow< '_, str>` allows returning either a borrowed `&str` or an owned String - perfect for our use case!
 
Since most of the time we can return the `&str` we use a trick I picked up from the [json crate](https://github.com/maciejhirsz/json-rust/blob/master/src/codegen.rs#L67-L99) that is to split out the logic in a base and a complex case where the base case can perform the common operation quickly and only if it is required we switch to the complex and more costly implementation.
 
In our case, this means we assume that all strings can be returned as borrowed, and only if we find an escape sequence, we switch to a more complex implementation. While this has some extra cost on the rare case, it makes the typical case rather cheap.
 
```
base-value            time:   [385.62 ns 385.85 ns 386.06 ns]
                       change: [-25.171% -25.122% -25.073%] (p = 0.00 < 0.05)
                       Performance has improved.
Found 5 outliers among 100 measurements (5.00%)
 1 (1.00%) low severe
 3 (3.00%) low mild
 1 (1.00%) high mild
 
int-value               time:   [240.91 ns 241.37 ns 241.97 ns]
                       change: [-18.169% -18.051% -17.905%] (p = 0.00 < 0.05)
                       Performance has improved.
Found 1 outliers among 100 measurements (1.00%)
 1 (1.00%) high severe
 
str-value               time:   [308.08 ns 308.17 ns 308.27 ns]
                       change: [-26.978% -26.901% -26.833%] (p = 0.00 < 0.05)
                       Performance has improved.
Found 8 outliers among 100 measurements (8.00%)
 1 (1.00%) low severe
 4 (4.00%) low mild
 3 (3.00%) high mild
 
escaped-value           time:   [368.73 ns 369.05 ns 369.38 ns]
                       change: [-15.303% -15.233% -15.160%] (p = 0.00 < 0.05)
                       Performance has improved.
Found 3 outliers among 100 measurements (3.00%)
 1 (1.00%) low mild
```

## [Conclusion](https://github.com/tremor-rs/tremor-runtime/pull/87)

So we performed 3 rudimentary and one more complex tweaks, and this doubled the performance of our influx parsing. As you can see, a few tweaks, when added together, can have some massive impact.

The most important take away here, however, is the process and that it is iterative.

We begin each round by looking at measurements, in this case, perf data. Then collect baseline data, in this case, with criterion. From there, we form a theory what could improve the results, implement a solution based on this theory, and finally validate the results with another run of criterion to see the relative diference.

And here the final results of all changes combined:

```
Gnuplot not found, using plotters backend
base-value            time:   [376.98 ns 377.26 ns 377.52 ns]                         
                        change: [-55.627% -55.569% -55.518%] (p = 0.00 < 0.05)
                        Performance has improved.
Found 3 outliers among 100 measurements (3.00%)
  2 (2.00%) low mild
  1 (1.00%) high mild

int-value               time:   [233.04 ns 233.19 ns 233.34 ns]                      
                        change: [-47.584% -47.507% -47.435%] (p = 0.00 < 0.05)
                        Performance has improved.

str-value               time:   [302.36 ns 302.43 ns 302.50 ns]                      
                        change: [-58.246% -58.202% -58.159%] (p = 0.00 < 0.05)
                        Performance has improved.
Found 6 outliers among 100 measurements (6.00%)
  2 (2.00%) low mild
  4 (4.00%) high mild

escaped-value           time:   [364.08 ns 364.35 ns 364.67 ns]                          
                        change: [-52.159% -52.084% -52.004%] (p = 0.00 < 0.05)
                        Performance has improved.
Found 8 outliers among 100 measurements (8.00%)
  8 (8.00%) high severe
```
