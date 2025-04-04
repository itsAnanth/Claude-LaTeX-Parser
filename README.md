# Claude LaTeX Parser

A very simple script that i made to render claude's mathematical equations in a more comprehensible way using MathJax library

Since claude generates mathematical equations without the delimitters like $$, $ or /, its pretty hard to detect equations so for now i went with a brute force approach where you have to manually select the text that needs rendering

there's probably a better way to do this, but this simple approach worked for my use case (i suck at maths and needed help from claude)

## How to use

Install the tampermonkey extension from chrome web store [Install](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)

Click on new script

Copy paste the contents of script.js into the script and enjoy


## Demo

<video controls src="demo.mp4" title="Title"></video>


## Future Improvements

Currently its a wonky fix, could potentially automate the process in the future