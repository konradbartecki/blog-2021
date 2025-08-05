---
title: Interview questions
date: '2021-03-05'
tags: ['career']
draft: false
summary: My personal notes for technical interview questions that you may encounter when looking for a .NET role
---

# Interview questions

## C# and memory management

### Can C# GC collect unmanaged resources?

Technically it can, because most of the "unmanaged" resources used in C# like Stream, File, HttpClient, etc. are a .NET class wrapper around an unmanaged resource.
Using IDisposable allows us to strictly control the time when the resource will be released.
Now when we would use PInvoke and handle some unmanaged system resource directly, then we would need to remember to also release that or create a wrapper with IDisposable.
Otherwise a memory leak would occur.

### What is a memory leak? How it works?

In short when we will request a space for memory and then later we will forget to release that.
It can happen by allocating memory and then losing a pointer to that.

### Can we cause a memory leak in C#?

Yes through event handlers, static vars (discussable whether it is a memory leak or intended behaviour), PInvoke.

### Passing `ref` around

```
public void Go()
{
   Thing x = new Animal();
   Switcharoo(ref x);
}
 public void Switcharoo(ref Thing pValue)
 {
     pValue = new Vegetable();
 }
```

If we wouldn't pass the reference, then pointer would be copied. pValue has it's own pointer copy that does not affect the upper scope, so x = Animal

When we pass the reference of the pointer, then we will also change the 'x' object which will now be a Vegetable.

Source: https://www.c-sharpcorner.com/article/C-Sharp-heaping-vs-stacking-in-net-part-ii/

### Difference between `ref` and `out`

TODO

### Lock

Lock uses Monitor.Enter/Exit under the hood.
It works only on the reference types, because reference types have extra metadata, where CLR can put an ID of locking thread.

Alternatively ID of the locking thread can be put into a separate space in CLR called syncblock.

##### Recursive lock

It will work, because lock only disallows OTHER threads from accessing.

##### When do we get stackoverflow exception

Only when we will get into a recursive method that is infinite, does not have any means of stopping.

##### What is the limit of stackoverlow?

TODO

##### Can locked objects be modified? How about strings?

Yes they technically could be modified as it doesn't matter for lock.
Using strings for lock is a bad practice, because strings can be interned, meaning string with the same value can have the same reference across the whole runtime.

##### Sources

- https://www.markopapic.com/csharp-under-the-hood-locking/
- https://stackoverflow.com/questions/3687505/recursive-nested-locking-in-c-sharp-with-the-lock-statement
- https://stackoverflow.com/questions/2407462/using-lockobj-inside-a-recursive-call

### virtual, override, new and polymorphism

#### What is virtual?

Allows methods to be overriden

#### Can you override methods that are not virtual?

Not really, you could use the `new` keyword, but it is advised against.
See the following example:
https://repl.it/@konradbartecki/ExternalInsubstantialMonitors

```
using System;
public class OperatingSystem
{
   public virtual void Uname() => Console.WriteLine("Unknown OS");
}

public class Linux : OperatingSystem
{
  //We are not overriding here, it would work even when Uname would NOT be virtual
	public new void Uname() => Console.WriteLine("Linux");
}

public class Windows : OperatingSystem
{
	public override void Uname() => Console.WriteLine("Windows");
}

public class Exec
{
 public static void Main()
 {
	  OperatingSystem unknownLinux = new Linux();
    Linux linux = (Linux) unknownLinux;

    OperatingSystem unknownWindows = new Windows();
    Windows windows = (Windows) unknownWindows;


    unknownLinux.Uname();
    linux.Uname();

    unknownWindows.Uname();
    windows.Uname();
 }
}

//Prints:
//Unknown OS
//Linux
//Windows
//Windows
```

#### What is the difference between abstract and interface

Abstract can have a default implementation, but in C# 8 we also will be able to provide default implementation for interfaces.

Interface is still different from Abstract - Interfaces support multiple inheritance - Interfaces can NOT provide implementation of an abstract class - Interface methods are by default public, while in abstract class one may have private and protected methods also

#### What is the difference between override and

The new keyword actually creates a completely new member that only exists on that specific type.

### Hashcode collision

TODO

### Float vs decimal vs double

float and double is a native format for computer, because it's a floating binary point type
in other words they represent a number like this:
10001.10010110011

decimal is a native format for humans, but the slowest to use, takes 128 bit of space.

### Action

TODO

### LINQ internals

TODO

### Delegates

Simply put a function pointer. You can specify which function to run.

##### What's the difference between `Func<T, T1, etc., TResult>`?

Func is a sort of delegate that has up to 4 parameters and a return value.

##### What's the difference between `Action<T>`?

Action is a sort of delegate that does not have a return value

##### What is a `Predicate`

Predicate is a delegate that accepts one or more generic parameters and returns a Boolean value.
Equivalent to `Func<T,bool>`

##### What's the difference between an `event`?

`event` is a syntax sugar, where it provides a private delegate and public event, then code outside of a class can only subscribe/unsubscribe to the event, but cannot change delegate and it's invocation list or even invoke the delegate directly.

Delegate parameters have to match 1:1 whether they are `in` (default), `out`, or `ref`

### String

##### String intern

Strings that have the same value like for example
s1 = "";
s2 = "";

or s3 = "test";
s4 = "test";

even tho these are created independently, thus have a different reference, they could be interned later.

CLR uses a single table with all string created during a runtime and if you request the same value that was previously already created, you could get a string who's reference was already passed somewhere.

##### String == vs string.Equals()

Doesn't matter, string == also compares the VALUE of strings.

## CQRS

CQRS separates reads and writes into different models, using commands to update data, and queries to read data.

    Commands should be task based, rather than data centric. ("Book hotel room", not "set ReservationStatus to Reserved").
    Commands may be placed on a queue for asynchronous processing, rather than being processed synchronously.
    Queries never modify the database. A query returns a DTO that does not encapsulate any domain knowledge.

## SQL

### Types of join

Inner, left, right, full

left outer == left

### Union vs union all

- Union sums two tables + distinct
- Union sums two tables without distinct

### Cross apply vs outer apply

- Cross apply is an equivalent of INNER JOIN for two tables
- Outer apply is an equivalent of LEFT JOIN for two tables

#### What's the difference of APPLY vs JOIN?

> the difference is that the right-hand side operator of APPLY can reference columns from the left-hand side

##### Cross apply example

```sql
SELECT  t1.*, t2o.*
FROM    t1
CROSS APPLY
        (
        SELECT  TOP 3 *
        FROM    t2
        WHERE   t2.t1_id = t1.id
        ORDER BY
                t2.rank DESC
        ) t2o
```

##### Inner join example

```sql
WITH    t2o AS
        (
        SELECT  t2.*, ROW_NUMBER() OVER (PARTITION BY t1_id ORDER BY rank) AS rn
        FROM    t2
        )
SELECT  t1.*, t2o.*
FROM    t1
INNER JOIN
        t2o
ON      t2o.t1_id = t1.id
        AND t2o.rn <= 3

```

also in some scenarios apply may be faster, for example for 20m records it's a differnece of 30s

### Clustered index vs non clustered index

- clustered indexes are sorted
- Since, the data and non-clustered index is stored separately, then you can have multiple non-clustered index in a table.

|                                             CLUSTERED INDEX                                              |                                                            NON-CLUSTERED INDEX                                                             |
| :------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------: |
|                                        Clustered index is faster.                                        |                                                       Non-clustered index is slower.                                                       |
|                           Clustered index requires less memory for operations.                           |                                          Non-Clustered index requires more memory for operations.                                          |
|                               In clustered index, index is the main data.                                |                                             In Non-Clustered index, index is the copy of data.                                             |
|                                A table can have only one clustered index.                                |                                               A table can have multiple non-clustered index.                                               |
|                    Clustered index has inherent ability of storing data on the disk.                     |                              Non-Clustered index does not have inherent ability of storing data on the disk.                               |
|                            Clustered index store pointers to block not data.                             |                             Non-Clustered index store both value and a pointer to actual row that holds data.                              |
|                          In Clustered index leaf nodes are actual data itself.                           |                In Non-Clustered index leaf nodes are not the actual data itself rather they only contains included columns.                |
|                  In Clustered index, Clustered key defines order of data within table.                   |                                   In Non-Clustered index, index key defines order of data within index.                                    |
| A Clustered index is a type of index in which table records are physically reordered to match the index. | A Non-Clustered index is a special type of index in which logical order of index does not match physical stored order of the rows on disk. |

## Update 2: C#:

### Task vs Thread

### Async Internals

### Difference between .NET Framework and .NET Core

### What is Kestrel

### SOLID

### Architecture patterns

#### MVVM

#### MVC

#### MVP

### Design patterns

#### Adapter

#### Bridge

#### Decorator

#### Facade

#### Mediator

#### Memento

#### Proxy

#### State

#### Strategy

#### Singleton

### What is IoC

### What is Dependency Injection

### Types of scope for Microsoft DI
