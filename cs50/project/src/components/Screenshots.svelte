<script lang="ts">
  import { run } from 'svelte/legacy';

  import { onMount } from 'svelte';
  import { captureScreenshot } from '../utils/captureScreenshot';
  import { Icon, CheckCircle, ArrowUpRight, ArrowTopRightOnSquare } from 'svelte-hero-icons';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Switch } from '$lib/components/ui/switch/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
  import { slide } from 'svelte/transition';
  import { quadInOut } from 'svelte/easing';
  import { toast } from 'svelte-sonner';
  import type { User } from 'src/types/User';
  import debounce from 'lodash/debounce';

  import { apiUrl } from '../utils/configuration';
  import storeUserDetails from '../utils/storeUserDetails';

  let desktopScreenshot: string | null = $state(null);
  let mobileScreenshot: string | null = $state(null);
  let reportId: string | null = $state(null);
  let defaultButtonText = 'Generate Screenshots';

  let isUploading = $state(false);
  let isComplete = $state(false);

  interface Props {
    user: User | null;
  }

  let { user = $bindable() }: Props = $props();

  let showImages = $derived(desktopScreenshot && mobileScreenshot);
  let currentStep = $derived(showImages || isComplete ? 1 : 0);

  const debouncedUpdateNotificationSettings = debounce(updateNotificationSettings, 300);

  run(() => {
    //this is a reactive statement, it runs anytime a variable in the body changes, in this case we're tracking 'notifyWhenComplete'
    if (isComplete && user) {
      let notify = user?.preferences.notifyOnCompletion; //this runs anytime notifyWhenComplete changes since I referenced the variable
      debouncedUpdateNotificationSettings(notify);
    }
  });

  async function updateNotificationSettings(notifyOnCompletion: boolean) {
    const response = await fetch(`${apiUrl}/api/user/update-preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notifyOnCompletion,
      }),
    });
    if (user) {
      storeUserDetails(user);
    }
    const body = response.json();
  }

  async function getCachedScreenshots(url: string) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'getCachedScreenshots', url }, (response) => {
        resolve(response);
      });
    });
  }

  async function cacheScreenshots(url: string, desktopScreenshot: string, mobileScreenshot: string) {
    chrome.runtime.sendMessage({
      action: 'cacheScreenshots',
      url,
      desktopScreenshot,
      mobileScreenshot,
    });
  }

  async function clearOtherCachedScreenshots(url: string = '') {
    chrome.runtime.sendMessage({ action: 'clearOtherCachedScreenshots', url });
  }

  const onGenerateAssets = async (e: Event) => {
    if (user?.reportsLeft ?? 0 > 0) {
      const button = e.target as HTMLButtonElement;
      button.disabled = true;
      button.innerHTML = 'Generating Screenshots...';
      chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
        try {
          if (!tab.id || !tab.url) {
            button.disabled = false;
            button.innerHTML = defaultButtonText;
            toast.error('Failed to capture screenshots. Please try again.');
            return;
          }

          // Capture desktop screenshot
          const desktopScreenshotResult = await captureScreenshot(tab.id, false);
          // Capture mobile screenshot
          const mobileScreenshotResult = await captureScreenshot(tab.id, true);

          //update our variables in the body
          desktopScreenshot = desktopScreenshotResult;
          mobileScreenshot = mobileScreenshotResult;

          // Cache the screenshots
          await cacheScreenshots(tab.url, desktopScreenshot, mobileScreenshot);

          // Clear screenshots for other sites
          await clearOtherCachedScreenshots(tab.url);
        } catch (error) {
          const button = document.getElementById('generateReportBtn') as HTMLButtonElement;
          button.disabled = false;
          button.innerHTML = defaultButtonText;
          toast.error('Failed to capture screenshots. Please try again.');
          console.log('Error generating report:', error);
        }
      });
    } else {
      toast.error('You have no credits left. Please purchase more credits to create reports.');
      return;
    }
  };

  // Function to create a new Firebase document
  async function createFirebaseDocument(): Promise<string> {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id || !tab.url) {
      console.error('tab.id or tab.url is null');
      toast.error('Failed to create report. Please try again.');
      return '';
    }

    const response = await fetch(`${apiUrl}/api/report/new-from-extension`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: tab.url,
      }),
    });
    const { reportId } = await response.json();
    return reportId;
  }

  // Function to upload a screenshot
  async function uploadScreenshot(
    documentId: string,
    screenshotData: string,
    screenshotType: 'desktop' | 'mobile',
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${apiUrl}/api/report/upload-screenshot`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(new Error('Failed to upload screenshot'));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Failed to upload screenshot'));
      };

      const base64Data = screenshotData.split(',')[1];
      const payload = {
        documentId,
        screenshotData: base64Data,
        screenshotType,
        finish: screenshotType === 'mobile',
      };
      xhr.send(JSON.stringify(payload));
    });
  }

  // Event handler for submitting the report
  const onSubmitReport = async () => {
    if (!desktopScreenshot || !mobileScreenshot) {
      console.error('No screenshots to upload');
      return;
    }
    isUploading = true;
    try {
      // Create a new Firebase document
      toast.loading('Creating Report...');
      const documentId = await createFirebaseDocument();
      reportId = documentId;
      // Upload the screenshots
      const promise = Promise.all([
        uploadScreenshot(documentId, desktopScreenshot, 'desktop'),
        uploadScreenshot(documentId, mobileScreenshot, 'mobile'),
      ]);

      toast.promise(promise, {
        loading: 'Uploading Screenshots...',
        success: 'Screenshots uploaded successfully',
        error: 'Failed to upload screenshots. Please try again.',
      });

      await promise;
      //reset state
      console.log('resetting state');
      isUploading = false;
      isComplete = true;
      desktopScreenshot = null;
      mobileScreenshot = null;
      await clearOtherCachedScreenshots();
    } catch (error) {
      console.error('Error uploading screenshots:', error);
      isUploading = false;
      toast.dismiss();
      toast.error('Failed to upload screenshots. Please try again.');
    }
  };

  const onReset = async (e: Event) => {
    e.preventDefault();
    desktopScreenshot = null;
    mobileScreenshot = null;
    isComplete = false;
    isUploading = false;
    await clearOtherCachedScreenshots();
  };

  const onReportLink = async (e: Event) => {
    //open login page
    chrome.tabs.create({ url: `${apiUrl}/reports/${reportId}` });
    window.close();
  };

  onMount(async () => {
    // Check for cached screenshots
    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
      if (!tab.id || !tab.url) {
        return;
      }

      const cachedScreenshots = (await getCachedScreenshots(tab.url)) as {
        desktopScreenshot: string;
        mobileScreenshot: string;
      } | null;

      if (cachedScreenshots?.desktopScreenshot && cachedScreenshots?.mobileScreenshot) {
        //screenshots are cached, update our variables in the body
        desktopScreenshot = cachedScreenshots.desktopScreenshot;
        mobileScreenshot = cachedScreenshots.mobileScreenshot;
      }
    });
  });
</script>

<div id="contentContainer" class="min-h-[68px]">
  <div class="flex space-x-3 py-3 mt-3 animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500 ease-in-out mb-6">
    <div
      class={`flex flex-col h-[2.5px] w-full transition-colors duration-500 ${currentStep == 0 ? 'bg-primary-500 ' : 'text-gray-400 dark:text-gray-500 bg-gray-300 dark:bg-gray-800'} `}
    >
      <span class="text-xs px-1.5 py-2">1. Generate Screenshots</span>
    </div>
    <div
      class={`flex flex-col h-[2.5px] w-full transition-colors duration-500 ${currentStep == 1 ? 'bg-primary-500 ' : 'text-gray-400 dark:text-gray-500 bg-gray-300 dark:bg-gray-800'} `}
    >
      <span class="text-xs px-1.5 py-2">2. Review &amp; Submit</span>
    </div>
  </div>

  {#if !showImages && !isComplete}
    <div
      out:slide={{
        delay: 300,
        duration: 500,
        easing: quadInOut,
        axis: 'y',
      }}
      class="py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
    >
      <Button
        on:click={onGenerateAssets}
        id="generateReportBtn"
        class="bg-primary-500 flex hover:bg-primary-600 text-white text-xs disabled:bg-gray-200 dark:disabled:bg-gray-700 mx-auto"
      >
        {defaultButtonText}
      </Button>
    </div>
  {/if}

  {#if showImages && !isComplete}
    <div
      in:slide={{
        delay: 0,
        duration: 500,
        easing: quadInOut,
        axis: 'y',
      }}
      out:slide={{
        delay: 0,
        duration: 300,
        easing: quadInOut,
        axis: 'y',
      }}
      id="screenshotsContainer"
    >
      <Tabs.Root value="desktop" class="w-full min-h-[635px] mb-0 pt-2">
        <Tabs.List class="grid w-full grid-cols-2">
          <Tabs.Trigger value="desktop">Desktop</Tabs.Trigger>
          <Tabs.Trigger value="mobile">Mobile</Tabs.Trigger>
        </Tabs.List>
        <div class="text-xs text-muted-foreground p-3 pb-1">
          Please scroll through both screenshots below to verify the page was captured correctly.
        </div>
        <Tabs.Content value="desktop">
          <Card.Root>
            <ScrollArea class="aspect-[16/9] rounded-lg border">
              <img
                id="desktopScreenshot"
                alt="scrollable desktop screenshot"
                class="w-full"
                width="1920"
                height="1080"
                src={desktopScreenshot}
              />
            </ScrollArea>
          </Card.Root>
        </Tabs.Content>
        <Tabs.Content value="mobile">
          <Card.Root class="max-w-[250px] mx-auto">
            <ScrollArea class="aspect-[9/16] rounded-lg border ">
              <img
                id="mobileScreenshot"
                alt="scrollable mobile screenshot"
                class="w-full"
                width="375"
                src={mobileScreenshot}
              />
            </ScrollArea>
          </Card.Root>
        </Tabs.Content>
      </Tabs.Root>

      <div class="flex justify-between py-4 border-t fixed bottom-0 left-0 right-0 bg-muted shadow-md z-10 px-4">
        <Button
          disabled={isUploading}
          variant={'outline'}
          size="sm"
          on:click={onReset}
          class="text-xs disabled:bg-gray-200 dark:disabled:bg-gray-700">Start Over</Button
        >
        <Button
          disabled={isUploading}
          on:click={onSubmitReport}
          size="sm"
          class="bg-primary-500 flex hover:bg-primary-600 text-white text-xs disabled:bg-gray-200 dark:disabled:bg-gray-700"
        >
          Looks Good. Create Report
        </Button>
      </div>
    </div>
  {/if}

  {#if isComplete && user}
    <div
      in:slide={{
        delay: 0,
        duration: 500,
        easing: quadInOut,
        axis: 'y',
      }}
      out:slide={{
        delay: 0,
        duration: 300,
        easing: quadInOut,
        axis: 'y',
      }}
    >
      <div class="flex flex-col items-center justify-center h-full pt-6">
        <div class="flex items-center justify-items-center space-x-2">
          <Icon class="text-green-500 w-5 h-5" src={CheckCircle} />
          <h2 class="text-lg font-semibold m-0">Screenshots Uploaded</h2>
        </div>
        <p class="text-xs text-muted-foreground">
          <a
            onclick={onReportLink}
            class="flex space-x-1 items-center justify-items-center p-4 hover:text-primary-500 transition-colors duration-300 ease-in-out"
            href={`${apiUrl}/reports/${reportId}`}
          >
            <span>View report in progress.</span>
            <Icon src={ArrowTopRightOnSquare} class="w-3 h-3 " />
          </a>
        </p>
        <div class="flex items-center space-x-2 border w-full rounded-md p-4 mt-6 justify-between">
          <Label for="notify" class="flex flex-col space-y-1">
            <span>Notifications</span>
            <span class="text-muted-foreground text-xs"> Notify via email when this report is complete </span>
          </Label>
          <Switch id="notify" bind:checked={user.preferences.notifyOnCompletion} />
        </div>
      </div>
    </div>
  {/if}
</div>
