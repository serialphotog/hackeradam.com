---
title: "CS Review: Bubble Sort"
description: "Bubble sort is the easiest possible sorting algorithm you could imagine. Let's take a quick look at it as a bit of computer science review."
date: '2021-02-27'
tags: [Computer-Science, Programming, Algorithms]
draft: false
aliases:
    - /cs-review-bubble-sort
---

Bubble sort is the easiest possible sorting algorithm you could imagine. It works by simply iterating over an array of data and comparing adjacent items. If those items are in the wrong order, then they are swapped. In doing this, the largest items “bubble up” to the correct position in the array (assuming ascending order, anyway).

While this is great from a simplicity standpoint, it’s a pretty awful solution in terms of efficiency. The worst-case performance of bubble sort is O(n2). The best-case turns out to be O(n).

As you can see, this algorithm is not suitable for any sufficiently large datasets.

## Implementation

This algorithm is so simple that I think we can just jump right into the implementation without worrying about too much more explanation.

Here’s a bubble sort implementation in Java:

```java
package com.hackeradam.sorting;
public class Main {
    // Performs a bubble sort on a int array
    public static void bubblesort(int arr[]) {
        int size = arr.length;
        int tmp;
        // This boolean flag is a small optimization
        // that how long the loop needs to run in some
        // situations
        boolean swapped = false;
        for (int i = 0; i < size - 1; i++) {
            swapped = false;
            for (int j = 0; j < size - i - 1; j++) {
                if (arr[j] > arr[j+1]) {
                    // Swap the items
                    tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                    swapped = true;
                }
            }
            // If we didn't need to do a swap in that inner loop
            // then we must be sorted, so break
            if (!swapped)
                break;
        }
    }
    public static void printArray(int arr[]) {
        for (int i=0; i < arr.length; i++) {
            System.out.print(arr[i] + " ");
        }
        System.out.println();
    }
    public static void main(String... args) {
        int items[] = {5, 2, 88, 100, 3, 0, -1, 20, 30, 7, 99};
        printArray(items);
        System.out.println("After bubble sort: ");
        bubblesort(items);
        printArray(items);
    }
}
```