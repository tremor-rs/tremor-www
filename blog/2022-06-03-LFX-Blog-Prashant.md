---
title: Automating the tremor release process
author: Prashant
author_title: Tremor 2022 Spring Mentee
author_url: https://www.linkedin.com/in/prashantpm20/
tags: ["DevOps", "CI", "mentorship", "cncf"]
draft: false
description: "Prashant's Mentorship experience"
---

It was a pleasant night. I was waiting for LFX to send acceptance/rejection e-mails. And there it was, `"Congratulations! You were accepted to CNCF - Tremor"` . It was a great and exciting feeling to start this journey! And here I am, at the end of it, writing this blog. It was wonderful, everything that I expected it to be, and even more so in the 3 months! I am writing this blog about my experience in this mentorship.

## Introduction

My name's Prashant (Also known as Pimmy on the internet), a 2nd-year university student pursuing my Bachelor's degree in Information Technology. This blog will talk about my project experience in contributing to [Tremor](https://www.tremor.rs) as part of LFX Mentorship Program Spring 2022.

## The Problem

We all hate manual tasks, don't we? No seriously if anyone loves doing things on their own, it's totally fine. Of course not everything can be automated. But in this case, it was something more tedious. Here's a flowchart for basic explanation: 

![Flow](https://user-images.githubusercontent.com/23097199/171433037-99f4d443-7b84-4dc0-b026-972831108889.png)

This is how it was done, but manually. Each process had to be checked by someone to ensure a smooth sailing. It was quite the work, and so making a release candidate was never easy.

## The Approach

The first thing was to divide the tasks into smaller sections and work on this. As my mentors at tremor always used to say, make notes! Keep documenting stuff, really helps. These notes helped me divide the tasks of the current CI process into individual sets of goal, and then I started working on it. 

Now I did have to test *a lot*, 400+ workflows just to get this finally done. So I will explain how the release process works. 

### Drafting the release

1. We select which version we want to release, as shown in the code snippet taken from github actions workflow yaml file.

```yaml
on:
  workflow_dispatch:
    inputs:
      new-version:
        type: choice
        description: "Which version you'd like to release?"
        options:
        - major (_.X.X)
        - minor (X._.X)
        - patch (X.X._)
        - rc (X.X.X-rc)
        - release (removes rc)
        required: true
```
2. Extract the version input (we want major, minor, patch, etc without the brackets), and bumping cargo packages, as shown below. As you can see I extracted the old version before the bump, and put it into `$GITHUB_ENV` , which is creating env variables with these values. Similarly done for new version after the bump. They are needed for creating the PR. 

```yaml
      - name: Extracting version from input
        run: |
          VERSION=$(echo "${{github.event.inputs.new-version}}" | sed 's/ (.*)$//')
          echo "VER=$VERSION" >> $GITHUB_ENV
      - name: Bump new version in TOML files
        run: |
          OLD_VERSION=$(cargo pkgid | cut -d# -f2 | cut -d: -f2)
          echo "OLD=$OLD_VERSION" >> $GITHUB_ENV
          cargo set-version --workspace --bump ${{ env.VER }}
          NEW_VERSION=$(cargo pkgid | cut -d# -f2 | cut -d: -f2)
          echo "NEW=$NEW_VERSION" >> $GITHUB_ENV   
```
3. Commit, push, and Pull Request is created automatically with `Release` tag for the release. From there, the maintainers will do all the necessary reviews, and merge once the CI passes.

### Publishing Release

- So, the Draft Release pull request is merged, great! It automatically triggers the release workflow, which by the way only works if the PR has the `Release` tag, and ignores all other. This is achieved using the conditional statement:

```yaml
 if: github.event.pull_request.merged && contains( github.event.pull_request.labels.*.name, 'Release')
```

- Changelog is automatically extracted using this [great workflow action](https://github.com/ffurrer2/extract-release-notes), and the release is made.

```yaml
      - name: Extract release notes
        id: extract-release-notes
        uses: ffurrer2/extract-release-notes@v1
      - name: Create release
        uses: actions/create-release@v1
```

- To trigger the publish crates workflow, I used this [workflow dispatch action](https://github.com/benc-uk/workflow-dispatch) as shown below:

```yaml
      - name: Trigger publish crates workflow
        uses: benc-uk/workflow-dispatch@v1
        with:
          workflow: Publish crates
          token: ${{ secrets.PAT_TOKEN }}
```
And that's it for the release!

### Publishing crates

The Publish crates workflow is now triggered as mentioned in the previous state. There are 4 main crates to be published, and one job to trigger the draft release workflow for tremor-language-server repo (All automated!). Github actions makes it really great to see which job is interconnected.

![image](https://user-images.githubusercontent.com/23097199/171507584-c8a1bb81-0cbc-4a70-966e-b998758e6430.png)

With all the crates published, including the language-server which follows the exact same process. Tremor has successfully released a new version! Congratulations!

## My thoughts

The tremor community has been extremely helpful in guiding me through the entire mentorship. They have this principle of "Never *worry*, have fun" that will always stay forever with me, and forward in my career. Special mention for [Heinz](https://github.com/Licenser) who mentored me throughout the months and helped me. And to the tremor community in general, my thanks to all of them! 
I didn't know much about github actions or DevOps in general. But now I can confidently say that I can indeed, _make processes boring by automating them_. I will continue to engage in open source projects, and guide others to the same, cheers! 