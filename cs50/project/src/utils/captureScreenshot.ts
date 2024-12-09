interface PageCaptureScreenshotResponse {
    data: string; // Base64-encoded screenshot data
    // Add other fields if necessary
}

export async function captureScreenshot(tabId: number, isMobile: boolean): Promise<string> {
    const screenshotOptions = { format: 'webp' };
    const tab = await chrome.tabs.get(tabId);
    const width = isMobile ? 375 : 1024;
    const mobile = isMobile;

    await chrome.debugger.attach({ tabId }, '1.3');
    try {
        // Set device metrics
        await chrome.debugger.sendCommand({ tabId }, 'Emulation.setDeviceMetricsOverride', {
            width,
            height: 0, // 0 for full content height
            deviceScaleFactor: 1,
            mobile,
        });

        // Optionally set user agent and touch emulation for mobile
        if (mobile) {
            await chrome.debugger.sendCommand({ tabId }, 'Emulation.setUserAgentOverride', {
                userAgent:
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1', // Example UA string
            });
            await chrome.debugger.sendCommand({ tabId }, 'Emulation.setTouchEmulationEnabled', {
                enabled: true,
            });
        }

        // Smoothly scroll to the bottom and back to top
        const smoothScrollAndWait = `
            new Promise((resolve) => {
                const delay = 100; // milliseconds
                const totalHeight = document.body.scrollHeight;
                const distance = totalHeight / 3;
                let steps = 0;

                function scrollStep() {
                window.scrollBy(0, distance);
                steps++;

                if (steps < 3) {
                    setTimeout(scrollStep, delay);
                } else {
                    // Scroll back to top with smooth behavior
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // Wait for the scroll to complete
                    setTimeout(() => {
                    resolve(true);
                    }, 1000);
                }
                }

                scrollStep();
            });

            `;

        await chrome.debugger.sendCommand({ tabId }, 'Runtime.evaluate', {
            expression: smoothScrollAndWait,
            awaitPromise: true,
        });

        // Enhanced wait for page stability with increased timeout
        const waitForPageStable = `
            new Promise((resolve) => {
                let idleCallback;
                let timeout;
                let isResolved = false;  // Track if we've resolved

                const cleanup = () => {
                    if (idleCallback) cancelIdleCallback(idleCallback);
                    if (timeout) clearTimeout(timeout);
                };

                const checkPageStable = () => {
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
                        checkPageStable();
                        idleCallback = requestIdleCallback(onIdle, { timeout: 500 });
                    }
                };

                // Start the idle checking
                idleCallback = requestIdleCallback(onIdle, { timeout: 500});

                // Set a maximum timeout
                timeout = setTimeout(() => {
                    if (!isResolved) {  // Only resolve if we haven't already
                        isResolved = true;
                        cleanup();
                        resolve(true);
                    }
                }, 3000);
            });
        `;
        await chrome.debugger.sendCommand({ tabId }, 'Runtime.evaluate', {
            expression: waitForPageStable,
            awaitPromise: true,
        });

        // Capture screenshot
        const response = (await chrome.debugger.sendCommand(
            { tabId },
            'Page.captureScreenshot',
            {
                format: screenshotOptions.format,
                captureBeyondViewport: true,
            }
        )) as PageCaptureScreenshotResponse;

        const { data } = response;

        if (!data) {
            throw new Error('No data returned from captureScreenshot');
        }

        return `data:image/${screenshotOptions.format};base64,${data}`;
    } catch (error) {
        console.error('An error occurred during screenshot capture:', error);
        throw error;
    } finally {
        try {
            // Clear emulation settings
            await chrome.debugger.sendCommand({ tabId }, 'Emulation.clearDeviceMetricsOverride');
            if (mobile) {
                await chrome.debugger.sendCommand({ tabId }, 'Emulation.setTouchEmulationEnabled', {
                    enabled: false,
                });
            }
        } catch (cleanupError) {
            console.error('Error during cleanup:', cleanupError);
        }
        // Detach debugger
        try {
            await chrome.debugger.detach({ tabId });
        } catch (detachError) {
            console.error('Error detaching debugger:', detachError);
        }
    }
}
