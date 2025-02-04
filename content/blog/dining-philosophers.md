---
title: "The Dining Philosophers Problem"
description: "The dining philosophers problem is a classic problem in the realm of computer science. If you’ve had any formal CS education you’ve more than likely seen the problem when learning about concurrent programming. Let's take a look at how to solve it!"
date: '2020-08-21'
tags: [Computer-Science, Programming, C, Operating-Systems, Algorithms]
draft: false
aliases:
    - /post/the-dining-philosophers-problem
---

The dining philosophers problem is a classic problem in the realm of computer science. If you’ve had any formal CS education you’ve more than likely seen the problem when learning about concurrent programming.

Today we will take a look at the problem and look at an example of how we can solve it.

<!--more-->

## The Problem

Suppose you had a round table with five silent philosophers sat around the table. Between each pair of adjacent philosophers is a chopstick (so, 5 total chopsticks) and there is a bowl of rice in the center of the table. In order for a hungry philosopher to eat from the bowl he needs to have both the left and right chopstick available for his use, otherwise, he must sit down his chopstick and go back to thinking.

 The whole idea of the problem is to design a concurrent algorithm that prevents a deadlock situation. That is to say, we want to design an algorithm that allows the philosophers to forever go on thinking and eating.

![An illustration of the dining philosopher's problem](/blog/misc/An_illustration_of_the_dining_philosophers_problem.png#center)
[Photo courtesy of Wikimedia Commons](https://en.wikipedia.org/wiki/File:An_illustration_of_the_dining_philosophers_problem.png).

## Solving the Problem

The whole point of this post is to take a look at one of the possible ways to solve this problem, but I first want to illustrate why this isn’t a non-trivial solution.

### What Doesn't Work

At first glance you could be forgiven for thinking that the solution is completely obvious and could be solved with the following algorithm:

1. Think until the left chopstick is available and then pick it up
2. Think until the right chopstick is available and then pick it up
3. When the philosopher has both chopsticks, eat for some amount of time
4. Put the left chopstick down
5. Put the right chopstick down
6. Loop back to the beginning

Simple, right?

Well, not so fast! This solution will not work and can result in a deadlock state! Just consider the case where each philosopher picks up the chopstick on their left and is now in the state of waiting on the right chopstick to become available. Well, that’s never going to happen now and none of the philosophers are going to be releasing their chopsticks.

There are other issues that can arrive from this solution, but I think you get the idea.

### What Does Work

So, let’s take a look at one of the solutions that does work. The method I will examine here is using **mutex locks**, specifically through the use of **pthreads**. Before we get to the locking bit, however, let’s take a look at some boilerplate code:

```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>
// Forward declarations of functions
void *dine();
int getWaitTime();
void think();
void eat();
// The locking mutex for the chopsticks array
pthread_mutex_t chopstick_mutex = PTHREAD_MUTEX_INITIALIZER;
// The signal that indicates when a chopstick becomes available
pthread_cond_t chopstick_available = PTHREAD_COND_INITIALIZER;
// Chopstick storage for the philosophers
int chopsticks[5];
int main(int argc, char* argv[])
{
    int i, rc;
    pthread_t philosophers[5];
    
    srand(time(NULL));
    
    // Initialize the chopsticks
    for (i = 0; i < 5; ++i)
    {
        chopsticks[i] = 0;
    }
    
    // Spawn the philosopher threads
    for (i = 0; i < 5; ++i)
    {
        if ((rc = pthread_create(&philosophers[i], NULL, &dine, &i)))
            printf("Thread creation failed: %d\n", rc);
        sleep(1);
    }
    
    // Wait for the philosopher threads to complete
    for (i = 0; i < 5; ++i)
    {
        pthread_join(philosophers[i], NULL);
    }
    exit(0);
}
void *dine(void *pnum_ptr)
{
    int pnum = *(int*)pnum_ptr;
    printf("Created philosopher thread %d\n", pnum);
    
    while(1)
    {
        think(pnum);
        eat(pnum);
    }
}
int getWaitTime()
{
    return (rand() % 3) + 1;
}
void think(int pnum)
{
    int thinkTime = getWaitTime();
    printf("Philosopher %d is thinking for %d seconds\n", pnum, thinkTime);
    sleep(thinkTime);
}
void eat(int pnum)
{
    // TODO: Implement me!
}
```

This code should be pretty straightforward, but let’s quickly run through it to see what’s going on. First, we just set up our needed includes and forward declare the functions we will be using later. We then create a global integer array (of size 5) that will represent our 5 chopsticks. An entry of 0 at index i will represent that chopstick number i is currently not held by any philosopher, whereas a 1 will indicate that the chopstick is currently held.

You’ll also notice that I went ahead and declared two global variables, one a mutex lock called ***chopstick_mutex*** and a synchronization device called ***chopstick_available***. These will be used later in our solution.

Next, we get into the **main()** method where we seed the random number generator, set up an array to store all of our philosophers, and initialize all of the data arrays. We implement each philosopher as a thread, which we store in the ***philosophers*** array. You’ll notice in the creation of each philosopher thread I pass a pointer to the ***dine()** method. This is the main run loop for each philosopher.

Finally, we just continue to wait for all of the philosopher threads to complete.

Taking a look at the ***dine()** method you will notice that it’s nothing more than an infinite loop that constantly calls **think()** and **eat()**. The eat() method is the tricky one (and is the whole point of this exercise), so we’ll get to that one in a moment.

The **think()** method is extremely simple, however. As you can see, all it does is make the thread wait for a random amount of time (1-3 seconds, as determined by the **getWaitTime()** method).

Now let’s take a look at how the **eat()** method will function. This is the part of the solution that actually requires some work. Let’s first examine the full implementation of the function and then discuss what’s going on.

```c
void eat(int pnum)
{
    int eatTime = getWaitTime(); // The amount of time to eat
    printf("Philosopher %d is hungry\n", pnum);
    
    pthread_mutex_lock(&chopstick_mutex);
    while (chopsticks[pnum] == 1 || chopsticks[(pnum + 1) % 5] == 1)
    {
        pthread_cond_wait(&chopstick_available, &chopstick_mutex);
    }
    
    chopsticks[pnum] = 1;
    chopsticks[(pnum + 1) % 5] = 1;
    pthread_mutex_unlock(&chopstick_mutex);
    
    // Eat
    printf("Philosopher %d is eating for %d seconds\n", pnum, eatTime);
    sleep(eatTime);
    
    chopsticks[pnum] = 0;
    chopsticks[(pnum + 1) % 5] = 0;
    pthread_cond_signal(&chopstick_available);
}
```

Okay, let’s take a look at what’s going on here.

```c
int eatTime = getWaitTime(); // The amount of time to eat
printf("Philosopher %d is hungry\n", pnum);
```

These first two lines are straightforward enough. We get a random amount of time for the thread to sleep (representing the time the philosopher spends eating) and we print a message to the console. The next 5 lines are a bit more interesting:

```c
pthread_mutex_lock(&chopstick_mutex);
while (chopsticks[pnum] == 1 || chopsticks[(pnum + 1) % 5] == 1)
{
    pthread_cond_wait(&chopstick_available, &chopstick_mutex);
}
```

Here we obtain a mutex lock and check if both the left and right chopstick is available. In the event that both chopsticks aren’t available, we continue looping until they both become available.

```c
chopsticks[pnum] = 1;
chopsticks[(pnum + 1) % 5] = 1;
pthread_mutex_unlock(&chopstick_mutex);
```

In these next three lines, we mark both the left and right chopstick as being held and then release our mutex lock. We then move on to perform the eating:

```c
// Eat
printf("Philosopher %d is eating for %d seconds\n", pnum, eatTime);
sleep(eatTime);
```

As you can see, this is nothing more than printing a message to the console and sleeping for the previously determined amount of time.

```c
chopsticks[pnum] = 0;
chopsticks[(pnum + 1) % 5] = 0;
pthread_cond_signal(&chopstick_available);
```

Finally, we release both chopsticks and send a signal that the chopsticks have been released (via the **pthread_cond_signal** call). It’s probably worth noting that we did not obtain another mutex lock at this stage. This is because it should be impossible for us to reach a deadlock situation here since no other philosopher is able to try to access these chopsticks.

If you build and run the code you should be able to let it run as long as you want without ever running into a deadlock state!

![The working solution running](/blog/misc/DiningPhilosophersSolution.png#center)

Hopefully, you’ll agree that, while it may not necessarily be an obvious solution, it’s not terribly difficult to solve the dining philosophers problem!