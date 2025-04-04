// ==UserScript==
// @name         LaTeX Renderer
// @namespace    http://tampermonkey.net/
// @author       Ananth
// @version      0.1
// @description  generate LaTeX forumlas on the page using MathJax library
// @match        https://claude.ai/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let currentURL = location.pathname, hasInit = false

    const observer = new MutationObserver((mutations, obs) => {
        
        const targetElement = document.querySelector('fieldset > :nth-child(3) > div > div:nth-of-type(2) > div:nth-of-type(1)')
        if (targetElement) {
            if (hasInit)
                return

            console.log("Hooking LaTeX renderer");
            hasInit = true
            // obs.disconnect()
            init()
            return
        }

        if (currentURL != location.pathname) {
            currentURL = location.pathname
            hasInit = false
        }

    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    function init() {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        script.async = true

    
        document.head.appendChild(script)
    
        window.MathJax = {
            startup: {
                typeset: false
            },
            tex: {
                inlineMath: [["$", "$"], ["\\(", "\\)"]], // Allow both $...$ and \( ... \)
                displayMath: [["\\[", "\\]"], ["$$", "$$"]], // Block mode
                processEscapes: true, // Allow backslash escapes
                processEnvironments: true,
            }
        };
    
        // insert a button and make use of claude's existing frontend design
        // might break in the future if they change the layout, the container doesn't have any ID to pinpoint it
        const btnId = "LaTeX-btn"
        const btnStyle = `<div data-state="closed"><div class="flex items-center"><button id="${btnId}" class="text-text-300 h-8 min-w-8 px-[7.5px] rounded-lg transition border-0.5 border-border-300 max-xs:w-full flex flex-row items-center justify-center gap-1 hover:text-text-200/90 hover:bg-bg-100 active:scale-[0.97]" aria-expanded="false" aria-haspopup="listbox" aria-controls="input-menu" data-testid="input-menu-tools">Generate LaTeX</button></div></div><div class="w-[20rem] absolute max-w-[calc(100vw-16px)] bottom-10 hidden"></div></div>`
        const btnDiv = document.createElement('div')
        btnDiv.className = 'relative shrink-0'
        btnDiv.innerHTML = btnStyle
    
        const claudeFieldBox = document.querySelector('fieldset > :nth-child(3) > div > div:nth-of-type(2) > div:nth-of-type(1)')
        const referenceNode = claudeFieldBox.childNodes[2]
        claudeFieldBox.insertBefore(btnDiv, referenceNode)
    
        document.getElementById(btnId).addEventListener('click', () => {
            renderMathInMessages()
        })


        function renderMathInMessages() {


            let selection = window.getSelection();
            if (!selection.rangeCount || selection.toString().trim() === "") return; // No selection
        
            let range = selection.getRangeAt(0);
            let selectedFragment = range.cloneContents(); 
            let skipDeletion = selectedFragment.childNodes.length == 1

        
            let modifiedFragment = document.createDocumentFragment();
        
            for (let child of selectedFragment.childNodes) { 
                let p = child.cloneNode(true)

                if (child.nodeType === Node.ELEMENT_NODE && child.tagName === "P" && child) {
                    p.textContent = `$${child.textContent}$`; 
                    modifiedFragment.appendChild(p);
                    continue;
                } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== "") {
                    p.textContent = `$${child.textContent}$`
                    modifiedFragment.appendChild(p);
                    continue;
                }

                modifiedFragment.appendChild(p);
            };

        
            let startNode = range.startContainer
            let endNode = range.endContainer
            
            range.deleteContents();
            range.insertNode(modifiedFragment);

        
            selection.removeAllRanges();

            



            if (!skipDeletion) {
                if (startNode.textContent.trim() == "")
                    startNode.parentNode?.parentNode?.removeChild(startNode.parentNode)
                if (endNode.textContent.trim() == "")
                    endNode.parentNode?.parentNode?.removeChild(endNode.parentNode)
            }

            window.MathJax.typesetPromise().then(() => {
                console.log("MathJax Rendered!");
            }).catch(err => console.error("MathJax Error:", err));

        };
        
    };

    function isMathJaxProcessed(element) {
        return element?.querySelector('.mjx-container') !== null;
    }
    

    

})();