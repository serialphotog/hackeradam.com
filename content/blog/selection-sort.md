---
title: "CS Review: Selection Sort"
description: "Let's quickly review the selection sort algorithm!"
date: '2021-02-27'
tags: [Computer-Science, Programming, Algorithms]
draft: false
aliases:
    - /cs-review-selection-sort
    - /post/cs-review-selection-sort
---

The previous sorting algorithm we took a look at was [bubble sort](https://hackeradam.com/cs-review-bubble-sort/). This time around we will be taking a look at selection sort, which is slightly more complex than bubble sort, but only by a tiny bit.

The idea behind selection sort is that you keep iterating over your array of data, finding the minimum element each time and placing it at the start of the list. In this way, you can think of selection sort as managing two subarrays: the portion of the array that is sorted and the portion that still needs to be sorted.

Like bubble sort, selection sort has a worst-case time complexity of O(n2), but it does have a tendency to outperform bubble sort. Selection sort also has a nice side-effect where it will never do more than O(n) swaps, which is nice if you’re operating in an environment in which memory writes are costly.

<!--more-->

## Implementation

Much like bubble sort, I think the clearest explanation of this algorithm is to simply look at its implementation, so here it is in Java:

```java
package com.hackeradam.sorting;
public class Main {
    public static void selectionSort(int arr[]) {
        int smallestIdx; // Stores the index of the minimum value
        int tmp;
        for (int i = 0; i < arr.length - 1; i++) {
            smallestIdx = i;
            // Locate the smallest items
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[smallestIdx])
                    smallestIdx = j;
            }
            // Perform the swap
            tmp = arr[i];
            arr[i] = arr[smallestIdx];
            arr[smallestIdx] = tmp;
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
        System.out.println("After selection sort: ");
        bubblesort(items);
        printArray(items);
    }
}
```