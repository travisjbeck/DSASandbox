import pako from "pako";

export async function compressScreenshot(screenshot: string): Promise<ArrayBuffer> {
  const base64Data = screenshot.split(',')[1];
  const binaryData = atob(base64Data);
  const uint8Array = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }
  const compressedData = pako.deflate(uint8Array);
  return compressedData.buffer;
}