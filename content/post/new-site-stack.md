---
title: "This Site's New Tech Stack"
description: "I completely redid the tech stack for this site. Here's a behind the scenes look at the new setup."
date: '2021-04-05'
tags: [Web-Development, Hugo, CI-CD, Google-Cloud]
draft: false
---

I just finished moving this website over to a brand new tech stack. To be a bit more specific, the site is now using Hugo and is deployed to Google's Cloud. This post will take a look at the old setup, the new setup, and I will talk a bit about some future plans.

## A Bit of History

I first started this little technical blog back in 2016 as a [Jekyll](https://jekyllrb.com/) site hosted on [Github Pages](https://pages.github.com/). This worked out pretty well, but I didn't particularly love Jekyll and I didn't like the lack of control I had with Github Pages. As such, I moved the site over to [Ghost](https://ghost.org/) on [Digital Ocean](https://www.digitalocean.com/). 

I was actually pretty happy with Ghost, but I eventually got to the point where I wanted to implement some features that would either be extremely difficult, if not impossible, with Ghost. This is when I moved the site over to [WordPress](https://wordpress.org/). I have a love/hate relationship with WordPress. On one hand, it's a great CMS that offers a lot of power and flexibility. On the other hand, it's a bloated monster that is constantly having new vulnerabilities uncovered. Additionally, the performance penalty, even with an aggressive caching policy, had me longing to return to a static setup. I became so frustrated by the performance issues that I never got the motivation to implement the features that caused me to move to WordPress in the first place!

This brings us to the present day setup! The new website is completely static and is generated using [Hugo](https://gohugo.io/). Additionally, I have moved from Digital Ocean, where I have to constantly manage my servers, to [Google Cloud](https://cloud.google.com/). Specifically, the site is hosted on Google's [Firebase](https://firebase.google.com/), but we'll look at that more in a bit. I am also very happy to say that the entire site is deployed through a CI/CD pipeline, which we will look at in a bit. 

## A Bit About Hugo

This is my first project utilizing Hugo, but I already love it! Like Jekyll, Hugo is a static website generator. Unlike Jekyll, however, Hugo offers a nearly infinite amount of customization and flexibility. I am so happy with it, in fact, that I fully intend to eventually move [my photography portfolio](https://serialphotog.com) off of WordPress and over to a similar setup. 

I am using a modified version of the [M10C](https://github.com/vaga/hugo-theme-m10c) theme. My fork of the theme doesn't currently differ too awful much from the upstream version, but that will change as I implement some of those new features I alluded to earlier. Regardless, you can [view my fork of the theme](https://github.com/serialphotog/hugo-theme-m10c), if you so desire. 

## The CI/CD Pipeline

As I've already mentioned, this website is auto-deployed to Firebase through a CI/CD pipeline. The backbone of this setup is [Google's Cloud Build](https://cloud.google.com/build) service. I have configured Cloud Build to monitor the private git repository that this site is contained in. When I push a change to the master branch, Cloud Build kicks into action and builds the site, deploying it to Firebase.

### The Cloud Build Setup

Within Cloud Build, I have two triggers. One is the main build task that monitors the git repository for new pushes. When it detects a push, it executes the jobs specified in a cloudbuild.yaml file, which looks like this:

```yaml
steps:
- name: 'gcr.io/cloud-builders/git'
  entrypoint: '/bin/sh'
  args:
  - '-c'
  - |
    # Get the theme git submodule
    THEME_URL=$(git config -f .gitmodules --get-regexp '^submodule\..*\.url$' | awk '{ print $2 }')
    THEME_DIR=$(git config -f .gitmodules --get-regexp '^submodule\..*\.path$' | awk '{ print $2 }')
    rm -rf themes
    git clone $$THEME_URL $$THEME_DIR

- name: 'gcr.io/cloud-builders/curl'
  entrypoint: '/bin/sh'
  args:
  - '-c'
  - |
    curl -sL https://github.com/gohugoio/hugo/releases/download/v0.82.0/hugo_extended_0.82.0_Linux-64bit.tar.gz | tar -zxv
    ./hugo

- name: 'gcr.io/cloud-builders/wget'
  entrypoint: '/bin/sh'
  args:
  - '-c'
  - |
    # Get firebase CLI
    wget -O firebase https://firebase.tools/bin/linux/latest
    chmod +x firebase
    # Deploy site
    ./firebase deploy --project=$PROJECT_ID --only=hosting
```

The first job simply fetches the repository that contains the hugo theme. Next, we download hugo and run the build on the site. Finally, the site is deployed to Firebase.

I can't overstate how much I love this setup!

## Future Plans

As I've already mentioned, there are a number of things I'd like to do to improve this site going forward. The biggest of these is that I'd like to make the my [Computer Science Review]({{< ref "/computer-science-review" >}}) series more interactive. An example of what I mean would be having interactive animations for some of the concepts, such as visualizing sorting algorithms. 

This site is also serving as a bit of a testing ground before I move [my photography portfolio](https://serialphotog.com) over to Hugo. My portfolio is a much large, much more complex site that will require a lot of custom work to get everything to work the way I want. This technical blog makes for the perfect testing ground for some of this as it is so much smaller and simpler. 