---
title: "Installing DWM on Ubuntu 20.10 LTS"
description: "DWM is a great tiling window manager, but it's sadly not a simple apt-get away on Ubuntu. Let's take a look at how to install it."
date: '2021-01-10'
tags: [Linux, Ubuntu, DWM]
draft: false
cover:
    image: "/blog/misc/dwm.png"
    alt: "Install DWM on Ubuntu 20.10 LTS"
showToc: false
aliases:
    - /installing-dwm-on-ubuntu-20-10-lts
---

[DWM](https://dwm.suckless.org/) is a dynamic, keyboard-driven, tiling window manager developed by [Suckless](https://suckless.org/). It’s a great, light-weight window manager that perfectly fits the bill for my malware analysis lab machine.

Unfortunately, it isn’t a simple apt-get away in Ubuntu, but it’s still an easy process to get up and running. Here’s how it’s done.

![DWM running on Ubuntu 20.10 LTS](/blog/misc/dwm.png#center)

## Installation

First off, we need to install a few dependencies:

```sh
sudo apt-get install build-essential libx11-dev libxinerama-dev sharutils suckless-tools libxft-dev stterm
```

Once this is done, we can download the source for DWM, extract it, and fix the permissions:

```sh
cd /usr/local/src
sudo wget http://dl.suckless.org/dwm/dwm-6.2.tar.gz
sudo tar xvzf dwm-6.2.tar.gz
chown -R `id -u`:`id -g` dwm-6.2
```

Next, we need to build the project and install it:

```sh
cd dwm-6.2/
sudo make clean install
```

At this point, DWM is installed on your system, but we have to do a bit of extra work to get an entry for it on the login screen:

```sh
sudo apt-get install dwm
sudo cp /usr/share/xsessions/dwm.desktop{,.bak}
sudo apt-get purge dwm
sudo mv /usr/share/xsessions/dwm.desktop{.bak,}
```

Finally, logout and you should be able to select DWM from the login prompt!

## Basic Usage

This is here more for my benefit since I’m still getting used to navigating DWM, but here are some of the default key bindings for working with DWM:

* **Alt + Shift + Enter**: Launch Terminal
* **Alt + Shift + C**: Kill current Client
* **Alt + t**: Switch to a Tile Layout
* **Alt + m**: Switch to a Monocle Layout
* **Alt + f**: Switch to a Floating Layout
* **Alt + p**: Launch the demnu
* **Alt + [0-9]**: Switch to tag [0-9]
* **Alt + Shift + Q**: Quit DWM