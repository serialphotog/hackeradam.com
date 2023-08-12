---
title: "Boolean Algebra Cheat Sheet"
description: "I've previously put together a cheat sheet for logic rules, so I figured I should do the same for boolean algebra!"
date: '2020-04-20'
tags: [Math, Computer-Science, Discrete-Mathematics]
draft: false
aliases:
    - /boolean-algebra-cheat-sheet
    - /post/boolean-algebra-cheat-sheet
---

I previously posted a [logic rules cheat sheet](https://hackeradam.com/logic-rules-cheat-sheet/) and figured it was about time that I do the same for boolean algebra.

| **Expression** | **Equivalent To** | **Name of the Rule** |
|----------------|-------------------|----------------------|
| $$ X + Y $$    | $$ Y + X $$       | Commutative          |
| $$ X \cdot Y $$ | $$ Y \cdot X $$  | Commutative          |
| $$ (X + Y) + Z $$ | $$ X + (Y + Z) $$ | Associative       |
| $$ (X \cdot Y) \cdot Z $$ | $$ X \cdot (y \cdot Z) $$ | Associative |
| $$ X + (Y \cdot Z) $$ | $$ (X + Y) \cdot (Z + Z) $$ | Distributive |
| $$ X \cdot (Y + Z) $$ | $$ (X \cdot Y) + (X \cdot Z) $$ | Distributive |
| $$ X + 0 $$ | $$ X $$ | Identity |
| $$ X \cdot 1 $$ | $$ X $$ | Identity |
| $$ X + X' $$ | $$ 1 $$ | Complement |
| $$ X \cdot X' $$ | $$ 0 $$ | Complement |
| $$ X + X $$ | $$ X $$ | Idempotence |
| $$ X \cdot X $$ | $$ X $$ | Idempotence |