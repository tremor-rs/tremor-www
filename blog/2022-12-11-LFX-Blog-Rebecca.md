---
title: Support for the Pluggable Logging in Tremor
author: Rebecca ABLI
author_title: Tremor 2022 Summer Mentee
tags: ["cncf", "mentorship", "pluggable-logging"]
draft: false
description: "Rebecca's Mentorship experience"
---


# Introduction

Hello, I am Rebecca, student in computer science in the south of France. I contributed to the Tremor project during the 2022 summer on the [pluggable logging][pd] feature proposed by the [LFX Mentorship Program][lfx]. I was supported by Darach Ennis and Ramona Łuczkiewicz but I also received help from other Tremor team members like Heinz Gies and Matthias Wahl.  
This blog summarizes my journey as a mentee contributing to the Tremor project. 

[pd]: https://mentorship.lfx.linuxfoundation.org/project/1218d516-45af-46a3-977b-e5a9de818cec
[lfx]: https://lfx.linuxfoundation.org/tools/mentorship/


# About Tremor

Tremor is a stream processing system, which uses a set of connectors and pipelines to process the data it receives (from itself or from other systems).  
Initially, Tremor used Log4rs to manage its logs, but this was costly in several ways. The pluggable-logging solution was intended to give Tremor the ability to process its logs through its own pipelines.  
It was also intended to allow the management of different sources. 


# Problems encountered

First of all, the challenges linked to the learning of Rust, among others, raised by the specificities of the language (ownership, borrow checking, etc.) to which I had to adapt, pushed me to leave aside my bad habits coming from other languages, in favor of a code written with a more "Rustacean" spirit. Besides that, it is especially the fact that I was not being able to communicate fluently in English during weekly meetings that slowed down my understanding of the work and made me feel lost above all. Being in an intermediate level, the communication between me and my mentors Darach and Ramona was not easy at the very beginning, but they were very patient and understanding, and even started to schedule two meetings a week instead of one, so that I could improve my English, and progress more easily with more guidance.  


# Pluggable-logging 

## What do we do first?

Humm well, by understanding Tremor and learning the key notions of the different languages that will be used.  

I was first introduced to the behavior and features of Tremor (connectors, pipelines, scripts) and more specifically to how the "metrics system" worked. I was given the task to write small *.troy files to learn how to link connectors and pipelines from a user point of view.  
On the Rust side, after studying the "Log4rs" crate, I got familiar with the notions of testing and error handling.  

## Let's start coding!

After getting myself more familiar with Rust, Troy, [Log4rs][log] and the metrics system which is very similar to the system I should implement, I started by writing a channel for the data to flow through Tremor. Then came the problem of the way the data could be retrieved.  
To solve this problem, I looked into creating a connector specific to logs. This was kind of cool (not too hard, not too easy) because I could rely on the existing code. I also had the help of team members and other people on the Discord server.  
The good thing about Tremor's codebase in the case of my project, is that there were always a line of code that I could reuse for my needs.  

It's good to be able to collect data, but for what purpose?  

Actually, in addition to emitting log messages in a structured form as "Tremor objects"s (with formatted message, origin, severity (info, warn, etc.), etc.), the logging functions returns the said "Tremor objects"s, thus being able to be used directly following the invocation of the logging function.  

The formatting convention ("named" & "positional") has been thought to be as intuitive and permissive as possible, allowing to manage several usage scenarios (arguments to be formatted with or without var-args, with order, without order with keys, etc.).  
It allows to delegate the aggregation of the items passed in parameters to the underlying Rust code, and thus to allow a simpler and more intuitive usage of the logging functions in a Troy file. 
 
[log]: https://crates.io/crates/log4rs

# Testing

Several integration tests with similar scenarios have been written, and can be seen as concrete examples.  
They show the ability to output logs, filter logs retrieved from the `logging` connector, and also to use the structured return value from the functions.  
Unit tests are not necessarily useful for end users, but they were very useful at times when I was lost between barely stable features (those under development, those to be reviewed, and those missing), to prove me that the functions I wrote worked.  


# Conclusion

My objectives at the beginning of the project were to learn Rust and to improve my English level. Today I can proudly say that my goals have been reached: my level in English is much better even if I still cannot follow Darach and I know enough to be able to code in Rust (even if I have some Rust-specific features left to learn). I also have a clearer vision of what I should expect and how I should behave about my work.  
And I owe all this to my mentors.  

