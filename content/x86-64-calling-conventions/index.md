---
title: "x86_64 Calling Conventions"
---

Here is some basic documentation for the various calling conventions on x86_64 architectures. This information largely comes from [Wikipedia](https://en.wikipedia.org/wiki/X86_calling_conventions).

## System V AMD64 ABI

Systems utilizing this convention:

* Solaris
* Linux
* BSD
* MacOS
* OpenVMS
* GCC, Intel C++ Compiler, Clang, Delphi

<table class="table table-bordered">
    <thead>
        <tr>
            <th scope="col">Registers</th>
            <th scope="col">Stack Order</th>
            <th scope="col">Stack Cleanup</th>
            <th scope="col">Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td data-label="Registers">
                RDI, RSI, RDX, RCX, R8, R9, [XYZ]MM0-1
            </td>
            <td data-label="Stack Order">
                RTL (C)
            </td>
            <td data-label="Stack Cleanup">
                Caller
            </td>
            <td data-label="Notes">
                Stack aligned on 16-byte boundary. 128-byte red zone below the stack. The kernel interface uses RDI, RSI, RDX, R10, R8, R9. In C++, <code>this</code> is the first parameter.
            </td>
        </tr>
    </tbody>
</table>

## Microsoft x64 Calling Convention

Used by Microsoft Windows (Microsoft Visual C++, GCC, Intel C++ Compiler, Delphi), UEFI

<table class="table table-bordered">
    <thead>
        <tr>
            <th scope="col">Registers</th>
            <th scope="col">Stack Order</th>
            <th scope="col">Stack Cleanup</th>
            <th scope="col">Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td data-label="Registers">
                RCX/XMM0, RDX/XMM1, R8/XMM2, R9/XMM3
            </td>
            <td data-label="Stack Order">
                RTL (C)
            </td>
            <td data-label="Stack Cleanup">
                Caller
            </td>
            <td data-label="Notes">
                Stack aligned on 16-byte boundary. 32-bytes shadow space on stack. The specified 8 registers can only be used for parameters 1 through 4. For C++ classes, the hidden <code>this</code> parameter is the first parameter, passed in RCX.
            </td>
        </tr>
    </tbody>
</table>

## Vectorcall

Used on Microsoft Windows (Microsoft Visual C++, Clang ICC)

<table class="table table-bordered">
    <thead>
        <tr>
            <th scope="col">Registers</th>
            <th scope="col">Stack Order</th>
            <th scope="col">Stack Cleanup</th>
            <th scope="col">Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td data-label="Registers">
                RCX/[XY]MM0, RDX/[XY]MM1, R8/[XY]MM2, R9/[XY]MM3 + [XY]MM4-5
            </td>
            <td data-label="Stack Order">
                RTL (C)
            </td>
            <td data-label="Stack Cleanup">
                Caller
            </td>
            <td data-label="Notes">
                Extended from MS x64.
            </td>
        </tr>
    </tbody>
</table>