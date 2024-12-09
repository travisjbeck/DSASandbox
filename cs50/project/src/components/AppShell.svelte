<script lang="ts">
  import { onMount } from 'svelte';
  import Screenshots from './Screenshots.svelte';
  import Login from './Login.svelte';
  import Loading from './Loading.svelte';
  import Heading from './Heading.svelte';
  import { Toaster } from '$lib/components/ui/sonner';
  import storeUserDetails from '../utils/storeUserDetails';
  import { type User } from '../types/User';

  let isLoggedIn = $state(false);
  let isLoading = $state(true);

  let user: User | undefined = $state();

  // Check the user's login status
  function checkLoginStatus() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'checkLoginStatus' }, (response) => {
        resolve(response);
      });
    });
  }

  // Retrieve cached user details from storage
  function getCachedUser() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'getCachedUser' }, (response) => {
        resolve(response);
      });
    });
  }

  function destroyUserDetails() {
    chrome.runtime.sendMessage({ action: 'destroyUserDetails' });
  }

  onMount(async () => {
    // Retrieve cached user details from storage
    const cachedUser = await getCachedUser();

    if (cachedUser) {
      user = cachedUser as User;
      isLoggedIn = true;
      isLoading = false;
    }

    const response = (await checkLoginStatus()) as {
      isLoggedIn: boolean;
      user?: User;
    };

    if (response.isLoggedIn && response.user) {
      user = response.user;
      isLoggedIn = true;
      isLoading = false;
      // Update cached user details in storage
      storeUserDetails(user);
    } else {
      // User is not logged in, redirect to the login page
      isLoggedIn = false;
      isLoading = false;
      user = null;
      // Update cached user details in storage
      destroyUserDetails();
    }
  });
</script>

<div>
  <Heading {user} />

  {#if isLoading}
    <Loading />
  {/if}

  {#if user && isLoggedIn && !isLoading}
    <Screenshots {user} />
  {/if}

  {#if !isLoggedIn && !isLoading}
    <Login />
  {/if}
  <Toaster position="top-center" richColors />
</div>
