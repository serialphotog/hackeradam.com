---
title: "I've Been Trying Cosmic Desktop For a Month"
description: "Some thoughts I have on System 76's Cosmic Desktop after trying it for about a month."
date: 2025-10-25T15:52:57-06:00
tags: ['Linux', 'Cosmic-Desktop', 'popos']
toc: true
draft: false
---

It has been nearly a month now since System 76 released a beta build of [Pop OS! 24.04](https://system76.com/pop/pop-beta/) with their new [Cosmic Desktop](https://system76.com/cosmic). Up until this point, I had largely avoided playing with the Cosmic Desktop as I'm generally not interested in putting alpha-quality software on my main devices. This seemed like a great time to slap the new Pop OS! onto my System 76 Pangolin laptop and give it a spin, however.

Having driven the new desktop on this laptop for about a month now, I wanted to share some of my thoughts. 

**Disclaimer:** Both Pop OS! 24.04 and the Cosmic Desktop Environment are still pre-release, beta software. As such, it's important to keep in mind that any criticisms I currently have need to be taken with a grain of salt, being that the software is in no way complete yet.

## General Impressions

![A screenshot of the Cosmic Desktop](/blog/trying-cosmic-desktop/CosmicDesktop.png)

Overall, my impressions of Cosmic are quite positive. Despite being so new and written from scratch, I've found the desktop to be overall very stable. 

The desktop contains all of the features that you'd come to expect from a modern Linux desktop environment. It has a panel, a dock, a quick launch menu, multiple workspaces, and even some nice tiling features that System 76 has become somewhat known for in their Gnome-based releases of Pop OS!

![An example of the tiling in Cosmic Desktop](/blog/trying-cosmic-desktop/CosmicTiling.png)

I've also been very impressed with the performance of the desktop. It's certainly nowhere near as performant as using something like a tiling window manager, but it definitely feels snappier to me than the Gnome desktop. 

## The Cosmic Apps

Most desktop environments (and even window managers) on Linux go with one of two toolkits: Gnome or QT. System 76 opted to do things differently and use the [Iced Toolkit](https://github.com/iced-rs/iced) for Rust. To go along with this different toolkit, they've opted to write a lot of the default apps for the desktop environment from scratch. 

Some of these new apps include a terminal, text editor, app store, calculator, file manager, a media player, and probably a few that I'm missing. Overall, these apps are nice, though barebones still.

All things considered, I'm actually quite impressed with how far along and stable these apps are at this point.

## Stability

As I previously mentioned, I'm overall impressed with the stability of the desktop. In fact, I haven't encountered a single crash with any of the Cosmic apps or the desktop so far. 

With that being said, there have certainly been a few rough edges and stability issues outside of stuff crashing. My biggest example of this has been with the Cosmic Terminal. I've found that the terminal will semi-frequently hang for 30+ seconds. Another issue that's a bit of an annoyance is that the icons for newly installed software will frequently not show up until you restart the desktop. A single restart resolves this, and it's not an issue afterward, so this is more of a minor annoyance than anything.

Outside of these two annoyances, there are of course a myriad of other rough edges that need some polishing before Cosmic is ready for a stable release, but everything is honestly looking really good. It's also worth reiterating that this is pre-release software, so these sort of rough edges are to be expected.

## Conclusions

As you can probably tell from the rest of this post, I'm quite impressed with the work that System 76 has put into the Cosmic Desktop environment. As if creating a new desktop from scratch wasn't a big enough undertaking, they opted to also create a whole suite of apps to go along with it. I think it's impressive how far the whole Cosmic environment has come in a relatively short amount of time.

Despite there still being a few rough edges that need to be worked out, the Cosmic experience is overall stable and quite enjoyable to use. I honestly expected that I would put Cosmic on this Laptop, try it for a week or so, and then go back to an Arch Linux install with some other window manager setup on it. At this point, however, I'm a month into having Cosmic and Pop on this machine, and I've been enjoying it.

The few bumps I've encountered along the way have not been enough to make me jump ship, and I've actually been enjoying seeing Cosmic get more stable as System 76 continues to push out new updates. While I'm not certain that I'll keep this setup on here for good, I do think I'll keep it around for a little bit longer to keep a closer eye on how Cosmic continues to develop. 