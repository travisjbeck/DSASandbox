// Store user details in storage
import { type User } from "../types/User";

export default function storeUserDetails(user: User) {
  chrome.runtime.sendMessage({ action: "storeUserDetails", user: user });
}