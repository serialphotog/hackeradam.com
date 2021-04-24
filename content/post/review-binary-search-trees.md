---
title: "A Review of Binary Search Trees"
description: "As promised in my post reviewing binary trees, here's a review of binary search trees."
date: '2021-02-26'
tags: [Computer-Science, Programming, Discrete-Math]
draft: false
aliases:
    - /a-review-of-binary-search-trees
---

My previous computer science review post took a look at [the tree data structure](https://hackeradam.com/a-review-of-binary-trees/). This time around we will be exploring a specific kind of binary tree: The Binary Search Tree.

Let’s not waste any more time and just jump right in!

## What is a Binary Search Tree?

A **Binary Search Tree (BST)** is a binary tree such that the following holds true:

* The left sub-tree contains only nodes whose values are less than the parent’s value.
* The right sub-tree contains only nodes whose values are greater than the parent’s value.
* The left and right sub-trees must themselves be a valid binary search tree.

Here’s an example of a valid binary search tree:

![Example binary search tree](/blog/binary-search-trees/ExampleBinarySearchTree.png)

The ordering that these properties enforce is what gives the binary search tree its power. By having all of the values (or keys) ordered, operations like searching and finding the max/min value can be done relatively quickly. In fact, the time complexity for operations on a BST turns out to be O(h), where h is the height of the tree.

If the tree was unordered, however, the worst case would be having to search every node in the tree, which means that we effectively have no benefit over just using an unordered list!

## Searching a BST

Searching a binary search tree is very similar to performing a binary search on a sorted list. We start at the root node and compare it’s value with our target. If it’s equal, we’re done. If the target is less than the current node’s value, we move to the left sub-tree, else we move to the right sub-tree. We repeat this process until we’ve either found our target or searched the entire tree.

Let’s look at what this search might look like in Java:

```java
// Searches for a node in a binary search tree
public Node search(Node root, int key) {
    if (root == null || root.data == key) // base case
        return root;
    if (root.data < key)
        // Key is greater than current node, search the right sub-tree
        return search(root.right, key);
    // Key is smaller than root's key, search the left sub-tree
    return search(root.left, key);
}
```

From this, it shouldn’t be too much of a stretch to see that the best case for a binary search tree is when the BST is a balanced tree. When this occurs, searching goes from being O(h) to being O(log n). This is why self-balancing trees can be beneficial, but we’ll cover those in future posts.

## Insertion into a BST

When searching for a location to insert a new node into a binary search tree, we traverse the tree from the root down to the leaves of the tree. Along the way, we make comparisons to decide if we should continue traversing the left or right sub-tree (remember, smaller values to the right and larger values to the left). In this way, a new node will always be inserted as a leaf in the tree.

Consider inserting the value 16 into the following BST:

![BST insertion](/blog/binary-search-trees/BSTInsertion.png)

Let’s take a look at what this insertion code might look like in Java:

```java
public Node insert(Node root, int key) {
    // Base case, perform the insertion
    if (root == null) {
        root = new Node(key);
        return root;
    }
    // Recurse the tree to find insertion point
    if (key < root.data)
        root.left = insert(root.left, key);
    else if (key > root.data)
        root.right = insert(root.right, key);
    return root;
}
```

## Deleting from a BST

There are three possible scenarios when trying to remove a value from a binary search tree:

##### 1) The node to be deleted is a leaf

This is the simplest scenario. Here we only need to delete the node.

##### 2) The node to be deleted has only one child

In this case, we copy the child to the parent and then delete the child node.

##### 3) The node to be deleted has two children

In this case, we need to determine the inorder successor of the node and copy its contents to the parent node and delete the inorder successor.

Let’s take a look at how we could implement this in our Java example:

```java
// Locates a minimum value in a BST
public int findMinimumValue(Node root) {
    int min = root.data;
    while (root.left != null) {
        min = root.left.data;
        root = root.left;
    }
    return min;
}
// Deletes a value from a BST
public Node delete(Node root, int key) {
    // Base case
    if (root == null)
        return root;
    // recurse down the tree
    if (key < root.data)
        root.left = delete(root.left, key);
    else if (key > root.data)
        root.right = delete(root.right, key);
    else {
        // The key is the same as root's, this is the node to be deleted
        if (root.left == null)
            return root.right;
        else if (root.right == null)
            return root.left;
        root.data = findMinimumValue(root.right);
        root.right = delete(root.right, root.data);
    }
    return root;
}
```