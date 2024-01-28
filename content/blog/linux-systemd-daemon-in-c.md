---
title: "Building a Simple Systemd daemon in C"
description: "Let's take a look at how we can build a bare-bones systemd daemon in C."
date: '2024-01-28'
tags: [Linux, C, Programming]
draft: true
---

This post will serve as a tutorial on how to write a minimal `systemd` service for Linux in C. The project will use `autotools` for the build system. The daemon we will implement will listen for messages from other programs over a Unix Domain Socket, will support reloading, and will support logging via `journald`. 
