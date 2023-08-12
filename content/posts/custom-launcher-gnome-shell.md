---
title: "Adding a Custom Launcher to Gnome Shell"
description: "An issue I recently ran into while running Gnome was that I needed to add a custom launcher to the Gnome Shell. This is how you do it."
date: '2020-08-20'
tags: [Linux, Gnome]
draft: false
cover: 
    image: "/blog/misc/GnomeShellLaunchers.png"
    alt: "Adding a custom launcher to Gnome Shell."
aliases:
    - /adding-custom-launcher-to-gnome-shell
    - /post/adding-custom-launcher-to-gnome-shell
---

I have a long history of using Linux and it has always been my preferred operating system. Due to the needs of [my photography workflow](https://serialphotog.com), however, I’ve been using Windows as my primary OS for the past few years. That’s until recently, however.

While I don’t quite have the photography workflow fully figured out on Linux yet, I’m back to using it as my primary operating system for the first time in probably 5 years. I went with my go-to setup of Ubuntu with the Gnome desktop (I could write a whole additional post as to why this is my go-to, but I digress).

One of the things I’ve found that I’ve needed to do a bit of while setting everything up is adding my own custom launchers to the Gnome applications overview. Like most everything else on Linux, this can be easily done by creating a file.

Let’s take a look!

## Creating a Launcher

To create a new launcher, we just need to create a .desktop file in the following path:

```sh
~/.local/share/applications
```

Here is a template you can use for creating the new launcher:

```txt
[Desktop Entry]
Encoding=UTF-8
Name={APPLICATION_NAME}
Exec={PATH_TO_APPLICATION}
Icon={PATH_TO_ICON}
Type=Application
Categories=Development;
```

As you can see, there are three primary variables you’ll want to edit for your launcher: the name, path to the executable, and the path to the icon. You’ll notice that there’s also a spot at the end to specify the categories of the application, but I don’t believe these are used anywhere in the Gnome shell unless you’re using a menu extension.

### An Example

Just to drive this point home, let’s consider an example. One of the applications I’ve had to do this process for is [Ghidra](https://ghidra-sre.org/).

Ghidra has no distribution package to install but is instead distributed as a zipfile archive. As such, there is no entry automatically added to the Gnome shell launcher for it. In my case, I’m storing Ghidra in the following path:

```sh
/home/adam/tools/ghidra_9.1.2
```

The custom launcher I created for the application looks like this:

```txt
[Desktop Entry]
Encoding=UTF-8
Name=Ghidra
Exec=/home/adam/tools/ghidra_9.1.2/ghidraRun
Icon=/home/adam/tools/ghidra_9.1.2/docs/images/GHIDRA_1.png
Type=Application
Categories=Development;
```

Mere seconds after I saved this file I could see Ghidra listed in the Gnome applications menu!

![The new launcher](/blog/misc/GnomeShellLaunchers.png#center)

Hopefully, you found this post at least somewhat useful. I’m sure I’ll have a bunch of other quick tip type posts as I continue to tweak my installation.