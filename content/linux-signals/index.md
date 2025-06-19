---
title: "Linux Signals Reference"
description: "A quick reference to some of the signals on Linux."
---

A common concept of Linux systems programming is the idea of sending and receiving signals. You can think of a signal as a software interrupt that's used to announce some sort of event, asynchronously, to a process.

We do not define our own signals. Instead, they are defined by the kernel. Each signal has a number, but they also have a name that begins with *SIG*. We typically refer to a single by its name rather than its number. 

As an example, signal 11 is called **SIGSEGV** and is the signal that is sent to a process when it experiences a segmentation fault.

## The Standard Linux Signals

The first 31 signals are standardized on Linux. Some of these are from the POSIX standard, but not all of them.

<table class="table table-bordered">
    <thead>
        <tr>
            <th scope="col">#</td>
            <th scope="col">Signal Name</th>
            <th scope="col">Default Action</th>
            <th scope="col">Description</th>
            <th scope="col">From POSIX?</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>SIGHUP</td>
            <td>Terminate</td>
            <td>Historically, indicates that a terminal connection has been "hung up". May be used differently on modern systems</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>2</td>
            <td>SIGINT</td>
            <td>Terminate</td>
            <td>Indicates an interrupt from the keyboard, such as issuing <code>Ctrl-C</code>.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>3</td>
            <td>SIGQUIT</td>
            <td>Dump</td>
            <td>Indicates that the receiving process should be terminated and a core dump generated (if enabled). Triggered by <code>Ctrl-\</code> on most terminals.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>4</td>
            <td>SIGILL</td>
            <td>Dump</td>
            <td>Indicates an illegal instruction.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>5</td>
            <td>SIGTRAP</td>
            <td>Dump</td>
            <td>Indicates that a debugging breakpoint was hit.</td>
            <td>No</td>
        </tr>
        <tr>
            <td>6</td>
            <td>SIGABRT</td>
            <td>Dump</td>
            <td>Indicates an abnormal termination.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>6</td>
            <td>SIGIOT</td>
            <td>Dump</td>
            <td>Functionally equivalent to SIGABRT.</td>
            <td>No</td>
        </tr>
        <tr>
            <td>7</td>
            <td>SIGBUS</td>
            <td>Dump</td>
            <td>Indicates a bus error.</td>
            <td>No</td>
        </tr>
        <tr>
            <td>8</td>
            <td>SIGFPE</td>
            <td>Dump</td>
            <td>Indicates a floating-point exception.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>9</td>
            <td>SIGKILL</td>
            <td>Terminate</td>
            <td>Indicates that the process has been force terminated.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>10</td>
            <td>SIGUSR1</td>
            <td>Terminate</td>
            <td>No pre-defined meaning. Available for the process to use.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>11</td>
            <td>SIGSEGV</td>
            <td>Dump</td>
            <td>Indicates an invalid memory reference (segfault).</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>12</td>
            <td>SIGUSR2</td>
            <td>Terminate</td>
            <td>Similar to SIGUSR1, has no pre-defined meaning. Available for the process to use.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>13</td>
            <td>SIGPIPE</td>
            <td>Terminate</td>
            <td>Indicates that the process attempted to write to a pipe or socket that has been closed by the reader.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>14</td>
            <td>SIGALRM</td>
            <td>Terminate</td>
            <td>Sent by the kernel when a timer set by the <code>alarm()</code> syscall expires. Used to implement timeouts and periodic actions in programs.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>15</td>
            <td>SIGTERM</td>
            <td>Terminate</td>
            <td>Indicates process termination.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>16</td>
            <td>SIGSTKFLT</td>
            <td>Terminate</td>
            <td>Indicates a stack error from a coprocessor.</td>
            <td>No</td>
        </tr>
        <tr>
            <td>17</td>
            <td>SIGCHLD</td>
            <td>Ignore</td>
            <td>Indicates that a child process has stopped, been terminated, or continued after being stopped.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>18</td>
            <td>SIGCONT</td>
            <td>Continue</td>
            <td>Resume execution, if stopped.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>19</td>
            <td>SIGSTOP</td>
            <td>Stop</td>
            <td>Indicates that a process should stop execution. Triggered by <code>Ctrl-Z</code> on most terminals.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>20</td>
            <td>SIGTSTP</td>
            <td>Stop</td>
            <td>Stop process issued from a TTY.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>21</td>
            <td>SIGTTIN</td>
            <td>Stop</td>
            <td>Indicates that a background process requires input.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>22</td>
            <td>SIGTTOU</td>
            <td>Stop</td>
            <td>Indicates that a background process requires output.</td>
            <td>Yes</td>
        </tr>
        <tr>
            <td>23</td>
            <td>SIGURG</td>
            <td>Ignore</td>
            <td>Indicates that there is an urgent condition on a socket.</td>
            <td>No</td>
        </tr>
        <tr>
            <td>24</td>
            <td>SIGXCPU</td>
            <td>Dump</td>
            <td>Indicates that a CPU time limit has been exceeded.</td>
            <td>No</td>
        </tr>
        <tr>
            <td>25</td>
            <td>SIGXFSZ</td>
            <td>Dump</td>
            <td>Sent when a process attempts to write beyond the maximum file size limit.</td>
            <td>No</td>
        </tr>
        <tr>
            <td>26</td>
            <td>SIGVTALRM</td>
            <td>Terminate</td>
            <td>Indicates that a process has consumed a certain amount of CPU time. Unlike SIGALRM (which uses the real/wall-clock time), SIGVTALRM tracks the time that the process has been executing on the CPU. It only counts the time when the process is running.</td>
            <td>No</td>
        </tr>
        <tr>
            <td>27</td>
            <td>SIGPROG</td>
            <td>Terminate</td>
            <td>Sent when the profiling timer expires.</td>
            <td>No</td>
        </tr>
        <tr>
            <td>28</td>
            <td>SIGWINCH</td>
            <td>Ignore</td>
            <td>Sent when the process's controlling terminal window changes size.</td>
            <td>No</td>
        </tr>
        <tr>
            <td>29</td>
            <td>SIGIO</td>
            <td>Terminate</td>
            <td>Indicates that I/O is now possible.</td>
            <td>No</td>
        </tr>
        <tr>
            <td>29</td>
            <td>SIGPOLL</td>
            <td>Terminate</td>
            <td>Functionally equivalent to SIGIO. SIGPOLL and SIGIO are actually the same signal.</td>
            <td>No</td>
        </tr>
        <tr>
            <td>30</td>
            <td>SIGPWR</td>
            <td>Terminate</td>
            <td>Indicates a power supply failure.</td>
            <td>No</td>
        </tr>
        <tr>
            <td>31</td>
            <td>SIGSYS</td>
            <td>Dump</td>
            <td>Indicates a bad system call.</td>
            <td>No</td>
        </tr>
    </tbody>
</table>

## What Happens When a Signal is Sent?

When the kernel sends a signal to a process, it **must** be handled. There are three possible ways to do this:

- **Ignore It**. Many of the signals can be safely ignored (but not all of them). For example, you cannot ignore a `SIGKILL` signal.
- **Catch and Handle it**. The process can listen for a signal and handle it itself. The program may use this to terminate things gracefully or even handle it without terminating the program.
- **Use the Default Action**. Every signal has a default action that the process can use.