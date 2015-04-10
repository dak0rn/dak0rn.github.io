---
title: espressojs 2.4.0
author: dak0rn
date: "2015-04-10 11:00"
---

After I have released espressojs 2.3.5 this morning I have just pushed
version 2.4.0 to GitHub and npm.

This release includes a new global option named `headers` containing header
fields that should be applied automatically to every response. They still
can be overwritten by resource handlers.

```javascript
var api = new Espresso({

    headers: {
        'Access-Control-Allow-Origin': '*'
    }
});
```

This is verry useful for things like Access Control options required if the
API runs on another port or host.

## How to update

If installed with `npm` it can be updated using the tool:

```bash
npm update
```
