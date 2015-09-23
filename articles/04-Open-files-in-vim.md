vim is an awesome editor especially for developers like me. I
use it every day for nearly everything I have to edit.
By default, it is not possible to open files from the Finder on
OS X in a terminal vim session.

However, given that [iTerm](https://iterm2.com) is installed, a simple
AppleScript can do the trick.

Open *Automator*, create a new application and add a *Run AppleScript* node.
Paste the following code:

```applescript
on run {input, parameters}
    if (count of input) > 0 then
        tell application "System Events"
            set runs to false
            try
                set p to application process "iTerm"
                set runs to true
            end try
        end tell
        tell application "iTerm"
            activate
            if (count of terminals) = 0 then
                set t to (make new terminal)
            else
                set t to current terminal
            end if
            tell t
                tell (make new session at the end of sessions)
                    exec command ("vim \"" & POSIX path of first item of input as text) & "\""
                end tell
                if not runs then
                    terminate first session
                end if
            end tell
        end tell
    end if
end run
```

Save the project as an Application and choose it when opening files.

![](img/automator.png)
