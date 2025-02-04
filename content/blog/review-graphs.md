---
title: "A Review of Graphs"
description: "Graphs are an extremely important and useful data structure throughout the field of computer science. They also happen to be one of my favorite data structures. Let's take some time to review what they are and how they work."
date: '2021-02-26'
tags: [Computer-Science, Programming, Discrete-Math]
draft: false
aliases:
    - /post/a-review-of-graphs
---

You may have noticed that I’ve been putting a lot more work into writing posts for my [Computer Science Review series](https://hackeradam.com/computer-science-review/) lately. The last installment of this series took a look at [binary search trees](https://hackeradam.com/a-review-of-binary-search-trees/). This time around we will be taking some time to review one of my favorite data structures: Graphs.

<!--more-->

## What is a Graph?

If you look at the formal definition of a graph, such as the one that you might get in a discrete mathematics course, you’ll get something along these lines: A graph is an ordered triple (N, A, g) where N is a nonempty set of nodes or vertices, A is a set of arcs or edges, and g is a function associating each arc a with an unordered pair {x, y} of nodes. x and y are the endpoints of the arc and g is a function:

$$g: A \rightarrow \\{\\{x, y\\}\\} \mid x \in N \\,\\, and \\,\\, y \in N \\}$$

![What?!](/blog/gifs/what_breaking_bad.gif#center)

Now, perhaps it’s just me, but that isn’t the easiest of definitions to wrap one’s head around! In fact, when I first encountered this definition in school I wasn’t terribly keen on graphs, but it’s really not hard once you understand what’s going on!

You see, a **graph** is basically just a collection of nodes and a set of arcs (also called edges) that connect those nodes. If this sounds like a tree there’s a good reason: a tree is actually a type of directed graph!

To get slightly more formal, a graph is a data structure that has the following components:

* A *finite* set of vertices, called **nodes**.
* A *finite* set of ordered pairs in the form (u, v), called **edges**. The fact that these are ordered pairs is important here in the case where we are dealing with a directed graph rather than an undirected graph. We will look at those terms more in a bit. It’s also worth mentioning that an edge may have a value associated with it, which may be referred to as a **weight**/**value**/**cost**, depending on the context.

Let’s take a look at a very simple, undirected graph:

![An example graph](/blog/graphs/ExampleGraph.png#center)

This example contains 5 nodes (numbered 0-4) and 5 edges.

## Directed vs. Undirected

So, what’s this undirected business with the graph above? Well, it’s actually quite simple. Recall that our edges are a collection of ordered pairs (u, v). In an **undirected graph**, (u, v) and (v, u) are effectively equivalent because our edges have no direction associated with them.

So, consider the edge from node 1 to node 4. Since there is no direction, this edge runs from node 1 to node 4, but it also runs from node 4 to node 1.

From this, you can probably guess that a directed graph is one in which the edges have a direction associated with them. As such, (u, v) and (v, u) are very different things in a directed graph.

Here’s a simple example of a directed graph:

![Example of a directed graph](/blog/graphs/ExampleDirectedGraph.png#center)

In this example, we again have an edge connecting node 1 to node 4. This time around, however, we are dealing with a directed graph. In this particular case, the edge connects node 1 to node 4, but not vice versa!

I suppose I can throw in that if this were a discrete math course you’d see that the g component of our definition from earlier gets changed to being a function associating each arc a with an ordered pair (x, y) or nodes such that:

$$g: A \rightarrow \\{(x, y)\\} \mid x \in N \\,\\, and \\,\\, y \in N\\}$$

Just like before, I’m not particularly fond of this super formal definition!

This is also a good time to talk about reachability. A node is **reachable** from another if a path exists between them. So, in our example graph, 4 is reachable from 1 and 3 is reachable from 2 and 0 (just to name a few examples).

## The Degree of a Node

A topic that sometimes comes up when dealing with graphs (admittedly more in a formal/mathematical context) is the **degree** of a node. The degree simply refers to the number of incident edges from a node.

Let’s consider an example:

![Example of the degree of a node in a graph](/blog/graphs/CompleteGraphExample.png#center)

Consider the green node. It should hopefully be pretty clear, despite my terrible artistry, that this node has degree 5.

## Loops

There’s one more simple piece of terminology we should get out the way before we continue on. A **loop** is simply an edge that connects a vertex to itself. So, in the below example, there is a loop on node A.

![Example of a loop in a graph](/blog/graphs/GraphLoopExample.png#center)

## Simple Graphs

A **simple graph** is simply a graph that has no loops and no parallel edges. Let’s look at an example:

![Example of a simple graph](/blog/graphs/SimpleGraphExample.png#center)

## Connected Graph

A graph is said to be a **connected graph** if there is a path between every pair of vertices. Here’s an example of a connected graph:

![Example of a connected graph](/blog/graphs/ConnectedGraphExample.png#center)

As you can see, there does not necessarily need to be a direct connection between every node for a graph to be connected. There just needs to be a path to reach every node. To further illustrate this point, let’s look at an example of a graph that is **not connected**:

![Example of a graph that is not connected](/blog/graphs/NonConnectedGraphExample.png#center)

Since there is a node that has no path to it (the red node) this graph is not connected.

## Complete Graph

A graph is said to be **complete** if every node is connected by an edge. A more formal way to say this might be that every node, u, is adjacent to every other node, v, in the graph, G.

Here’s an example:

![Example of a complete graph](/blog/graphs/CompleteGraph.png#center)

You may also notice that the example graph I used when discussing the degree of a node is also complete.

## Representing Graphs in a Computer

The above is just the absolute basics of graph theory, but it’s enough to get you started. What we haven’t covered so far, however, is how in the world we can represent these complex structures in memory.

Well, there are two primary ways to go about it: an adjacency matrix and an adjacency list. Let’s take a look at each.

### Adjacency Matrix

An adjacency matrix is really nothing more than a two-dimensional array. For a graph with N nodes, the adjacency matrix will be of size NxN.

The various rows and columns in the adjacency matrix represent the vertices in a graph. The meaning of each entry depends on if the graph is directed or undirected. If the graph is undirected then the element a<sub>i,j</sub> of the matrix being a non-zero value indicates that i and j are adjacent in the graph. In the case of a directed graph, a non-zero value at a<sub>i,j</sub> indicates that there is an arc from node i to node j.

I think this is more clear if we look at an example. Consider the following graph:

![Adjacency example](/blog/graphs/AdjacencyExample.png#center)

First of all, excuse the fact that I can’t draw to save my life! Other than that, it’s important to note that this is an undirected graph (we’ll revisit that in a moment).

Let’s now take a look at the adjacency matrix for this, which we know should be 16 entries (4 rows and 4 columns), since there are 4 nodes in this graph:

![Example adjacency matrix](/blog/graphs/AdjacencyMatrix.png#center)

Reading this is pretty simple. We can see that there is a single edge from node 1 to nodes 1, 2, and 3. There are two edges from node 4 to node 3 and 2 edges from node 3 to node 4.

An interesting thing to note is that the adjacency matrix for an undirected graph is symmetrical. That is, if there is an entry for an edge from node 1 to 2, then there’s also an entry from node 2 to 1.

I think the concept is really quite clear if you compare the graph to the adjacency matrix.

For completeness, let’s look at an example with a directed graph:

![Adjacency example with a directed graph](/blog/graphs/DirectedGraphAdjacencyExample.png#center)

Once again paying no attention to my poor drawing (hey, I’m an engineer, not an artist!), we can see that the adjacency matrix for this graph would be:

![Adjacency matrix for a directed graph](/blog/graphs/DirectedAdjacencyMatrix.png#center)

This time around we don’t have the symmetry that we’d expect to see in the adjacency matrix for an undirected graph, which should make intuitive sense.

Again, I think it’s pretty easy to ascertain what’s going on here.

One interesting property to note is that the diagonal will indicate the loops in our graph (though there are none in our example):

![Example of loops in an adjacency matrix](/blog/graphs/AdjacencyMatrixLoops.png#center)

#### The Pros of an Adjacency Matrix

Let’s take a moment to examine the pros of using an adjacency matrix to represent a graph.

For one, basic operations like adding an edge, removing an edge, and checking if there is an edge from vertex i to vertex j run in constant time (that is, O(1)).

It’s also worth mentioning that we can push matrix operations to the GPU for high-performance scenarios.

#### The Cons of an Adjacency Matrix

The obvious drawback of an adjacency matrix is that it uses a lot of memory, due to the NxN size of the matrix. If a graph doesn’t have very many connections then most of this space is wasted, which is why adjacency lists might be a better fit.

Additionally, performing more complex operations, such as getting all of the edges that enter/exit a node, can be quite a bit more expensive than our basic operations.

#### Example Implementation in Java

An adjacency list is not a complex structure to implement, but let’s take a look at a simple example in Java.

```java
package com.hackeradam.graph;
/**
 * A very simple undirected graph implementation.
 * Notice that converting this to be a directed graph implementation
 * would be a trivial exercise.
 */
class Graph {
    // The adjacency matrix structure
    private int adjMatrix[][];
    // The number of vertices in the graph
    private int nVertices;
    // Initializes the graph
    public Graph(int nVertices) {
        this.nVertices = nVertices;
        adjMatrix = new int[nVertices][nVertices];
    }
    // Adds an edge to the graph
    public void addEdge(int i, int j) {
        adjMatrix[i-1][j-1] += 1;
    }
    // Removes an edge from the graph
    public void removeEdge(int i, int j) {
        adjMatrix[i-1][j-1] -= 1;
    }
    // Prints the adjacency matrix
    public String toString() {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < nVertices; i++) {
            builder.append(i+1 + ": ");
            for (int j : adjMatrix[i]) {
                builder.append(j + " ");
            }
            builder.append("\n");
        }
        return builder.toString();
    }
}
public class Main {
    public static void main(String... args) {
        // Build the example, undirected graph from before
        Graph g = new Graph(4);
        g.addEdge(1, 1);
        g.addEdge(1, 2);
        g.addEdge(1, 3);
        g.addEdge(2, 1);
        g.addEdge(2, 4);
        g.addEdge(3, 1);
        g.addEdge(3, 4);
        g.addEdge(3, 4);
        g.addEdge(4, 2);
        g.addEdge(4, 3);
        g.addEdge(4, 3);
        System.out.println(g.toString());
    }
}
```

Simple, huh?!

### Adjacency List

I mentioned in the previous section that an adjacency matrix can be a poor use of memory when the graphs you’re storing have relatively few arcs. An adjacency list effectively only stores the non-zero entries from the adjacency matrix, making it more efficient in terms of space, though less efficient when it comes time to perform operations on the structure.

The way if works is that we essentially store an array of linked lists for each graph. This results in an evident amount of redundancy when representing an undirected graph, but these redundancy is removed when working with directed graphs.

Let’s start with an example of an adjacency list for an undirected graph:

![Adjacency list example graph](/blog/graphs/AdjacencyListExampleGraph.png#center)

The adjacency list for this graph will look something like this:

![An adjacency list for an undirected graph](/blog/graphs/AdjacencyListForUndirectedGraph.png#center)

Again, with my poor artistry and terrible handwriting out of the way, I think it’s pretty clear what’s going on here if you just compare the graph to the adjacency list.

Let’s look at one more example, this time with a directed graph (notice how much less redundancy there is this time):

![Directed graph adjacency list example](/blog/graphs/DirectedGraphAdjacencyExampled.png#center)

![An adjacency list for a directed graph](/blog/graphs/DirectedGraphAdjacencyList.png#center)

#### Example Implementation in Java

Let’s again look at a simple example of how we could implement this in Java. Once again, this is pretty straightforward.

```java
package com.hackeradam.graph;
import java.util.ArrayList;
/**
 * A very simple undirected graph implementation.
 * Notice that converting this to be a directed graph implementation
 * would be a trivial exercise.
 */
class Graph {
    // The array of adjacency lists
    private ArrayList<ArrayList<Integer>> adjList;
    // Initializes the graph
    public Graph(int size) {
        adjList = new ArrayList<ArrayList<Integer>>(size);
        for (int i = 0; i < size; i++) {
            adjList.add(new ArrayList<Integer>());
        }
    }
    // Adds an edge to the graph
    void addEdge(int i, int j) {
        adjList.get(i-1).add(j-1);
    }
    // Prints the adjacency List
    void print() {
        for (int i = 0; i < adjList.size(); i++) {
            System.out.print("\nVertex: " + (i+1) + ": ");
            for (int j = 0; j < adjList.get(i).size(); j++) {
                System.out.print(" -> " + (adjList.get(i).get(j)+1));
            }
            System.out.println();
        }
    }
}
public class Main {
    public static void main(String... args) {
        // Build the same undirected graph as we did for the
        // adjacency matrix example
        Graph g = new Graph(4);
        g.addEdge(1, 1);
        g.addEdge(1, 2);
        g.addEdge(1, 3);
        g.addEdge(2, 1);
        g.addEdge(2, 4);
        g.addEdge(3, 1);
        g.addEdge(3, 4);
        g.addEdge(3, 4);
        g.addEdge(4, 2);
        g.addEdge(4, 3);
        g.addEdge(4, 3);
        g.print();
    }
}
```

## That’s a Wrap!

Well, that is basically all I have to say for this quick review of graphs (though there’s a whole lot more you could say about them). Graphs can be used for all sorts of real-world problems, from representing networks to being the backbone of apps like Facebook and Google Maps.

It’s safe to say that there will eventually be more graph content in futrue review posts!