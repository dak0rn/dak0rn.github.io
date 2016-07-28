---
title: "A functional range operator"
date: 2016-02-14
---

While JavaScript offers most of the functional utilites (map, filter, reduce, ...) it lacks a very useful one; `range()`.
This function returns a sequence of numbers following these rules:

- `range(n)` returns a sequence from 0 (inclusive) to `n` (exclusive)
- `range(n, m)` returns a sequence from `n` (inclusive) to `m` (exclusive)
- `range(n, m, s)` returns a sequence from `n` (inclusive) to `m` (exclusive) increasing numbers with `s`

In most functional programming languages, applying `range()` without any arguments returns a sequence of numbers from 0 to infinity created lazily. As JavaScript does not have lazy semantics this rule is omitted.

![](/images/range-applied.png)

Implementing this function is quite easy. Taking a functional approach has some caveats, though. Using a loop is not possible since this would involve mutating variables and since JavaScript engines currently do not implement Tail Call Optimization recursion is also not applicable here. Creating an array with a desired length, though, is possible.

![](/images/array.png)

This array then contains a number of _empty slots_ as Firefox calls them. The problem is, though, that mapping an array of empty slots does not return a new array with different values. Luckily, the `Array()` constructor can be applied with a number of arguments which are then returned as an array.

```javascript
Array(4, 7, 9) === [4, 7, 9]
```

This can be used to create an array of `undefined` values like this:

```javascript
Array.apply(null, Array(3)) === [undefined, undefined, undefined]
```

The other parts of the implementation are decisions concerning the arguments (min, max and the step) and the mapping where the desired values are added.

```javascript
const range = (min, max = null, step = 1) => {
    if( null === max )
        return range(0, min);

    if( max < min )
        return range(max, min).reverse();

    return Array.apply(null, Array( (max - min) / step ))
                .map( (_, index) => min + index * step );
};
```