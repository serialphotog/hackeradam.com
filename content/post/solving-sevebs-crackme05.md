---
title: "Solving seVeb's Crackme05"
description: "Let's take a look at how I solved seVeb's Crackme05 challenge."
date: '2020-08-23'
tags: [Reverse-Engineering, Assembly, C, Ghidra, Crackme, Hacking, Python]
draft: false
aliases:
    - /solving-sevebs-crackme05
---

I've recently found myself wanting to further my reverse engineering skills. One of the ways I’ll be doing this is by working on crackmes. This one in particular is from Crackmes.de user seVeb and is called **[crackme05](http://crackmes.cf/users/seveb/crackme05/)**. It’s marked as a C/C++ program compiled for Linux and is rated as being very easy for newbies. Sounds like a perfect place to start!

## Initial Look

![Initial look at the files](/blog/crackme5/seVegbCrackme05Files.png#center)

When I extracted the archive I was greeted with 3 files. The first two are binary files, the only difference presumably being one is built for 32-bit and the other for 64-bit. The third is a readme, which contains a simple description of the challenge:

```txt
Welcome to crackme05 reverser!
Your task is simple, figure out a way to generate valid serials.
Patching is as expected not allowed. Write a keygen and tell us
how you solved the crackme.
Invoke the crackme with the –help or -h flag for additional help.
```

Fair enough! Let’s start by running the executable (note, I’m just going to focus on the 32-bit version with the assumption the logic is identical in both). Running it with no arguments or with the ***-h*** flag gives us the same general message as the readme, as well as specifying that we should pass the key as the first argument to the program.

![The initial run of the executable](/blog/crackme5/InitialRun.png#center)

If we try running the program with some random input as the first argument we get an error that tells us that the serial isn’t 19 chars. This sure seems like some progress already!

![](/blog/crackme5/Not19Chars.png#center)

And sure enough, if we try it again with a 19-character string we get a new error:

![](/blog/crackme5/Wrong.png#center)

While this is some helpful progress, we’re far from done. I think this is probably about all we’re going to ascertain from simply running the program, however, so let’s jump into reverse-engineering the thing!

## Reversing with Ghidra

I loaded the binary into [Ghidra](https://ghidra-sre.org/), which was able to locate the **main()** function, which it came up with the following decompilation of (note that I did correct the function signature to make things a bit nicer):

```c
int main(int argc,char **argv)
{
  int iVar1;
  undefined4 *puVar2;
  uint uVar3;
  char *pcVar4;
  undefined4 *puVar5;
  uint uVar6;
  int in_GS_OFFSET;
  bool bVar7;
  byte bVar8;
  int local_fc;
  undefined local_f7;
  undefined local_f6 [112];
  undefined2 local_86;
  int local_14;
  
  bVar8 = 0;
  local_14 = *(int *)(in_GS_OFFSET + 0x14);
  if (argc < 2) {
    usage(*argv);
    iVar1 = 1;
  }
  else {
    local_fc = 0;
    while (argv[local_fc] != (char *)0x0) {
      iVar1 = strcmp(argv[local_fc],"--help");
      if ((iVar1 == 0) || (iVar1 = strcmp(argv[local_fc],"-h"), iVar1 == 0)) {
        usage(*argv);
        iVar1 = 1;
        goto LAB_08048732;
      }
      local_fc = local_fc + 1;
    }
    rock((int)argv[1]);
    paper(argv[1]);
    scissors((int)argv[1]);
    cracker((int)argv[1]);
    puVar2 = &local_86;
    pcVar4 = 
    "Passed serial is invalid! Just flip your table when you\'re stuck, it will solve your problemcertainly!\n...right?"
    ;
    uVar6 = 0x72;
    bVar7 = ((uint)puVar2 & 2) != 0;
    if (bVar7) {
      local_86 = 0x6150;
      puVar2 = &local_86 + 1;
      pcVar4 = 
      "ssed serial is invalid! Just flip your table when you\'re stuck, it will solve your problemcertainly!\n...right?"
      ;
      uVar6 = 0x70;
    }
    uVar6 = uVar6 >> 2;
    while (uVar6 != 0) {
      uVar6 = uVar6 - 1;
      *puVar2 = *(undefined4 *)pcVar4;
      pcVar4 = (char *)((undefined4 *)pcVar4 + (uint)bVar8 * 0x3ffffffe + 1);
      puVar2 = puVar2 + (uint)bVar8 * 0x3ffffffe + 1;
    }
    if (!bVar7) {
      *(undefined2 *)puVar2 = *(undefined2 *)pcVar4;
    }
    puVar2 = (undefined4 *)&local_f7;
    puVar5 = (undefined4 *)&DAT_08048d20;
    uVar6 = 0x71;
    bVar7 = ((uint)puVar2 & 1) != 0;
    if (bVar7) {
      local_f7 = 0x19;
      puVar2 = (undefined4 *)(&local_f7 + 1);
      puVar5 = (undefined4 *)&DAT_08048d21;
      uVar6 = 0x70;
    }
    if (((uint)puVar2 & 2) != 0) {
      *(undefined2 *)puVar2 = *(undefined2 *)puVar5;
      puVar2 = (undefined4 *)((int)puVar2 + 2);
      puVar5 = (undefined4 *)((int)puVar5 + 2);
      uVar6 = uVar6 - 2;
    }
    uVar3 = uVar6 >> 2;
    while (uVar3 != 0) {
      uVar3 = uVar3 - 1;
      *puVar2 = *puVar5;
      puVar5 = puVar5 + (uint)bVar8 * 0x3ffffffe + 1;
      puVar2 = puVar2 + (uint)bVar8 * 0x3ffffffe + 1;
    }
    iVar1 = 0;
    if ((uVar6 & 2) != 0) {
      *(undefined2 *)puVar2 = *(undefined2 *)puVar5;
      iVar1 = 2;
    }
    if (!bVar7) {
      *(undefined *)((int)puVar2 + iVar1) = *(undefined *)((int)puVar5 + iVar1);
    }
    decraycray((int)&local_86,(int)&local_f7);
    iVar1 = 0;
  }
LAB_08048732:
  if (local_14 == *(int *)(in_GS_OFFSET + 0x14)) {
    return iVar1;
  }
                    /* WARNING: Subroutine does not return */
  __stack_chk_fail();
}
```

This function is pretty straight-forward, but let’s take a closer look at what’s going on. First, we forward declare a bunch of variables. Next, we have the following:

```c
local_14 = *(int *)(in_GS_OFFSET + 0x14);
if (argc < 2) {
    usage(*argv);
    iVar1 = 1;
}
```

All this is doing is reserving space for a 19-character string in a variable called ***local_14*** and checking that we’ve supplied at least one argument. If we haven’t, it displays the usage prompt.

Assuming we did provide an argument, we drop into the else clause of the above if statement. This is where things start to get a bit more interesting:

```c
local_fc = 0;
    while (argv[local_fc] != (char *)0x0) {
      iVar1 = strcmp(argv[local_fc],"--help");
      if ((iVar1 == 0) || (iVar1 = strcmp(argv[local_fc],"-h"), iVar1 == 0)) {
        usage(*argv);
        iVar1 = 1;
        goto LAB_08048732;
      }
      local_fc = local_fc + 1;
    }
    rock((int)argv[1]);
    paper(argv[1]);
    scissors((int)argv[1]);
    cracker((int)argv[1]);
```

The first part of this is just a while loop that is looking for either the **-h** or **–help** flag. It’s the four function calls after this that should look interesting. We can see that the passed parameter is being passed to four separate functions (rock, paper, scissors, and cracker). It’s also worth noting that the errors we got when we were just running the application earlier reference rock and paper.

### rock()

Let’s start by taking a look at the rock() function. After renaming a few variables we get the following decompilation:

```c
void rock(int serial)
{
  int sz;
  int i;
  
  sz = 0;
  i = 0;
  while (*(char *)(serial + i) != '\0') {
    if ((*(char *)(serial + i) < '-') ||
       (('-' < *(char *)(serial + i) && (*(char *)(serial + i) < '0')))) {
      printf("ROCK 1: %i - %c\n",i,(int)*(char *)(serial + i));
      bomb();
    }
    else {
      if ((*(char *)(serial + i) < ':') || ('@' < *(char *)(serial + i))) {
        if ((('Z' < *(char *)(serial + i)) && (*(char *)(serial + i) < 'a')) ||
           ('z' < *(char *)(serial + i))) {
          printf("ROCK 3: %i - %c\n",i,(int)*(char *)(serial + i));
          bomb();
        }
      }
      else {
        printf("ROCK 2: %i - %c\n",i,(int)*(char *)(serial + i));
        bomb();
      }
    }
    sz = sz + 1;
    i = i + 1;
  }
  if (sz != 0x13) {
    puts("ROCK 4: Serial not 19 chars!");
    bomb();
  }
  return;
}
```

There are a few things that I think are immediately obvious here. First, most of the function is made up of a while loop that is iterating over the entire serial. Second, at the very end, we have an if statement that checks if the size of our serial is 0x13, which confirms the suspicion that our serial is going to be 19-characters long.

Let’s take a look at the logic within the while loop.

Looking at this we can see that there are a number of if-else clauses. Let’s look at the first one:

```c
if ((*(char *)(serial + i) < '-') || (('-' < *(char *)(serial + i) & (char *)(serial + i) < '0')))) {
      printf("ROCK 1: %i - %c\n",i,(int)*(char *)(serial + i));
      bomb();
}
```

In this case, we can see that we will have a call to ***bomb()*** if the current character (I’ll call this c from now on) matches the following:

```c
c < '-' || '-' < c < '0'
```

If we jump into the else block of this if-statement, we have another bit of logic:

```c
if ((*(char *)(serial + i) < ':') || ('@' < *(char *)(serial + i)))
```

We can see that this evaluates to true if:

```c
c < ':' || c > '@'
```

We can also notice that if the above condition fails, we will have a call to ***bomb()***. We can therefore conclude that our serial cannot have the characters: **: ; < = > ? @**

Let’s see what logic we have in the next if-statement that gets called if the above test passes:

```c
if ((('Z' < *(char *)(serial + i)) && (*(char *)(serial + i) < 'a')) ||
       ('z' < *(char *)(serial + i))) {
  printf("ROCK 3: %i - %c\n",i,(int)*(char *)(serial + i));
  bomb();
}
```

Analyzing this we can see that we will get a call to ***bomb()*** when the following is true:

```c
(c > 'Z' && c < 'a') || (c > 'z')
```

In other words, we now know that our key can’t contain the characters: **[ \ ] ^ _ ` { | } ~ DEL**

#### Successfully Passing the Checks in rock()

Let’s really quickly put together everything that we’ve just learned looking at the ***rock()*** function. From this, we know that our serial is going to be 19-characters long. We also know that, at this stage of verification, any one of the 19 characters can come from the following set: **– [a-z] [A-Z] [0-0]**

This is a great start, but we’ve still got 3 more stages of verification to figure out!

### paper()

Referring back to the ***main()*** function, we can see that the next function fall is to ***paper()***, which decompiles to the following:

```c
void paper(char *key)
{
  int iVar1;
  int iVar2;
  
  iVar1 = (int)(char)(key[10] ^ key[8]) + 0x30;
  iVar2 = (int)(char)(key[0xd] ^ key[5]) + 0x30;
  if ((iVar1 < 0x3a) && (iVar2 < 0x3a)) {
    if ((iVar1 < 0x30) || (iVar2 < 0x30)) {
      puts("Paper 1 lower");
      bomb();
    }
  }
  else {
    puts("Paper 1");
    bomb();
  }
  if (((int)key[3] == iVar1) && ((int)key[0xf] == iVar1)) {
    if (((int)*key != iVar2) || ((int)key[0x12] != iVar2)) {
      puts("Paper 3");
      bomb();
    }
  }
  else {
    puts("Paper 2");
    bomb();
  }
  return;
}
```

Just taking a quick look at this code it becomes obvious that there are 4 code paths that will result in a call to ***bomb()***. As long as we can avoid these code paths we’re good to go on this stage.

The logic is largely centered around two XOR operations, stored in **iVar1** and **iVar2**:

```c
iVar1 = (int)(char)(key[10] ^ key[8]) + 0x30;
iVar2 = (int)(char)(key[13] ^ key[5]) + 0x30;
```

If we take a moment to analyze the layout of the if-statements, I think it becomes clear that, to pass this stage, the following needs to be true:

```c
(iVar1 < 0x3a && iVar2 < 0x3a) && (key[3] == iVar1 && key[15] == iVar1)
```

and the following needs to be false:

```c
(iVar1 < 0x30 && iVar2 < 0x30) && (key[0] != iVar2 || key[18] != iVar2)
```

These are conditions that our keygen will need to take into account to pass this verification stage.

### scissors()

Let’s move on to looking at the third validation stage, the ***scissors()*** function:

```c
void scissors(int serial)
{
  int iVar1;
  int iVar2;
  
  iVar1 = (int)*(char *)(serial + 2) + (int)*(char *)(serial + 1);
  iVar2 = (int)*(char *)(serial + 0x11) + (int)*(char *)(serial + 0x10);
  if ((iVar1 < 0xab) || (iVar2 < 0xab)) {
    puts("Scissors 1");
    bomb();
  }
  else {
    if (iVar1 == iVar2) {
      puts("Scissors 2");
      bomb();
    }
  }
  return;
}
```

In this stage, we have two code paths that will result in a call to the ***bomb()*** function. This logic is once again centered around two variables, ***iVar1*** and ***iVar2***. Cleaning things up a bit we get the following logic for these:

```c
iVar1 = serial[2] + serial[1];
iVar2 = serial[17] + serial[16];
```

We will get a call to ***bomb()*** if the following conditions are met:

```c
(iVar1 < 0xab || iVar2 < 0xab) || (iVar1 == iVar2)
```

As long as these conditions aren’t met, we pass this third stage of serial validation.

### cracker()

That brings us to the fourth validation function, ***cracker()***, which decompiles to the following:

```c
void cracker(int serial)
{
  if ((int)*(char *)(serial + 0xe) + (int)*(char *)(serial + 4) + (int)*(char *)(serial + 9) != 0x87
     ) {
    puts("cracker 1");
    bomb();
  }
  return;
}
```

In this case, we only get a call to ***bomb()*** if the condition of the if-statement evaluates to true. Cleaning things up a bit, we can see that this happens under the following condition:

```c
(serial[14] + serial[4] + serial[9]) != 0x87
```

We can actually simplify this even further. Recall that in the ***rock()*** function we determined that the smallest possible character our serial could contain was the – character (0x2d). Well, it’s not exactly Earth-shattering news that 0x2d * 3 = 0x87. This means that our condition can actually be thought of as saying that the following condition must be met in our serial:

```c
serial[14] == 0x2d && serial[4] == 0x2d && serial[9] == 0x2d
```

Yep, we know for sure what 3 of the 10 characters in our key are now!

### Back to main()

Let’s go back to ***main()*** now. Assuming we make it through the rock, paper, scissors, and cracker stages without hitting a call to ***bomb()***, we hit the following stretch of code:

```c
puVar2 = &local_86;
    pcVar5 = 
    "Passed serial is invalid! Just flip your table when you\'re stuck, it will solve your problemcertainly!\n...right?"
    ;
    uVar7 = 0x72;
    bVar8 = ((uint)puVar2 & 2) != 0;
    if (bVar8) {
      local_86 = 0x6150;
      puVar2 = &local_86 + 1;
      pcVar5 = 
      "ssed serial is invalid! Just flip your table when you\'re stuck, it will solve your problemcertainly!\n...right?"
      ;
      uVar7 = 0x70;
    }
    uVar7 = uVar7 >> 2;
    while (uVar7 != 0) {
      uVar7 = uVar7 - 1;
      *puVar2 = *(undefined4 *)pcVar5;
      pcVar5 = (char *)((undefined4 *)pcVar5 + (uint)bVar9 * 0x3ffffffe + 1);
      puVar2 = puVar2 + (uint)bVar9 * 0x3ffffffe + 1;
    }
    if (!bVar8) {
      *(undefined2 *)puVar2 = *(undefined2 *)pcVar5;
    }
    puVar2 = (undefined4 *)&local_f7;
    puVar6 = (undefined4 *)&DAT_08048d20;
    uVar7 = 0x71;
    bVar8 = ((uint)puVar2 & 1) != 0;
    if (bVar8) {
      local_f7 = 0x19;
      puVar2 = (undefined4 *)(&local_f7 + 1);
      puVar6 = (undefined4 *)&DAT_08048d21;
      uVar7 = 0x70;
    }
    if (((uint)puVar2 & 2) != 0) {
      *(undefined2 *)puVar2 = *(undefined2 *)puVar6;
      puVar2 = (undefined4 *)((int)puVar2 + 2);
      puVar6 = (undefined4 *)((int)puVar6 + 2);
      uVar7 = uVar7 - 2;
    }
    uVar3 = uVar7 >> 2;
    while (uVar3 != 0) {
      uVar3 = uVar3 - 1;
      *puVar2 = *puVar6;
      puVar6 = puVar6 + (uint)bVar9 * 0x3ffffffe + 1;
      puVar2 = puVar2 + (uint)bVar9 * 0x3ffffffe + 1;
    }
    iVar4 = 0;
    if ((uVar7 & 2) != 0) {
      *(undefined2 *)puVar2 = *(undefined2 *)puVar6;
      iVar4 = 2;
    }
    if (!bVar8) {
      *(undefined *)((int)puVar2 + iVar4) = *(undefined *)((int)puVar6 + iVar4);
    }
    decraycray((int)&local_86,(int)&local_f7);
    uVar1 = 0;
```

Yep, we’re not quite out of the woods just yet!

What it appears is going on here is that we are generating a second string and passing this new string, along with the serial, into a function called ***decraycray()***. If we look at this function, we get the following (after I renamed some variables, anyway):

```c
void decraycray(int str,int serial)
{
  int i;
  
  i = 0;
  while (*(char *)(str + i) != '\0') {
    putchar((int)(char)(*(byte *)(str + i) ^ *(byte *)(serial + i)));
    i = i + 1;
  }
  putchar(10);
  return;
}
```

I think you can plainly see that all this function is doing is XORING each character of the created string and the serial together. A reasonable assumption would be that this is the logic that is generating the message we’ll get upon entering a successful key.

This means that there’s just one final step left… write a keygen!

## Writing the Keygen

It’s finally time to put together everything that we’ve learned to write a keygen. Let’s start with the simplest aspects of generating the key:

* The key is 19 characters long
* The set of possible characters is: **– [a-z] [A-Z] [0-0]**
* We know that character 4, 9, and 14 must be –

Starting with this base logic, we can get the following Python code to get our keygen started:

```python
import string
import random
# Generate the set of possible characters as a byte array
char_options = string.ascii_lowercase + string.ascii_uppercase + string.digits + '-'
valid_chars = bytearray()
valid_chars.extend(map(ord, char_options))

# Generate a random serial that is 19 characters long
serial = [random.choice(valid_chars) for i in range(19)]

# We know that positions 4, 9, and 14 must be a '-' char
# This is technically done in the cracker() stage, but we'll just do it here...
serial[4] = 0x2d
serial[9] = 0x2d
serial[14] = 0x2d
print(serial)
```

This is a good start, but we are far from having all of the logic we need to generate a valid serial for this program. The next step will be to implement the logic that we uncovered in the ***paper()*** stage of the program.

If you’ll recall, there are several cases where we need to generate a character for the serial that is bound by some given condition. As such, I want to add the following function to the keygen that will take in a lambda function that represents a condition and a list of valid characters from which it’ll pull a random entry that meets the given condition. This is what I came up with:

```python
# Generates a random character based on a supplied condition
def conditional_random(cond, chars):
    res = []
    for c in chars:
        if cond(c):
            res.append(c)
    return random.choice(res)
```

With this done, I can easily add in the logic that was uncovered by reversing the ***paper()*** function:

```python
# Logic from the paper() stage
serial[8] = conditional_random(lambda x: (x ^ serial[10]) <= 9, valid_chars)
serial[5] = conditional_random(lambda x: (x ^ serial[13]) <= 9, valid_chars)
iVar1 = (serial[10] ^ serial[8]) + 0x30
iVar2 = (serial[13] ^ serial[5]) + 0x30
serial[3] = iVar1
serial[15] = iVar1
serial[0] = iVar2
serial[18] = iVar2
```

Lastly, we just need to add the logic from the ***scissors()*** stage, which isn’t too dissimilar from what we just did.

```python
# Logic from the scissors() stage
serial[1] = conditional_random(lambda x: x + serial[2] > 170, valid_chars)
serial[16] = conditional_random(lambda x: x + serial[17] > 170 and serial[1] + serial[2] != x + serial[17], valid_chars)
```

There’s just one final thing to do to finish up the keygen. If you run it in this state you’ll see one small issue… it’s outputting a byte-array instead of a string:

![](/blog/crackme5/ByteArray.png#center)

So, we just need to add a quick conversion:

```python
print("".join([chr(c) for c in serial]))
```

Putting the whole thing together we get the following program:

```python
import string
import random
# Generates a random character based on a supplied condition
def conditional_random(cond, chars):
    res = []
    for c in chars:
        if cond(c):
            res.append(c)
    return random.choice(res)

# Generate the set of possible characters as a byte array
char_options = string.ascii_lowercase + string.ascii_uppercase + string.digits + '-'
valid_chars = bytearray()
valid_chars.extend(map(ord, char_options))

# Generate a random serial that is 19 characters long
serial = [random.choice(valid_chars) for i in range(19)]

# We know that positions 4, 9, and 14 must be a '-' char
# This is technically done in the cracker() stage, but we'll just do it here...
serial[4] = 0x2d
serial[9] = 0x2d
serial[14] = 0x2d

# Logic from the paper() stage
serial[8] = conditional_random(lambda x: (x ^ serial[10]) <= 9, valid_chars)
serial[5] = conditional_random(lambda x: (x ^ serial[13]) <= 9, valid_chars)
iVar1 = (serial[10] ^ serial[8]) + 0x30
iVar2 = (serial[13] ^ serial[5]) + 0x30
serial[3] = iVar1
serial[15] = iVar1
serial[0] = iVar2
serial[18] = iVar2

# Logic from the scissors() stage
serial[1] = conditional_random(lambda x: x + serial[2] > 170, valid_chars)
serial[16] = conditional_random(lambda x: x + serial[17] > 170 and serial[1] + serial[2] != x + serial[17], valid_chars)
print("".join([chr(c) for c in serial]))
```

Running the program now will output a string that looks something like this:

![](/blog/crackme5/GeneratedKey.png#center)

The question is, does it work? Let’s find out!

![Success!](/blog/crackme5/Success.png#center)

Bingo! We’ve successfully reverse-engineered the serial checking algorithm of this application and implemented a working keygen for it.
