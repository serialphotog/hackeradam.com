---
title: "CS Review: Merge Sort"
description: "Merge Sort is among the divide and conquer sorting algorithms. Let's take a quick look at how it works for a bit of computer science review."
date: '2021-02-28'
tags: [Computer-Science, Programming, Algorithms]
draft: false
aliases:
    - /cs-review-merge-sort
    - /post/cs-review-merge-sort
---

Merge sort is among the divide and conquer algorithms. That is to say, it divides the input array into half, calls itself on both halves. This process is done recursively over the entire array. When we’re done, all the individually sorted pieces are merged back together to form the fully sorted array.

## A Closer Look at the Functionality

Merge sort can be a bit hard to wrap your head around when you first hear it, so let’s take a look at how the process looks on an example array. Consider that you have the following, unsorted array of integers:

![Unsorted example](/blog/merge-sort/MergeSort_UnsortedExample.png#center)

If we apply merge sort to this data, it’s going to recursively split the array in half until we have done this over the entire length of the data. At this point, it will then start merging the arrays together in the correct, sorted order. The process looks something like this:

![The merge sort process](/blog/merge-sort/MergeSortCallStack.png#center)

I personally think things make a lot more sense when you work through a diagram of the algorithm, such as this one. What makes things even more clear for me, however, is simply seeing the implementation!

## Implementation

The merge sort algorithm will make use of two methods. One is the recursive merge sort method and the other is a merge method which, as the name suggests, will merge the halves of the array back together to form the completely sorted structure.

For our merge sort method, we will take in the array and the length of the array. Since it’s recursive, we will need a base case, which in this case is simply to check if the length of the array is one (which therefor means that we can’t possibly split the data up any more than we already have). Otherwise, it will happily go about splitting up the arrays and calling merge on them.

The merge method simply takes in our two sub-arrays and the original array that we are sorting and merges them together.

Let’s take a look at the algorithm in Java:

```java
package com.hackeradam.sorting;
public class Main {
    public static void merge(int[] dest, int[] left, int[] right) {
        int szLeft = left.length;
        int szRight = right.length;
        // Index counters for the various arrays
        int leftIdx = 0, rightIdx = 0, destIdx = 0;
        // Perform the initial merging
        while (leftIdx < szLeft && rightIdx < szRight) {
            if (left[leftIdx] <= right[rightIdx])
                dest[destIdx++] = left[leftIdx++];
            else
                dest[destIdx++] = right[rightIdx++];
        }
        // Handle any remaining items in left
        while (leftIdx < szLeft)
            dest[destIdx++] = left[leftIdx++];
        // Handle any remaining items in right
        while (rightIdx < szRight)
            dest[destIdx++] = right[rightIdx++];
    }
    public static void mergeSort(int[] arr, int length) {
        if (length  == 1) // Base case for the recursive call
            return;
        // Find the midpoint of the array
        int middle = length / 2;
        // Reserve space for the left and right portions that we will split out
        int[] left = new int[middle];
        int[] right = new int[length - middle];
        // Perform the split
        for (int i = 0; i < middle; i++)
            left[i] = arr[i];
        for (int i = middle; i < length; i++)
            right[i - middle] = arr[i];
        // Recursive calls
        mergeSort(left, middle);
        mergeSort(right, length - middle);
        // Merge the halves together
        merge(arr, left, right);
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
        System.out.println("After merge sort: ");
        mergeSort(items, items.length);
        printArray(items);
    }
}
```

## Complexity 

The merge sort algorithm, as is typical with the divide and conquer algorithms, is quite a fast sort algorithm. In face, it has a worst, average, and best case time complexity of O(n log n).

One thing to take note of is the fact that merge sort requires an amount of additional space that is equal to the size of the unsorted array (which should be intuitively obvious). That is to say, that merge sort requires O(n) of additional storage, where n is the size of the array we are sorting. As such, it’s not exactly a recommended algorithm to use for sorting extremely large datasets.

Merge sort is the preferred method for sorting linked lists due to the way the memory functions in a linked list as compared to an array.