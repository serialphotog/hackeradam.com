---
title: "Improving Logitech Peripheral Support on Linux"
description: "This quick guide aims to help you improve your experience with using Logitech peripherals on desktop Linux."
date: '2024-06-14'
tags: [Linux, Logitech, Solaar, libratbag]
toc: true
draft: false
---

Throughout highschool and college I daily drove Linux as my main OS and loved it. As time went on, however, I began to get deeper and deeper into <a href="https://adamthompsonphoto.com" target="_blank">Photography</a>, which inevitably lead me to becoming entrenched in the Adobe suite of tools. Despite my love for the Linux operating system, this lead me to begin daily driving Microsoft Windows. 

Over time, however, Windows has only continued to get worse. The constant bloat, forced advertisements, and spyware-like behavior of the OS has made it nearly unbearable to use without investing a significant amount of time into customizing it. This, combined with <a href="https://doublepulsar.com/recall-stealing-everything-youve-ever-typed-or-viewed-on-your-own-windows-pc-is-now-possible-da3e12e9465e" target="_blank">Microsoft's disastrous announcement of Recall</a> and <a href="https://petapixel.com/2024/06/06/photographers-outraged-by-adobes-new-privacy-and-content-terms/" target="_blank">Adobe's privacy policy shenanigans</a> have finally pushed me over the edge. 

I've since cancelled my Adobe membership and completely removed Windows from my remaining devices. Despite being no stranger to using Linux, I haven't daily-driven it outside of work for quite a while. This has lead me on a journey of figuring out how to move my photography workflows into open source tools and just generally make my desktop usable.

One of the first issues I ran into was getting my Logitech MX Master mouse and Logitech G915 TKL keyboard working well. I'd like to share with you the problems I had and how I solved them.

# The MX Master Mouse

For the most part, my Logitech MX Master mouse worked right out of the box by just connecting it. The one issue I had was that the cursor speed was dreadfully slow. Even adjusting the mouse speed in Gnome settings didn't have much effect. This lead me to believe that my DPI setting was too low, but Gnome settings does not expose any way to adjust this, nor does the mouse itself have any way to adjust the DPI. Being that the Logitech control software isn't available for Linux, I'd need to find an alternative. 

It didn't take long to discover the <a href="https://github.com/pwr-Solaar/Solaar" target="_blank">Solaar project</a>. This handy little tool allows you to configure your Logitech peripherals. Being that I'm currently on PopOS, an Ubuntu-based distro, I was able to install by simply running:

```
sudo apt install solaar
```

![Logitech MX Master Mouse Settings in Solaar](/blog/logitech-linux/MXMasterMouseSettingsInSolaar.png#center)

Not only did this flawlessly detect all of my Logitech peripherals, but it also exposed the DPI setting on my mouse. I was able to crank it up to 1600 DPI and now the mouse speed is what I'd expect it to be!

# The G915 TKL Keyboard

Much like my mouse, the keyboard largely worked just fine out of the box. The issue I had was with the lighting effects, which would reset every time the keyboard went to sleep and woke back up. You can apparently work around this by enabling the onboard memory settings in the Logitech control panel, but I had already removed Windows and didn't feel like setting up a Windows install just to enable this. Additionally, despite the fact that Solaar sees the keyboard, it does not expose any sort of lighting options.

![Logitech G915 TKL Settings in Solaar](/blog/logitech-linux/G915TKLInSolaar.png#center)

I once again went searching for alternatives and came across the <a href="https://github.com/libratbag/libratbag" target="_blank">libratbag project</a>. Installing this adds a new command-line tool, called `ratbagctl`, that allows you to control a number of peripherals, including the Logitech G915 TKL Keyboard. The best part is that the settings from this are written to the keyboard's internal memory, so the settings are remembered after it wakes up from sleep. 

To begin with, you need to run the command `ratbagctl list`. This will output a list of detected devices. The first time I did this, however, my keyboard was not found. After doing a bit of internet sleuthing, I found a suggestion to create a copy of the `/usr/share/libratbag/logitech-g915-tkl.device` file (I called mine logitech-g915-tkl.custom.device) and add `;usb:046d:c545` to the `DeviceMatch` line. I did this and reran `ratbagctl list`, which gave me the following output:

```bash
# ratbagctl list
singing-gundi:       Logitech MX Master              
thundering-gerbil:   Logitech USB Receiver
```

That `Logitech USB Receiver` entry is my keyboard! I can now view the current settings for this device by running `ratbagctl "Logitech USB Receiver" info`, which gave me something like the following:

```bash
ratbagctl "Logitech USB Receiver" info                         
thundering-gerbil - Logitech USB Receiver
             Model: usb:046d:c545:0
 Number of Buttons: 15
    Number of Leds: 2
Number of Profiles: 3
Profile 0: (active)
  Name: n/a
  Report Rate: 1000Hz
  Button: 0 is mapped to macro '↕F1'
  Button: 1 is mapped to macro '↕F2'
  Button: 2 is mapped to macro '↕F3'
  Button: 3 is mapped to macro '↕F4'
  Button: 4 is mapped to macro '↕F5'
  Button: 5 is mapped to macro '↕F6'
  Button: 6 is mapped to macro '↕F7'
  Button: 7 is mapped to macro '↕F8'
  Button: 8 is mapped to macro '↕F9'
  Button: 9 is mapped to macro '↕F10'
  Button: 10 is mapped to macro '↕F11'
  Button: 11 is mapped to macro '↕F12'
  Button: 12 is mapped to 'unknown'
  Button: 13 is mapped to 'unknown'
  Button: 14 is mapped to 'unknown'
  LED: 0, depth: rgb, mode: breathing, color: 00dcff, duration: 3000, brightness: 255
  LED: 1, depth: rgb, mode: breathing, color: 00dcff, duration: 3000, brightness: 255
Profile 1:
  Name: n/a
  Report Rate: 1000Hz
  Button: 0 is mapped to macro '↕F1'
  Button: 1 is mapped to macro '↕F2'
  Button: 2 is mapped to macro '↕F3'
  Button: 3 is mapped to macro '↕F4'
  Button: 4 is mapped to macro '↕F5'
  Button: 5 is mapped to macro '↕F6'
  Button: 6 is mapped to macro '↕F7'
  Button: 7 is mapped to macro '↕F8'
  Button: 8 is mapped to macro '↕F9'
  Button: 9 is mapped to macro '↕F10'
  Button: 10 is mapped to macro '↕F11'
  Button: 11 is mapped to macro '↕F12'
  Button: 12 is mapped to 'unknown'
  Button: 13 is mapped to 'unknown'
  Button: 14 is mapped to 'unknown'
  LED: 0, depth: rgb, mode: breathing, color: 00dcff, duration: 3000, brightness: 255
  LED: 1, depth: rgb, mode: breathing, color: 00dcff, duration: 3000, brightness: 255
Profile 2:
  Name: n/a
  Report Rate: 1000Hz
  Button: 0 is mapped to macro '↕F1'
  Button: 1 is mapped to macro '↕F2'
  Button: 2 is mapped to macro '↕F3'
  Button: 3 is mapped to macro '↕F4'
  Button: 4 is mapped to macro '↕F5'
  Button: 5 is mapped to macro '↕F6'
  Button: 6 is mapped to macro '↕F7'
  Button: 7 is mapped to macro '↕F8'
  Button: 8 is mapped to macro '↕F9'
  Button: 9 is mapped to macro '↕F10'
  Button: 10 is mapped to macro '↕F11'
  Button: 11 is mapped to macro '↕F12'
  Button: 12 is mapped to 'unknown'
  Button: 13 is mapped to 'unknown'
  Button: 14 is mapped to 'unknown'
  LED: 0, depth: rgb, mode: cycle, duration: 3000, brightness: 255
  LED: 1, depth: rgb, mode: off
```

I wanted my keyboard LEDs to just be a solid blue color, so I ran the following commands to achieve this:

```bash
ratbagctl "Logitech USB Receiver" led 0 set on
ratbagctl "Logitech USB Receiver" led 0 set color 2093cf 
ratbagctl "Logitech USB Receiver" led 1 set on
ratbagctl "Logitech USB Receiver" led 1 set color 2093cf 
```

After running those 4 commands I'm delighted to say that the lighting on my keyboard works exactly as desired!

# Conclusion 

With this minor annoyances solved, I've got my new Linux install largely working flawlessly for me. Now I just need to perfect a professional-level photography workflow in this new environment! 