---
title: "A Review of Binary Trees"
description: "My previous computer science review post covered the basics of set theory. Today's post will be taking a look at the binary tree data structure."
date: '2021-02-25'
tags: [Computer-Science, Programming, Discrete-Math]
draft: false
toc: true
math: true
aliases:
    - /post/a-review-of-binary-trees
---

In my previous review series, I wrote a [brief review of set theory](https://hackeradam.com/a-brief-review-of-set-theory/). This time around we’ll take a look at the binary tree data structure. The tree structure is very common, incredibly useful data structure in the field of computer science and it’s essential that any engineer understand how they work.

<!--more-->

## The Tree Data Structure

A **tree**, unlike some other data structures, such as an array, linked list, stack, or queue, is a hierarchical data structure. Each entry in the tree is called a **node** and the topmost node in the tree is called the **root** of the tree (or the root node). The elements that are directly under a node are referred to as **child** nodes and the node that the children fall under is called a **parent** node.

Let’s look at an example of what a tree might look like:

![An Example Tree](/blog/binary-trees/ExampleTree.png#center)

In this example, A is the root of the tree. The nodes B and C are children of A and A is the parent of B and C. Similarly, D and E are children of B and F is a child of C.

Nodes that do not have any children are called **leaves** in the tree. In this example, D, E, and F are leaves.

The **height** of a tree is defined as the longest path from the root node to any leaf node in the tree. The height of our example tree is 2.

The tree above is an example of a specific type of tree, known as a binary tree. A **binary tree** is a tree structure whose elements have at most two children. Since each element in a binary tree can only have at most two children, we often just refer to them as the **left child** and the **right child**.

The rest of this review will focus primarily on binary trees due to their usefulness throughout computer science.

## Representing a Tree

Trees are extremely easy data structures to implement in a programming language. When you break it down, a tree is just composed of a collection of nodes. Each node contains the following attributes:

* A data value
* A pointer to the left child
* A pointer to the right child

That’s it! So, it should hopefully become pretty clear that we could implement a tree node in C as follows:

```c
struct Node {
    int data;
    struct Node* left;
    struct Node* right;
};
```

So, let’s create our example tree from the previous section in C:

```c
#include <stdlib.h>
// Represents a node in a tree
typedef struct Node {
    char data;
    struct Node* left;
    struct Node* right;
} Node;
int main(int argc, char* argv[]) 
{
    // Build the root node on the heap
    Node* root = malloc(sizeof(Node));
    root->data = 'A';
    root->left = malloc(sizeof(Node));
    root->right = malloc(sizeof(Node));
    // Build the rest of the tree
    root->left->data = 'B';
    root->right->data = 'C';
    root->left->left = malloc(sizeof(Node));
    root->left->left->data = 'D';
    root->left->right = malloc(sizeof(Node));
    root->left->right->data = 'E';
    root->right->right = malloc(sizeof(Node));
    root->right->right->data = 'F';
    return 0;
}
```

While this may not be the most elegant code every, it’s simply to illustrate how the tree structure works.

## Properties of Binary Trees

There are a few important properties of binary trees that are worth knowing. I won’t be going into proofs of any of these properties. We’ll leave that as an exercise for the reader.

### The Maximum Number of Nodes at any Given Level

How would one go about computing the maximum number of nodes at any given level, l, in a binary tree? Well, it’s simply:

$$2^l$$

So, for the root node (level 0), the max number of nodes is 2<sup>0</sup> = 1, which should make perfect sense, and the max number for level 1 would be 2<sup>1</sup> = 2.

### The Maximum Number of Nodes for a Tree of a Given Height

Let’s say that you had a tree of some height, h. You could determine the maximum number of nodes that would fit in this binary tree with the following:

$$2^h - 1$$

So, if I had a tree with a height of 4, the maximum number of nodes in that tree would be:

$$2^4 - 1 = 15$$

### The Minimum Height of a Tree with n Nodes

Say that I know that I have a tree with some number of nodes, n. I can compute the minimum height of that tree with:

$$\mid \\, \log_{2}(n+1) \mid \\, - 1$$

## Types of Binary Trees

We’ve already discussed that binary trees are a specific kind of tree, but it turns out there are a few different forms of binary trees. Let’s take a look at some of these forms:

### Full Binary Tree

A binary tree is considered to be a **full binary tree** simply if every node in the tree has 0 or 2 children. Here’s an example:

![Full Binary Tree Example](/blog/binary-trees/FullTreeExample.png#center)

### Complete Binary Tree

A binary tree is said to be a **complete binary tree** if all the levels, except potentially the last level, are completely filled and all the nodes are as far left as possible. Here’s an example:

![Example of a complete binary tree](/blog/binary-trees/CompleteTreeExample.png#center)

A great practical example of a complete binary tree structure would be a binary heap.

### Perfect Binary Tree

A binary tree is a **perfect binary tree** if all of the internal nodes in the tree have two children and all of the leaf nodes are on the same level. Here’s an example:

![Perfect binary tree example](/blog/binary-trees/PerfectTreeExample.png#center)

It’s worth noting a couple of interesting properties of a perfect binary tree. First, if L is the number of leaf nodes in the tree and I is the number of internal nodes, then

$$L = I + 1$$

Also, the number of nodes for a perfect binary tree of height h is:

$$n = 2^{h+1} - 1$$

### Balanced Binary Tree

A **balanced binary tree** is a binary tree who’s height is

$$O(\log_{2}n)$$

where n is the number of nodes in the tree. A simplified version of this definition is that a balanced binary tree is a binary tree in which the depth of the two sub-trees for every node never differ by more than 1.

So, a simple example of a balanced binary tree would be:

![A simple balanced binary tree example](/blog/binary-trees/BalancedBinaryTree.png#center)

There are a number of specific tree implementations that result in a balanced binary tree. For example, red-black trees are self-balancing binary trees that maintain their O(log n) height by ensuring that the number of black nodes on each root to leaf path is equal and that there are no adjacent red nodes. AVL trees maintain the O(log n) height constraint by ensuring that the difference between heights of the left and right sub-trees is at most 1 (like in our simplified definition above).

The reason one might want to concern themselves with maintaining a balanced binary tree is because they provide O(log n) time for search, insert, and delete operations.

### Pathological Trees

A **pathological tree** (also known as a **degenerate tree**) is a tree in which every internal node only has one child. Here’s a simple example:

![Example of a pathological binary tree](/blog/binary-trees/PathologicalTreeExample.png#center)

It’s also worth noting that, in terms of performance, this is identical to a linked list, which should make sense if you think about it.

## Tree Traversal

An important topic when discussing trees is how to go about traversing them. Unlike a linear data structure, such as an array, there are a number of logical approaches. We will look at the most common of these here.

Consider the following tree:

![An Example Tree](/blog/binary-trees/ExampleTree.png#center)

There are two primary ways to traverse a tree: **depth-first** and **breadth-first**. The depth-first method is further divided into 3 (primary) methods for traversing the tree:

* **Inorder Traversal** (Left sub-tree, root, right-subtree): D B E A C F
* **Preorder Traversal** (Root, left sub-tree, right sub-tree): A B D E C F
* **Postorder Traversal** (Left sub-tree, right-subtree, root): D E B F C A

The **breadth-first** approach, also known as the **level-order traversal**, would result in the following: A B C D E F.

Let’s look at an example of how we can do these various traversals in code. For fun, I’ll do this example in Java:

```java 
package com.hackeradam.traversal;
import java.util.Queue;
import java.util.LinkedList;
// Represents a node in a binary tree
class Node
{
    // The data stored in this node
    public char data;
    // References to the left and right node, respectively
    public Node left;
    public Node right;
    public Node(char data) {
        this.data = data;
        left = right = null;
    }
}
// Represents a binary tree data structure
class BinaryTree
{
    // The root node in the tree
    Node root;
    public BinaryTree() {
        root = null;
    }
    // Prints the tree using postorder traversal
    public void printPostorder(Node node) {
        if (node == null) // base case
            return;
        // Start with the left sub-tree
        printPostorder(node.left);
        // Then do the right sub-tree
        printPostorder(node.right);
        // Then print the node
        System.out.print(node.data + " ");
    }
    // Prints the tree using inorder traversal
    public void printInorder(Node node) {
        if (node == null) // base case
            return;
        // Start with the left sub-tree
        printInorder(node.left);
        // Then handle the node
        System.out.print(node.data + " ");
        // Finally handle the right sub-tree
        printInorder(node.right);
    }
    // Prints the tree using preorder traversal
    public void printPreorder(Node node) {
        if (node == null) // base case
            return;
        // Start with this node
        System.out.print(node.data + " ");
        // Then do the left sub-tree
        printPreorder(node.left);
        // Then the right sub-tree
        printPreorder(node.right);
    }
    // Prints the level order traversal
    public void printLevelOrder() {
        Queue<Node> q = new LinkedList<Node>();
        q.add(root);
        while (!q.isEmpty()) {
            // Remove the head of the queue and print it
            Node tmp = q.poll();
            System.out.print(tmp.data + " ");
            // Enqueue the left sub-tree
            if (tmp.left != null)
                q.add(tmp.left);
            // Then the right sub-tree
            if (tmp.right != null)
                q.add(tmp.right);
        }
    }
}
public class Main {
    public static void main(String... args) {
        // Build the binary tree from the example
        BinaryTree tree = new BinaryTree();
        tree.root = new Node('A');
        tree.root.left = new Node('B');
        tree.root.left.left = new Node('D');
        tree.root.left.right = new Node('E');
        tree.root.right = new Node('C');
        tree.root.right.right = new Node('F');
        System.out.print("Inorder Traversal: ");
        tree.printInorder(tree.root);
        System.out.println();
        System.out.print("Preorder Traversal: ");
        tree.printPreorder(tree.root);
        System.out.println();
        System.out.print("Postorder Traversal: ");
        tree.printPostorder(tree.root);
        System.out.println();
        System.out.print("Level Order Traversal: ");
        tree.printLevelOrder();
        System.out.println();
    }
}
```

Again, this isn’t necessarily the most elegant code. It’s just here to illustrate a point.

You’ll notice that the level order traversal is a bit more complicated and uses a queue data structure. You can also achieve the same result by printing each level of the tree, but I find the queue approach to be more elegant.

Anyway, the general algorithm is as follows:

1. Create a new empty queue
2. enqueue the root node
3. Loop while tmp != null
    1. Remove a node from the queue and store in tmp
    2. print tmp->data
    3. enqueue the left-child of tmp
    4. enqueue the right-child of tmp

This is, in my opinion, an easy and more elegant solution than the alternative of iterating over each level of the tree and printing it.

## Insertion with Level Order Traversal

Let’s say that I had a binary tree and I wanted to insert a node into the first available position in level order. I could do this by performing a level order traversal of the tree. If we come across a node who has no left-child, we insert the new node there, otherwise we insert it at the first node that has no right child.

So, let’s again consider this example tree:

![An Example Tree](/blog/binary-trees/ExampleTree.png#center)

If I were to insert a node, say ‘Z’, into this tree, it would become the following:

![The example tree after insertion](/blog/binary-trees/InorderInsertionExample.png#center)

Now that we understand the principle, let’s see how we could add a level order insertion method to the example code from above:

```java
// Inserts an item into the tree using level order traversal
    public void insert(Node item) {
        if (root == null) {
            root = item;
            return;
        }
        // Do the level order traversal
        Queue<Node> q = new LinkedList<Node>();
        q.add(root);
        while (!q.isEmpty()) {
            Node tmp = q.poll();
            if (tmp.left == null) {
                // Insert the node here
                tmp.left = item;
                break;
            } else {
                // else, enqueue the left node
                q.add(tmp.left);
            }
            if (tmp.right == null) {
                // insert the node here
                tmp.right = item;
                break;
            } else {
                // else, enqueue the right node
                q.add(tmp.right);
            }
        }
    }
```

## Deletion from a Binary Tree

Let’s say that you have a binary tree in which you want to delete a node in such a way that the tree shrinks from the bottom up (note that this is not the same as deletion in a binary search tree!). In other words, the deleted node will be replaced by the bottom-most and right-most node.

Consider this example tree:

![](/blog/binary-trees/PreDeletion.png#center)

If we were to delete the ‘B’ node using this method, we would get the following result:

![](/blog/binary-trees/DeletionExample.png#center)

The algorithm for this works as follows:

1. Start at the root node and find the deepest, right-most node in the binary tree and the node that we want to delete
2. Replace the deepest, right-most node with the node to be deleted
3. Delete the deepest, right-most node

So, for our above example, The process looks something like this:

![Tree Deletion Flow Diagram](/blog/binary-trees/TreeDeletionFlow.png#center)

Now that we understand the mechanics of this deletion method, let’s take a look at how we could add it to our Java example code:

```java
// Deletes the deepest node in the tree
    void deleteDeepestNode(Node target) {
        Queue<Node> q = new LinkedList<Node>();
        q.add(root);
        // Find the deepest node and delete it
        Node tmp = null;
        while (!q.isEmpty()) {
            tmp = q.poll();
            if (tmp == target) {
                tmp = null;
                return;
            }
            if (tmp.right != null) {
                if (tmp.right == target) {
                    tmp.right = null;
                    return;
                } else {
                    q.add(tmp.right);
                }
            }
            if (tmp.left != null) {
                if (tmp.left == target) {
                    tmp.left = null;
                    return;
                } else {
                    q.add(tmp.left);
                }
            }
        }
    }
    // Deletes the given item in the binary tree as outlined above
    void delete(char item) {
        if (root == null)
            return; // Nothing to do
        if (root.left == null && root.right == null) {
            if (root.data == item)
                root = null; // Delete the root node
            return;
        }
        // Find the target node and the last node
        Queue<Node> q = new LinkedList<Node>();
        q.add(root);
        Node target = null;
        Node tmp = null;
        while (!q.isEmpty()) {
            tmp = q.poll();
            if (tmp.data == item) // We found the target node, store it
                target = tmp;
            if (tmp.left != null)
                q.add(tmp.left);
            if (tmp.right != null)
                q.add(tmp.right);
        }
        if (target != null) {
            target.data = tmp.data;
            deleteDeepestNode(tmp);
        }
    }
```

## That’s All… For Now

That’s all I have to say about trees in this post. Stay tuned for future posts where we will explore [Binary Search Trees](https://hackeradam.com/a-review-of-binary-search-trees/), AVL Trees, and Red Black Trees!