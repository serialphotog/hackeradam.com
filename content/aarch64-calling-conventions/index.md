---
title: "Aarch64 Calling Conventions"
description: "Documentation for the aarch64 calling convention."
---

Here is some basic documentation for the calling convention on aarch64 (arm64) systems.

## Integer and Pointer Parameters

For integer and pointer function parameters, The first 8 parameters are passed via the `x0` - `x7` registers. All additional parameters are passed on the stack.

## Floating-Point and SIMD Parameters

For float-point and SIMD function parameters, the first 8 parameters are passed in using the `v0` - `v7` registers. Any additional parameters are passed on the stack.

## Return Values

Function return values are stored in `x0` (and `x1` for 128-bit return values) for integer/pointer return values and in `v0` (and `v1` for larger types) for floating-point return types.