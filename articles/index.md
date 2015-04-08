---
title: dak0rn.github.io
author: dak0rn
date: "2015-04-07 20:25"
---

Woohoo, the website has been updated.

Actually, I restructured the complete code base. The site still runs on
Backbone and Marionette supported by jQuery and underscore. I removed require.js
and moved the complete code to a single file.

Articles are written in Markdown with front-matter meta data, transformed to
HTML using Grunt and a couple of plugins and referenced in a JSON file.

That file is loaded dynamically using Backbone and rendered on the page.
The project page uses the GitHub API to obtain a list of non-forked projects
and lists them.

Want to see code? [Come get some](/app.js).
