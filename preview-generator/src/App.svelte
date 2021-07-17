<script lang="ts">
    // import domToImage from 'dom-to-image';
    import Prism from 'prismjs';
    import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
    // import 'prismjs/plugins/line-numbers/prism-line-numbers.js';

    let input: HTMLElement, output: HTMLElement;

    function removePrismClasses(element: HTMLElement) {
        for (const className of element.classList.values()) {
            if (!className.startsWith('svelte-')) {
                element.classList.remove(className);
            }
        }
    }

    function highlight(
        inputText: string,
        outputText: string,
        language?: string,
        lineNumbers?: string
    ) {
        input.textContent = inputText;
        output.textContent = outputText;

        removePrismClasses(input);
        removePrismClasses(output);
        removePrismClasses(input.parentElement);
        removePrismClasses(output.parentElement);

        if (language) {
            input.classList.add(`language-${language}`);
            output.classList.add(`language-${language}`);
        }

        if (lineNumbers) {
            input.parentElement.setAttribute('data-line', lineNumbers);
        } else {
            input.parentElement.setAttribute('data-line', '');
        }

        Prism.highlightElement(input);
        Prism.highlightElement(output);
    }

    // @ts-ignore
    window.highlight = highlight;

    // just testing out highlighting
    setTimeout(() =>
        highlight(
            'log(2);\nconst x = 2;\nconst n = 2;\nconst x = 2;',
            'const x = 3423;',
            'javascript',
            '2-4'
        )
    );
    // async function saveImage() {
    //     const scale = 2.5;

    //     const dataUrl = await domToImage.toPng(container, {
    //         style: {
    //             transform: `scale(${scale})`,
    //             transformOrigin: 'top left',
    //             width: container.offsetWidth + 'px',
    //             height: container.offsetHeight + 'px',
    //         },
    //         height: container.offsetHeight * scale,
    //         width: container.offsetWidth * scale,
    //         quality: 1,
    //     });

    //     const a = document.createElement('a');
    //     a.download = `${Date.now()}.png`;
    //     a.href = dataUrl;
    //     a.click();
    //     a.remove();
    // }

    // document.body.addEventListener('keydown', (e) => {
    //     if (e.key === 'k' && e.ctrlKey) {
    //         e.preventDefault();
    // saveImage();
    //     }
    // });
</script>

<section id="container">
    <div>
        <h1>input</h1>
        <pre
            spellcheck="false">
            <code bind:this={input} id="input" contenteditable="true">
console.log(2);
const x = 2;
x.toString();
            </code>
        </pre>
        <!-- <textarea id="input" spellcheck="false" /> -->
    </div>
    <div>
        <h1>output</h1>
        <pre
            spellcheck="false">
            <code bind:this={output} id="output" contenteditable="true">PLACEHOLDER</code> 
        </pre>
        <!-- <textarea id="output" spellcheck="false" /> -->
    </div>
</section>

<!-- <div class="junk">
    <label for="language-name">Language Name: </label>
    <input type="text" id="language-name" bind:value={language} />
    <button on:click={highlight} id="highlight-btn">HIGHLIGHT</button>
</div> -->
<style>
    /* .junk {
        margin-top: 10px;
    } */

    section {
        --border-radius: 7px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        /* justify-content: stretch; */
        /* align-content: stretch; */
        gap: 10px;
        /* height: 100%; */
    }

    section div {
        display: grid;
        grid-template-rows: auto 1fr;
        /* flex-grow: 1; */
        height: 100%;
    }

    pre {
        background-color: var(--main-background) !important;
        color: white;
        resize: none;
        border: none;
        outline: none;
        padding: 20px;
        font-size: 24px !important;
        border-radius: 0 0 var(--border-radius) var(--border-radius);
        height: 100%;
    }

    code {
        height: 100%;
    }

    h1 {
        background-color: var(--sidebar);
        border-bottom: 2px solid var(--sidebar-border);
        color: white;
        text-transform: uppercase;
        padding: 5px 10px;
        font-size: 18px;
        border-radius: var(--border-radius) var(--border-radius) 0 0;
    }
</style>
