---
title: Improve Logitech MX Master 3 Mouse Support on Arch Linux
description: "The MX Master 3 mostly works out of the box on Linux, but I needed to tweak it for full button support."
date: '2025-08-09'
tags: [Linux, Arch, logiops]
toc: true
draft: false
---

Previously I had [written about how I improved my Logitech peripheral support on PopOS using `solaar` and `libratbag`]({{<ref "/blog/logitech-devices-on-linux" >}}). This method worked just fine when I was running Pop, but I've recently switched to an Arch Linux setup on my main desktop. Unfortunately, this previous method wasn't working for getting my Logitech MX Master 3 mouse fully working.

## The Problem

Out of the box, the MX Master 3 mouse mostly just works with Linux. That is, until you want some of the extra buttons to function or to edit things like the mouse's DPI. In this case, you'll need to turn to some third party solutions to fully take advantage of the hardware. 

As previously mentioned, I had previously solved this using `solaar`. This method was still allowing me to edit my mouse's DPI, but it wasn't allowing me full support for all of the buttons on my mouse. Specifically, I couldn't map the thumb button to anything. Ideally, I would like to map this button to the workspace overview on KDE Plasma.

## The Solution

My solution was pretty simple, install and configure `logiops`. As with most anything, this is largely covered on the [Arch Wiki](https://wiki.archlinux.org/title/Logitech_MX_Master), but I'll summarize all of the steps here.

### Step 1: Install logiops from the AUR

To start, you'll obviously need to obtain `logiops`. You can do this easily using [the AUR](https://aur.archlinux.org/packages/logiops).

### Step 2: Enable logiops

You'll need to enable the `logiops` service:

```bash
sudo systemctl enable logid
sudo systemctl start logid
```

### Step 3: Configure logiops

Logiops is controlled by the `/etc/logid.cfg` file. The Arch install from the AUR does not contain one, so you'll need to create it. Here's the config I used to adjust my DPI, map the back and forward buttons, and map the thumb button to the workspace overview on KDE Plasma:

```bash
devices: ({
  name: "Wireless Mouse MX Master";

  // A lower threshold number makes the wheel switch to free-spin mode
  // quicker when scrolling fast.
  smartshift: { on: true; threshold: 20; };

  hiresscroll: { hires: true; invert: false; target: false; };

  // Higher numbers make the mouse more sensitive (cursor moves faster),
  // 4000 max for MX Master 3.
  dpi: 1500;

  buttons: (

    // Forward button
    { cid: 0x56; action = { type: "Keypress"; keys: ["KEY_FORWARD"]; }; },

    // Back button
    { cid: 0x53; action = { type: "Keypress"; keys: ["KEY_BACK"];    }; },

    // Open overview with thumb button
    { cid: 0xc3; action = { type = "Keypress"; keys = ["KEY_LEFTMETA", "KEY_W"]; }; }
  );
});
```

### Step 4: Restart the Daemon

Finally, restart the `logiops` daemon:

```bash
sudo systemctl restart logid
```

I would recommend checking the status as it'll fail to start if there's an error with your config:

```bash
sudo systemctl status logid
● logid.service - Logitech Configuration Daemon
     Loaded: loaded (/usr/lib/systemd/system/logid.service; enabled; preset: disabled)
     Active: active (running) since Sat 2025-08-09 05:49:10 MDT; 11min ago
 Invocation: 2fa3378854944d83893d063164f04b10
   Main PID: 110211 (logid)
      Tasks: 9 (limit: 154032)
     Memory: 1.2M (peak: 2.7M)
        CPU: 114ms
     CGroup: /system.slice/logid.service
             └─110211 /usr/bin/logid

Aug 09 05:49:10 Anubis systemd[1]: Started Logitech Configuration Daemon.
Aug 09 05:49:10 Anubis logid[110211]: [INFO] Detected receiver at /dev/hidraw0
Aug 09 05:49:10 Anubis logid[110211]: [INFO] Device found: Wireless Mouse MX Master on /dev/hidraw0:2

```

With this, my Logitech MX Master 3 mouse is now fully functional on my Arch Linux install!