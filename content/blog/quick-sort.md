---
title: "CS Review: Quicksort"
description: "Quicksort is yet another divide and conquer sorting algorithm. Let's take a quick look at how it works for a bit of computer science review."
date: '2021-02-28'
tags: [Computer-Science, Programming, Algorithms]
draft: false
aliases:
    - /post/cs-review-quicksort
---

Quicksort is another one of the divide and conquer sorting algorithms. It works by partitioning the array around some chosen pivot point, which there are a few different ways to choose.

Quicksort is generally preferred over [merge sort](https://hackeradam.com/cs-review-merge-sort/) for sorting arrays due to the fact that the general form of the algorithm sorts in-place.

<!--more-->

## How Quicksort Works

As has already been mentioned, quicksort partitions your array of data based on some pivot point. As such, the big question becomes how to choose this pivot point. There are a few common ways that you’ll see:

* Simply use the first element as the pivot point
* Use the last element as the pivot point
* Pick some random element to act as the pivot
* Pick a median value as the pivot point

Most practical implementations of the quicksort algorithm use the randomized approach, so that’s the one I’ll use for my implementation here.

As you’ll see, the partition method is the real key to the entire quicksort algorithm. This method will split the array based on our pivot point. It takes the pivot element and places it in the correct position in the sorted array, placing all smaller elements to the left of pivot and all larger elements to the right.

## Implementation

As usual, I think this concept becomes the most clear when we take a look at the implementation, so here it is in Java:

```java
package com.hackeradam.sorting;
import java.util.Random;
public class Main {
     // Helper function that swaps two items in an array
    public static void swap(int arr[], int i, int j) {
        int tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    // Chooses a random pivot point for Quicksort
    public static void randomPivot(int arr[], int low, int high) {
        Random rand = new Random();
        int pivot = rand.nextInt(high - low) + low;
        swap(arr, pivot, high);
    }
    // Performs the partitioning for Quicksort
    public static int partition(int arr[], int low, int high) {
        // Choose a random pivot point
        randomPivot(arr, low, high);
        int pivot = arr[high];
        int i = low - 1; // Tracks the index of the smaller element
        for (int j = low; j < high; j++) {
            // If current element < pivot, swap
            if (arr[j] < pivot) {
                swap(arr, ++i, j);
            }
        }
        // Swap arr[i + 1] and pivot (high)
        swap(arr, i+1, high);
        return i+1;
    }
    // Performs a quicksort on an integer array
    public static void quicksort(int arr[], int low, int high) {
        if (low < high) {
            int partition = partition(arr, low, high);
            // Do the recursive sort of items left of partition
            // and then items right of partition
            quicksort(arr, low, partition-1);
            quicksort(arr, partition+1, high);
        }
    }
    // Helper to make calling quicksort easier
    public static void quicksort(int arr[]) {
        quicksort(arr, 0, arr.length-1);
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
        System.out.println("After quicksort: ");
        quicksort(items);
        printArray(items);
    }
}
```

## Time Complexity

The worst-case for quicksort occurs when our partition method always chooses either the smallest or largest item as the pivot point. The worst-case in this case turns out to be O(n2). The average case, however, turns out to be O(n log n).

It’s also worth mentioning that while quicksort has a worse worst-case time complexity compared to other algorithms, such as [merge sort](https://hackeradam.com/cs-review-merge-sort/), it’s often faster in practice due to the optimizations that can occur to the inner loop of the algorithm. Additionally, it doesn’t require the O(n) extra space for sorting that merge sort requires.