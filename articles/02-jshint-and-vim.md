vim is an awesome editor for any kind of programming language and I
use it to write my JavaScript applications. Coming from Atom, I really
wanted to have JSHint support. Luckily, setting it up is quite easy.

First you have to **install JSHint globally**:

```shell
sudo npm install -g jshint
```

Next, you need to install the plugin. Instead of using on of the JSHint
plugins I use [Syntastic](https://github.com/scrooloose/syntastic), a
general purpose syntax checker plugin.
Although it's installation tutorial explicitely mentions pathogen,
I use [Vundle](https://github.com/gmarik/Vundle.vim), a vim package
manager. To install the plugin with vundle, open your `~/.vimrc` file
and add the following line to the vundle section:

```vimL
Plugin 'scrooloose/syntastic'
```

As usual, you can install the plugin by (re)starting vim and executing
`:PluginInstall`.

Now that the plugin is ready, we need to tell syntastic what checker to
use. Open your `~/.vimrc` again and append the following line:

```vimL
let g:syntastic_javascript_checkers = ['jshint']
```

You now can use the plugin. Open a JavaScript file, type some code
and save it. If JSHint finds something to remark the lines will be
marked with `>>`. Execute `:Errors` to to bring up a buffer with a
list of JSHint's remarks. They can be used to jump to the line if
you switch to the buffer and press return on one of the lines
(honestly, it is often easier to do something like `78G` instead
of manually selecting the entry for line 78).

[![](img/vimjshint.png)](img/vimjshint.png)
