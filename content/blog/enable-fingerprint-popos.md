---
title: "Enable Fingerprint Authentication on PopOS"
description: "A quick guide to easily enable fingerprint authentication in PopOS Linux."
date: '2023-08-15'
tags: [Linux, PopOS]
draft: false
---

I recently switched to trying out System 76's PopOS Linux on my Thinkpad laptop. So far I am extremely happy daily driving this distro but, out of the box, it doesn't seem to have built-in support for my laptop's fingerprint reader. Luckily, it's extremely simple to fix this.

<!--more-->

The first step is to install the necessary packages:

```bash
sudo apt update && sudo apt install fprintd libpam-fprintd
```

Next, we need to enroll our fingerprint. This is done by running the following command and continuously placing your finger on the sensor:

```bash
fprintd-enroll
```

Finally, we just need to update PAM to use the newly enrolled fingerprint:

```
sudo pam-auth-update
```

Once this is done you're all set! 
