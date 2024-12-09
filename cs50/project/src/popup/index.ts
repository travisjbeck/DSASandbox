import "../app.css";
import AppShell from "../components/AppShell.svelte";
import { mount } from "svelte";

function initDarkMode() {
  // Detect system preference for dark mode
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const html = document.documentElement;

  function updateDarkMode(event: MediaQueryListEvent) {
    if (event.matches) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  // Initial check
  updateDarkMode(darkModeMediaQuery as unknown as MediaQueryListEvent);

  // Listen for changes in system preference
  darkModeMediaQuery.addEventListener('change', updateDarkMode);
}

initDarkMode();


const target = document.getElementById('app') as HTMLElement;

async function render() {
  mount(AppShell, {target});
}

document.addEventListener('DOMContentLoaded', render);