---
title: Fixing Ghidra Annoyances on Linux with High-DPI Screens
description: "A quick guide on fixing various annoyances with Ghidra on modern Linux with high-DPI screens."
date: '2025-11-10'
tags: [Linux, Ghidra]
toc: true
draft: false
---

At this point, I've written <a href="http://localhost:1313/how-i-automate-backblaze-b2-backups-with-restic-on-linux/" target="_blank">quite</a> a <a href="https://blog.adamthompsonphoto.com/why-im-ditching-windows-and-adobe/" target="_blank">bit</a> about how I've switched completely over to Linux as my primary OS. As with any change in workflow, this has required solving a number of annoyances on my new computing platform. Among the annoyances I've had to solve is getting <a href="https://github.com/NationalSecurityAgency/ghidra" target="_blank">Ghidra</a> working smoothly for me.

# The Problem

Let me start by explaining the problem. You see, I'm no stranger to running Ghidra on Linux. I've been doing it literally for years at this point. As of the past few years, I've simply used the Flatpak version of Ghidra. Typically, this works just fine. The problems arise with trying to use it on my desktop computer, which has two large, 4K screens connected to it. 

On this machine, I'm running Gnome with the display scaling set to 125%. This works magnificently in most applications, but not in the Flatpak version of Ghidra. When I launch it, some of the UI is scaled, while some of it is not. I would love to include a screenshot of exactly what I'm talking about but unfortunately, the problem doesn't really show up in screenshots. Suffice it to say, if you've encountered this problem, you know exactly what I'm talking about!

I spent a fair bit of time searching for a solution to this, but nothing I tried worked.

# The Solution(s)

Given that I could not get the Flatpak version of Ghidra to cooperate, I simply decided that I would manually download Ghidra and work with that. So, I made sure I had an appropriate version of Java installed on my machine and downloaded the latest release of Ghidra from the project's GitHub page. From there, I needed to accomplish two tasks to get everything working the way I wanted:

1. Get the display scaling working correctly.
2. Create a launcher that plays nicely with Gnome.

## Step 1: Fix the Display Scaling

It turns out that it's extremely easy to fix the display scaling for Ghidra when you're running it outside a Flatpak. Inside the root directory for the Ghidra install is a directory called `support`. Within that directory is a file called `launch.properties`. If you look inside that file, you'll find the following line:

```
VMARGS_LINUX=-Dsun.java2d.uiScale=1
```

Simply update that line to the following:

```
VMARGS_LINUX=-Dsun.java2d.uiScale=1
```

Now, when you relaunch Ghidra, you should see that the display scaling is working correctly!

## Step 2: Create a Launcher for Gnome

I actually wrote a quick guide about [how to add a custom launcher to Gnome](https://hackeradam.com/adding-a-custom-launcher-to-gnome-shell/) several years ago. The process is basically the same as what I laid out in that post, but here's the `ghidra.desktop` file that I added to `~/.local/share/applications/`:

```
[Desktop Entry]
Version=1.0
Name=Ghidra
Exec=/home/adam/Tools/ghidra_11.4.2/ghidraRun
Icon=/home/adam/Tools/ghidra_11.4.2/support/ghidra.ico
Type=Application
Categories=Development;
```

Obviously, you'll need to update the paths accordingly.

### Step 2.5: Get the Launcher to Play Nice with Gnome

At this point, I've mostly achieved my goals. I've fixed the display scaling issues with Ghidra, and I've added a launcher to Gnome that functions. There is still one last big annoyance I'd like to address, however.

While my launcher works for, well, launching Ghidra, it's not perfect. The launcher simply runs the `ghidraRun` script, which opens Ghidra as a separate window. This newly created window does not get associated with our launcher, so it shows up as a separate item in my dock without an icon. While this isn't the end of the world, it's certainly a bit annoying. 

Luckily, this is easy to fix!

The root of the problem is that the Ghidra window that gets launched has a different `WM_CLASS` value than that of our launcher. This value is what Gnome uses to properly group windows to their associated launcher. All we need to do is figure out what the `WM_CLASS` of the launched Ghidra window is and add that to our launcher!

To figure out the `WM_CLASS` of the Ghidra window, launch the Ghidra window and run the following command inside a terminal:

```bash
xprop | grep WM_CLASS
```

Now, click on the Ghidra window to make it active. When you do that, you should see something like this in your terminal:

```bash
WM_CLASS(STRING) = "ghidra-Ghidra", "ghidra-Ghidra"
```

In my case, both entries are the same, but the second one is the one you want if they happen to be different for you. Now all we have to do is append it to our `.desktop` file that we created earlier:

```bash
StartupWMClass=ghidra-Ghidra
```

You may need to log out and back in for the change to actually work properly, but after doing this, your Ghidra windows will be properly grouped under the icon of your launcher. 

Much better!