---
title: "Python - How to Capture Video from a Webcam with OpenCV"
description: "Have you ever wanted to interface with the video feed from a webcam? This quick tutorial will show you how to do so in Python using the OpenCV library."
date: '2017-08-07'
tags: [OpenCV, Python, Programming]
draft: false
toc: false
cover:
    image: "/blog/python-opencv-webcam/result.png"
    alt: "Capturing video from a webcam with OpenCV."
aliases: 
    - /python-how-to-capture-video-feed-from-webcam-using-opencv
    - /post/python-how-to-capture-video-feed-from-webcam-using-opencv
---

Have you ever written code to interface with a webcam? Well, if you have then you know that it can be a royal pain in the ass. And God forbid you want it to be a cross-platform solution! The good news is that there is a ready-made solution that can help us out: OpenCV. Yes, you heard me right. Not only is OpenCV and amazing computer vision library, but it also provides a handy, cross-platform way of interfacing with webcams. Let’s take a look at how simple OpenCV makes this. I’ll be using Python for these examples, but the API is similar in other languages.

<!--more-->

## Shut Up and Show me the Code!

Okay, okay, we’ll take a look at the code already :)

```python
import cv2
# Open a handle to the default webcam
camera = cv2.VideoCapture(0)
# Start the capture loop
while True:
    # Get a frame
    ret_val, frame = camera.read()
    # Show the frame
    cv2.imshow('Webcam Video Feed', frame)
    # Stop the capture by hitting the 'esc' key
    if cv2.waitKey(1) == 27:
        break
# Dispose of all open windows
cv2.destroyAllWindows()
```

Not too surprisingly, running this simple script will open up a window displaying a live video feed from the default webcam. The window can be closed by hitting the escape key. I think this code is pretty self-explanatory, so I won’t dive into it here, but feel free to hit me up if you have any questions!

![Example Webcam Capture](/blog/python-opencv-webcam/result.png#center)