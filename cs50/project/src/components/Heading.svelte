<script lang="ts">
  import { type User } from '../types/User';
  import Logo from '$lib/components/logo.svelte';

  interface Props {
    user: User | null;
  }

  let { user }: Props = $props();
  let initials: string | undefined = $state();

  $effect(() => {
    if (user) {
      let displayName = user.displayName || user.email;
      initials = displayName.charAt(0).toUpperCase();
    }
  });

  const onUserClick = (e: Event) => {
    chrome.tabs.create({ url: 'https://convertrocket.ai/settings/profile' });
    window.close();
    e.preventDefault();
  };
</script>

<div class="pb-2 w-full">
  <div class="flex justify-between items-center">
    <div class="flex flex-col space-y-3">
      <div
        class="flex animate-in items-center space-x-2 fade-in slide-in-from-bottom-2 ease-in-out fill-mode-both duration-500"
      >
        <Logo class="w-5 h-5 text-primary " />
        <h1 class="text-base text-muted-foreground">Convert Rocket Report Helper</h1>
      </div>
    </div>
    <div class="flex items-center space-x-2 h-9 self-start">
      {#if user}
        <a
          href="https://convertrocket.ai/settings/profile"
          onclick={onUserClick}
          title={`Logged in as ${user.displayName || user.email}`}
          aria-label={`Logged in as ${user.displayName || user.email}`}
        >
          {#if user.photoUrl}
            <img
              src={user.photoData ? user.photoData : user.photoUrl}
              alt="User Profile"
              class="w-9 h-9 rounded-full animate-in fade-in slide-in-from-bottom-2 ease-in-out duration-500 fill-mode-both cursor-pointer bg-primary-500"
            />
          {:else}
            <div
              class={`w-9 h-9 rounded-full flex items-center justify-center bg-primary-500  animate-in fade-in slide-in-from-bottom-2 ease-in-out duration-500 fill-mode-both cursor-pointer`}
            >
              <span class="text-white text-sm font-medium">{initials}</span>
            </div>
          {/if}
        </a>
      {/if}
    </div>
  </div>
</div>
