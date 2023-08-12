---
title: "A Gentle Introduction to x86_64 Assembly Language"
description: "This article will serve as my gentle introduction to getting started with x86 Assembly Language. This guide is geared more toward gaining an understanding of Assembly for reverse engineering and similar tasks, rather than Assembly development. With that being said, I hope that this will serve as a good starter point for anyone interested in the topic!"
date: '2021-07-31'
tags: [Computer-Science, Assembly-Language, Reverse-Engineering]
draft: true
---

Hello and welcome to my gentle introduction to assembly language. The goal of this guide is to introduce the basics of what assembly is and how to understand it. For the purposes of this guide, I will be focusing on x86_64 assembly. The good thing about assembly language dialects is that they are all quite similar. What this means is that once you learn one, such as x86, learning another one, such as Arm or MIPS, is pretty straight-forward. 

It's also worth quickly mentioning that x86_64 is a superset of x86. As such, by learning x86_64 assembly you're essentially getting x86 for free!

Let's go ahead and dive right on in!

## Required Base Knowledge

Before we really get going I feel that I should mention that there is a certain level of base knowledge that I'm expecting you, the reader, to have when approaching this guide. I've attempted to write this guide in such a way that it will be approachable by the beginner and intermediate levels alike, but there is still some base knowledge that will, at the very least, make this guide a whole lot easier to understand. They are:

* A decent understanding of the C programming language
* A decent understanding of basic computer science concepts
* A basic understanding of the Linux command line. This isn't completely necessary, but could prove slightly helpful in some circumstances.

And, finally, the most important requirement is **the desire to learn**! If there's something in this guide that you're not quite familiar with then remember that there's the whole internet sitting right at your fingertips!

## What the Heck is Assembly Language, Anyway?

This is likely the first question that we should answer when covering this topic. To get there, let's take a step back and consider a simple C program:

```c
#include <stdio.h>

int main(int argc, char* argv[]) 
{
	printf("Hello, World!\n");
	return 0;
}
```

To even the most green of programmers, this should be an extremely simple to understand program. It's certainly nothing Earth shattering. Here's the problem though: the computer won't understand one bit of this (pun completely intended).

Not surprisingly, this is where the compiling stage comes in. As such, we could compile and run this program quite easily:

```
Adam $ gcc program.c
Adam $ ./a.out
Hello, World!
Adam $
```

So, clearly, the computer understands whatever the compiler generated in that ***a.out*** file. But what's in there?

Well, it shouldn't come as a big surprise that this file contains a bunch of binary data. We could take a look at what some of this data looks like in a hex editor, such as by doing the following on Linux:

```
Adam $ xxd a.out | vim -
```

Here's just a small excerpt of what we might see:

```
00000000: 7f45 4c46 0201 0100 0000 0000 0000 0000  .ELF............
00000010: 0300 3e00 0100 0000 6010 0000 0000 0000  ..>.....`.......
00000020: 4000 0000 0000 0000 7839 0000 0000 0000  @.......x9......
00000030: 0000 0000 4000 3800 0d00 4000 1f00 1e00  ....@.8...@.....
00000040: 0600 0000 0400 0000 4000 0000 0000 0000  ........@.......
00000050: 4000 0000 0000 0000 4000 0000 0000 0000  @.......@.......
00000060: d802 0000 0000 0000 d802 0000 0000 0000  ................
00000070: 0800 0000 0000 0000 0300 0000 0400 0000  ................
00000080: 1803 0000 0000 0000 1803 0000 0000 0000  ................
00000090: 1803 0000 0000 0000 1c00 0000 0000 0000  ................
000000a0: 1c00 0000 0000 0000 0100 0000 0000 0000  ................
000000b0: 0100 0000 0400 0000 0000 0000 0000 0000  ................
000000c0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
000000d0: f805 0000 0000 0000 f805 0000 0000 0000  ................
000000e0: 0010 0000 0000 0000 0100 0000 0500 0000  ................
000000f0: 0010 0000 0000 0000 0010 0000 0000 0000  ................
00000100: 0010 0000 0000 0000 f501 0000 0000 0000  ................
00000110: f501 0000 0000 0000 0010 0000 0000 0000  ................
00000120: 0100 0000 0400 0000 0020 0000 0000 0000  ......... ......
00000130: 0020 0000 0000 0000 0020 0000 0000 0000  . ....... ......
```

Now, the format of this executable file isn't really all that important to the discussion we are trying to have here. On my Linux system it will be an [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format), but on Windows it would be a [PE](https://en.wikipedia.org/wiki/Portable_Executable). These files are formatted in a certain way to contain the various bits of our compiled program in a format that the computer can understand. 

Among the data located in this file is a section called the **.text section**. This is the name of the section that contains the program's executable code. Let's take a peek at the **.text section** for our sample program:

```
00001060: f30f 1efa 31ed 4989 d15e 4889 e248 83e4  ....1.I..^H..H..
00001070: f050 544c 8d05 6601 0000 488d 0def 0000  .PTL..f...H.....
00001080: 0048 8d3d c100 0000 ff15 522f 0000 f490  .H.=......R/....
00001090: 488d 3d79 2f00 0048 8d05 722f 0000 4839  H.=y/..H..r/..H9
000010a0: f874 1548 8b05 2e2f 0000 4885 c074 09ff  .t.H.../..H..t..
000010b0: e00f 1f80 0000 0000 c30f 1f80 0000 0000  ................
000010c0: 488d 3d49 2f00 0048 8d35 422f 0000 4829  H.=I/..H.5B/..H)
000010d0: fe48 89f0 48c1 ee3f 48c1 f803 4801 c648  .H..H..?H...H..H
000010e0: d1fe 7414 488b 0505 2f00 0048 85c0 7408  ..t.H.../..H..t.
000010f0: ffe0 660f 1f44 0000 c30f 1f80 0000 0000  ..f..D..........
00001100: f30f 1efa 803d 052f 0000 0075 2b55 4883  .....=./...u+UH.
00001110: 3de2 2e00 0000 4889 e574 0c48 8b3d e62e  =.....H..t.H.=..
00001120: 0000 e819 ffff ffe8 64ff ffff c605 dd2e  ........d.......
00001130: 0000 015d c30f 1f00 c30f 1f80 0000 0000  ...]............
00001140: f30f 1efa e977 ffff fff3 0f1e fa55 4889  .....w.......UH.
00001150: e548 83ec 1089 7dfc 4889 75f0 488d 3da1  .H....}.H.u.H.=.
00001160: 0e00 00e8 e8fe ffff b800 0000 00c9 c390  ................
00001170: f30f 1efa 4157 4c8d 3d3b 2c00 0041 5649  ....AWL.=;,..AVI
00001180: 89d6 4155 4989 f541 5441 89fc 5548 8d2d  ..AUI..ATA..UH.-
00001190: 2c2c 0000 534c 29fd 4883 ec08 e85f feff  ,,..SL).H...._..
000011a0: ff48 c1fd 0374 1f31 db0f 1f80 0000 0000  .H...t.1........
000011b0: 4c89 f24c 89ee 4489 e741 ff14 df48 83c3  L..L..D..A...H..
000011c0: 0148 39dd 75ea 4883 c408 5b5d 415c 415d  .H9.u.H...[]A\A]
000011d0: 415e 415f c366 662e 0f1f 8400 0000 0000  A^A_.ff.........
000011e0: f30f 1efa c300 0000 f30f 1efa 4883 ec08  ............H...
```

Okay, this is the program code in a format that the CPU can interpret. So what? What does this have to do with assembly language and how the hell is this useful to me?

Glad you asked!

This is what we call **machine language**. It's the lowest-level representation of a program that the computer can understand (at least without talking about electrical signals flowing over wires and such). While the computer may be able to make sense of this jumbled mess, I sure can't! This is where **assembly language** comes in.

You see, assembly is simply one step above the machine language. At the end of the day, assembly is just a text representation of the machine language. Let's take a look at what the assembly language representation of our compiled program (in a.out) looks like. We can do this simply in linux by using a tool called *objdump*:

```
Adam $ objdump -M intel -d a.out | vim -
```

I suppose I should quickly address the **-M intel** bit of the command. There are two "flavors" of assembly language. They are exactly the same thing, just formatted in different ways. Anyway, they are ***Intel Syntax*** and ***AT&T Syntax***. Which one you use is purely a matter of personal preference. Anyway, I prefer the Intel syntax, which is what I will be using in this guide. By default, objdump uses the AT&T syntax, hence the flag to switch it to Intel.

Anyway, running this will give us the full disassembly of the program. Let's take a look at just the disassembly for our **main()** function:

```asm
0000000000001149 <main>:
    1149:	f3 0f 1e fa          	endbr64 
    114d:	55                   	push   rbp
    114e:	48 89 e5             	mov    rbp,rsp
    1151:	48 83 ec 10          	sub    rsp,0x10
    1155:	89 7d fc             	mov    DWORD PTR [rbp-0x4],edi
    1158:	48 89 75 f0          	mov    QWORD PTR [rbp-0x10],rsi
    115c:	48 8d 3d a1 0e 00 00 	lea    rdi,[rip+0xea1]        # 2004 <_IO_stdin_used+0x4>
    1163:	e8 e8 fe ff ff       	call   1050 <puts@plt>
    1168:	b8 00 00 00 00       	mov    eax,0x0
    116d:	c9                   	leave  
    116e:	c3                   	ret    
    116f:	90                   	nop
```

You may not understand much (if any) of what's going on here yet, but I'm sure you can agree that it looks a lot more approachable than just a long string of bytes! In fact, let's strip all of the extra bits that objdump added to the output and just look at the assembly language bit:

```asm
endbr64 
push   rbp
mov    rbp,rsp
sub    rsp,0x10
mov    DWORD PTR [rbp-0x4],edi
mov    QWORD PTR [rbp-0x10],rsi
lea    rdi,[rip+0xea1] 
call   1050 <puts@plt>
mov    eax,0x0
leave  
ret    
nop
```

As you can see, this is starting to look like something that is actually approachable! That's all assembly language is: a human-understandable interpretation of the machine language the computer understands.

## A Deeper Look

So far we've taken an extremely high-level look at what assembly language is. Now it's time to go a bit deeper and start gaining an understanding of what in the world is going on.

Just like any other programming language, assembly language is just a list of instructions. For example, ***sub rsp, 0x10*** is a single instruction from our example program above. In general, an assembly language instruction for x86_64 will have the following format (remember that I'm using the Intel syntax for this guide):

```
<Operation> <Destination>, <Source>
```

The operation is an actual assembly language instruction, such as sub, mov, or lea. In some loose sense you can think of it as a reserved word, but don't take that comparison too literally. 

As for the destination and the source, they can be either a *memory address*, a *register*, or a *literal value*. We will look more at all of these in a bit.

Let's just consider a simple example:

```asm
mov     rbp, rsp
```

The above instruction uses the ***mov*** operation, which is a *move* operation. It specifies the destination as being the *rdp* register and the source as being the *rsp* register. In other words, this line tells the computer to take the value that is currently stored in the *rsp* register and store it in the *rbp* register. 

See that, you just learned how to read your first assembly language instruction!

### Registers

If you're reading this guide then you hopefully have at least a basic understanding of computer science and the basic idea of how a computer processor works. With this, the idea of a register shouldn't be foreign to you. Just as a quick recap, however, a register is nothing more than a small piece of memory located on the CPU that can be accessed extremely quickly.

The memory used for registers is extremely fast, but it's also extremely expensive. As such, we're limited to a small number of them. The exact details of the number and purpose of the registers on a given CPU are dictated by the architecture we're looking at. Since this is a guide to x86_64 assembly, we will be looking at the registers present on that architecture.

Rather than referring to these registers by some hard-to-remember address or something, we give them names, such as rax, rdp, rsp, and so on. On x64 systems, we have eight primary registers that we will want to take a look at:

| Register | Common Name       |
|----------|-------------------|
| RAX      | Accumulator       |
| RCX      | Counter           |
| RDX      | Data              |
| RBX      | Base Register     |
| RSP      | Stack Pointer     |
| RBP      | Base Pointer      |
| RSI      | Source Index      |
| RDI      | Destination Index |

Since we are talking about an x86_64 system, all of these registers store a 64-bit value. Despite these storing 64-bit values, however, we can actually access 32-bit, 16-bit, and 8-bit versions of these. Therefor, we can extend our table:

| Register          | 64-bit long | 32-bit int | 16-bit short | 8-bit char |
|-------------------|-------------|------------|--------------|------------|
| Accumulator       | RAX         | EAX        | AX           | AH and AL  |
| Counter           | RCX         | ECX        | CX           | CH and CL  |
| Data              | RDX         | EDX        | DX           | DH and DL  |
| Base Register     | RBX         | EBX        | BX           | BH and BL  |
| Stack Pointer     | RSP         | ESP        | SP           | SPL        |
| Base Pointer      | RBP         | EBP        | BP           | BPL        | 
| Source Index      | RSI         | ESI        | SI           | SIL        |
| Destination Index | RDI         | EDI        | DI           | DIL        | 

As a quick aside, if you were looking at x86 assembly instead of x86_64, this chart would be the same, with the 64-bit column omitted. 

The first four of these registers (RAX, RCX, RDX, and RBX) are what we typically call the general purpose registers. These primarily act as temporary storage locations when the CPU is executing the program, though some of them can serve specific roles in certain scenarios. 

The other four registers (RSP, RBP, RSI, and RDI) are also general purpose registers, but we often refer to these registers as pointers and indexes. Of these four, the RSP and RBP server extremely important functions for program execution. The stack point (RSP) points to the last item on the stack, which grows toward lower memory addresses. The base pointer (RBP) deals with stack frames and is generally a more convenient way to reference items on the stack. 

Another extremely important register that we haven't yet mentioned is the instruction pointer, which has the pneumonic of RIP. This register points to the next instruction that the CPU will execute. 

It's also important to mention that, in addition to these 9 registers, the x86_64 architecture adds the registers R8 through R15. Additionally, there is the RFLAGS registers, which stores various flags that are used for the results of operations as well as for the control of the CPU. I will also mention that there are a number of other special-purpose registers, but those go beyond the scope of this introduction. 

Before we end our discussion on registers, here's a similar table to the one we had above for the R8 - R15 registers:

| Register | 64-bit long | 32-bit int | 16-bit short | 8-bit char |
|----------|-------------|------------|--------------|------------|
| R8       | R8          | R8D        | R8W          | R8B        |
| R9       | R9          | R9D        | R9W          | R9B        |
| R10      | R10         | R10D       | R10W         | R10B       |
| R11      | R11         | R11D       | R11W         | R11B       |
| R12      | R12         | R12D       | R12W         | R12B       |
| R13      | R13         | R13D       | R13W         | R13B       |
| R14      | R14         | R14D       | R14W         | R14B       |
| R15      | R15         | R15D       | R15W         | R15B       |

### Memory Addresses and Literals

If you recall, I mentioned that a source/destination could be one of three things. Since we already covered registers, that just leaves memory addresses and literals. Of these, literals it the simplest to cover. They are (literally) just a literal value, often times written in hex. So, some examples of literal values could be 0x0, 0x5d, 0xa, etc. 

Memory addresses are also pretty easy to understand, but there is some minor complexity to them. 