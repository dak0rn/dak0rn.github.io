---
title: "Bogosort update"
date: 2015-11-24
---

While working on the [Projects page](/projects) I took a look at some of my old projects on GitHub, among others at [Bogosort](https://github.com/dak0rn/bogosort), the implementation of a sorting algorithm in JavaScript I write quite some time ago.

Since the projects was never meant to be something useful it has not been written with the requirements I usually have when writing software; it lacked a good documentation and tests, it had a bad API and was not usable in a non-Common-JS environment.

![Bogosort development with Emacs](/images/bogosort-emacs.png)

Thus, I cloned the project and rewrote it from the ground up. Changes include:

- Tests (with mocha and chai)
- And [UMD export](https://github.com/umdjs/umd)
- A different API which is way more expressive
- Non-mutable sorting
- A better README
- Minified source and Source Maps

I also stuck to the idea of not having external dependencies except for the minifying dependencies where `npm` is used to install *UglifyJS*, *mocha* and *chai* locally.

The project is available on

- [npm](https://www.npmjs.com/package/bogosort)
- [GitHub](https://github.com/dak0rn/bogosort)