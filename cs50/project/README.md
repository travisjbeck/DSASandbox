# Optimizing Developer Workflow and Chrome Extension Architecture

#### Video Demo: <https://youtu.be/9N6Ke6Gzk78>

## Introduction

Hi, I'm Travis. I've been a developer for over 20 years and CS50 is part of current journey of demystifying all that I had previously deemed "magical" in computer science.

I've had a lot of "aha" moments while going through the CS50 course work. One of which was the understanding that underneath all the pointing and clicking and dragging I'm doing on my computer, there is a simple CLI command being ran that is actually doing the work. And if I knew those CLI commands I could just cut out the middle man and directly perform the operation. A simple example is `$: mkdir`   That's way easier than moving your hand from the keyboard to the mouse, right clicking, then left clicking, then moving your hand back to your keyboard and typing in a name and then hitting enter. This revelation ended up leading me down quite the rabbit hole of not only being more efficient at coding, but more efficient at controlling my entire computer all while using the mouse as little as possible.

Thus, my final project is a combination of creating a better developer experience for myself that will continue to pay off forever as well as migrating my react chrome extension to Svelte while fixing a finicky bug.

## Optimizing My Developer Workflow

### Vim Mode FTW

Step one was learning vim motions and vim bindings which allows you to edit text with precision without ever having to touch the mouse. I installed VIM for VSCode and forced myself to suffer through the slowdowns initially as i worked through the different cs50 problem sets. Within a couple days I became quite comfortable using vim in VSCode and was continually adding new operators and motions to my repertoire. It felt like each text edit was now more exciting and writing and editing code became immediately more enjoyable. One of the most helpful hacks I made during this period was remapping the <kbd>CAPS</kbd> key on my keyboard to be <kbd>ESC</kbd> when tapped, and <kbd>CTRL</kbd> when held. This was an absolute game changer, especially for vim motions.

### Window Management

The next step in my developer workflow optimization process was to find a better way to navigate around the different windows and apps running on my computer. I often have my editor, a browser window for testing, a browser window for docs, YouTube background music, the Claude desktop app, a finder window, etc. Its very clunky trying to <kbd>CMD</kbd> <kbd>TAB</kbd>  through a list of windows until you finally reach the one you want. I wanted to be able to go directly to any type of windows or app instantly instead of scrolling through a list. Mac OS Spaces and mission control and all that stuff just wasn't cutting it. Apple priorities the "experience" of switching windows instead of the speed of switching windows. I finally settled on a program called aerospace that allows you to setup virtual workspaces assign apps to those workspaces and navigate it all with global keyboard shortcuts. Turns out the baked in shortcuts followed the same patterns I had learned from VIM which is a pattern I'd notice throughout. Vim is just how you get anything serious done with text. This was starting to feel pretty good once I got the hang of it, but left me wanting more from my keyboard and keyboard shortcuts.

### Terminal Upgrades

Once i was using the terminal more, I started to investigate customizing the terminal, adding syntax highlighting, customizing the prompt display and so fort. I quickly realized that the terminal.app was completely inadequate for these more complex tasks and when about exploring the vast world of terminal emulators. There's kitty, alacrity, wezterm, iterm, ghostty, and more. I tried a lot, configured a lot, and settled on wezterm for now. I discovered "oh my zsh" and the amazing community therein and came up with a great terminal experience that I will continue to iterate on.

The next step was to really understand the terminal beyond `npm` commands. I took the time to learn the basic git commands for pulling, pushing and committing, and forced myself to stop using a git gui unless i absolutely had to and then figuring out how to do that with the CLI. This is an ongoing process that I'm really enjoying.

Well by now I've configured a lot of utilities and the all those new config files are just sort of scattered about my home directory and that would not do, I needed to have these organized and in git, but that presented it's own set of problems until i found "GNU Stow" which allowed me to organize my dotfiles nice how I want them and symlink them to where the programs can pick them up giving me a nice little repo for all my customizations.

## VSCode to Vim

By now I've gained a completely new found love of the terminal and I knew what was next. I had to make the move to Vim or more precisely NeoVim.  I was initially very intimidated by this process as I felt like I "needed" all the hand holding that VSCode offered, but over the past weeks I had been able to remove so many of those "training wheels" that the transition was not that bad. Its still a work in progress, but I made it a point that by the time I started work on the final project I was going to complete it entirely in NeoVim. Which I did.  

I used LazyVim as my starting point and I've been very happy with it. Its very user friendly, has almost everything you need out of the box and great documentation to help you learn the bazillion new keymaps you are about to shove into your brain.

### Keyboards & Keyboard layout

I've known for a while that the QWERTY keyboard layout is not the best for typing and that there are much better alternatives, but I had been extremely hesitant of trying to learn a new one. No longer. After going down quite the rabbit hole of keyboard layouts, I've decided I'm switching to Colemak GH on a new split multi-layered ortho-linear keyboard with multiple thumb buttons (The ZSA Voyager). I have been frustrated forever with my inaccuracy especially around the edges of the keyboard, important programming keys like <kbd>\\</kbd> <kbd>]</kbd> <kbd>}</kbd> <kbd>=</kbd> are my current nemesis. I've learned that's because my pinkies are doing too much of the heavy lifting with QWERTY.

w I have not started the transition to Colemak just yet, as I'm doing it all at once. New, keyboard, blank key caps, new keyboard layout. It will be a lot like learning to type all over again except colemak is more forgiving for switching form QWERTY because the keys stay on the same hands and <kbd>z</kbd> <kbd>x</kbd> <kbd>c</kbd> & <kbd>v</kbd> are in the same place so you can keep your undo, cut copy paste muscle memory. What is most appealing to me about colemak is the natural "rolling" that happens on certain words or phrases such as `tion`

I will also be integrating different layers for numbers and symbols as well as <kbd>HYPER</kbd> (Cmd+Shift+Alt+Ctrl) and <kbd>MEH</kbd> (Shift+Alt+Ctrl) keys which allow for easy system wide two button short cuts, and i will be trying out home row mods which put <kbd>SHIFT</kbd> <kbd>CTRL</kbd> <kbd>ALT</kbd> and <kbd>CMD</kbd> on the home row when you long press on certain buttons.

I just ordered the keyboard and will begin this process in a few days. My plan is to practice daily on the new keyboard for at least an hour for 2-4 weeks until I feel comfortable enough to switch to it full-time. Here's hoping that I don't forget "QWERTY" at the same time I'm learning colemak

## Migrating and Enhancing my Chrome Extension

On to the programming project at hand. I had previously launched an AI powered conversion rate optimization platform [convert rocket](https://convertrocket.ai). This service uses AI vision models to analyze your landing page and give back actionable conversion rate optimization insights. Using puppeteer on the server I'm able to grab a screenshot of your landing page to use with the AI. The problem is that some sites have pop-ups or modals that obscure the homepage and makes it impossible for the AI to really "see" the full site. That's why I created a chrome extension. So that users can go directly to the site, manually close the modal, create the screenshots directly in the browser and send those to my server to be processed. I originally created this using React and noticed that it performed badly on some sites. So I needed to fix that issue, but I also wanted to convert it to Svelte, because I've wanted to try it out and this was a fairly small project to do it with.

### Svelte 5 Migration

Svelte 5 had just came out so that's what I started with.  Reading the documentation, its is more like react than it's different, and had some nice touches that I could appreciate like runes, but implementation was very "quirky" to say the least. It seems some of the tooling like eslint and tsc were not playing well with Svelte 5 and some of the other packages my project required. I was able to find solutions to everything with a bit of googling, but there just isn't a ton of information outside the documentation just yet and unfortunately Svelte 5 is too new for any of the AI tools to be of any assistance.  

I used Tailwind for styling and shadcn components. Both Svelte and React have their own versions of shadcn components so I was able to use all the same base components I just had to change them to their Svelte counterparts. Svelte uses jinja like syntax for control and flow statements so this was very familiar.  One feature I really loved is the baked `in` and `out` transitions for components, you'll notice these nice transitions in the chrome extension when new sections come in and of the screen.

Once I had completed the React to Svelte migration and had it running again, I needed to find a solution to the bug that a user had found earlier. The purpose of the extension is to take a clean full page screenshot of the site in both desktop size and mobile size. The way I initially did it was to resize the screen, take the screenshot, resize it again, take the screenshot and move on. This worked fine on the small number of sites I tested it on. However there was a major issue. On sites with lazy loaded images or CSS transitions, the screenshot would be blank from the top of the fold down because none of the text was visible and none of the images had loaded. So how to solve this?  

#### Attempt 1 (Just wait a bit)

So I thought the simplest solution is to just have the window scroll to the bottom, wait a 'bit' and then take the screenshot. I knew this was a naive approach, but needed somewhere to start. This had the effect of loading the top of the page and the bottom of the page, but none in the middle since the scroll was happening programmatically and instantly jumped to the end of the page leaving the rest "unscrolled".

#### Attempt 2 (Scroll Slower & then wait a bit)

Well, lets just smooth the scrolling so that the full page get the "scroll" and "intersection" callbacks throughout the whole page, therefore triggering every CSS transition and lazy image load along the way. THEN we wait "a bit". This actually seemed to work, the whole page how now loaded. But, still this is a bit of a naive approach, because we're waiting an arbitrary amount of time that will never be correct. Sometimes it will be too long and the user has to wait, other times the sites too slow and we didn't wait long enough and the user has an unusable tool. So no, this will not do.

#### Lets get smart about this

Instead of guessing when the images are loaded and visible I can inject a little JS into the page and programmatically know when they are done loading. Here is what I came up with:

```js
new Promise((resolve) => {
    let idleCallback;
    let timeout;
    let isResolved = false; 

    const cleanup = () => {
        if (idleCallback) cancelIdleCallback(idleCallback);
        if (timeout) clearTimeout(timeout);
    };

    const checkImagesLoaded = () => {
        const imagesLoaded = Array.from(document.images).every(img => img.complete);
        if (imagesLoaded && !isResolved) {
            console.log("all images loaded");
            isResolved = true;
            cleanup();
            resolve(true);
        }
    };

    const onIdle = () => {
        if (!isResolved) {  // Only continue if we haven't resolved
            checkImagesLoaded();
            idleCallback = requestIdleCallback(onIdle, { timeout: 1000 });
        }
    };

    // Start the idle checking
    idleCallback = requestIdleCallback(onIdle, { timeout: 1000 });

    // Set a maximum timeout
    timeout = setTimeout(() => {
        if (!isResolved) { 
            isResolved = true;
            cleanup();
            resolve(true);
        }
    }, 3000);
});
//TODO: look into mutationObserver if more edge cases emerge
//TODO look into CSS observation to check for opacity animations
```

Here im checking every half second for 3 seconds to see if all of the images have loaded yet. Im using `requestIdleCallback` so that I don't interrupt anything on the main browser thread that is possibly doing the rendering I'm looking to check. This has solved the problem for all the sites that I've checked that previously had the problem and I can see in the console that the function is indeed calling back once all images have loaded. I looked into taking this a step further using a mutationObserver to detect if new nodes with images were being inserted into the DOM during the scroll, but this seems like premature optimization, but I noted it for future upgrades if more edge cases emerge.  

#### Conclusions

I've never been more excited about my programming journey than I am today. I've unlocked a new level of learning and I'm excited for the new challenges that each day will bring. I have a lot on my plate to get used to; an entirely new keyboard and keyboard layout, vim bindings, no more VSCode training wheels, and an entirely new paradigm for controlling and navigating my computer. Its very refreshing and it feels like something I should have done years ago.  

Its also very evident that I will never have an encyclopedic knowledge of all things JavaScript or python or any other language or framework for that matter. I used to have the notion that the best programmers in the world never have to look anything up and I now know this is just not true. I've been writing in JS for decades, but I will likely never not have to look up the ever changing DOM API for the newest most 'bestest' way to accomplish something. Thank you so much for a brilliant course and all the hard work that went into it. I'm sad to say for the last time that "This was CS50".
