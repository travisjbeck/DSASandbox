<script lang="ts">
  import { apiUrl } from '../utils/configuration';
  const onLogin = async () => {
    //open login page
    chrome.tabs.create({ url: `${apiUrl}/auth/sign-in` });
    window.close();
  };
</script>

<div id="loginContainer">
  <div class="py-6">
    <button
      onclick={onLogin}
      id="loginBtn"
      class="bg-primary-600 flex hover:bg-primary-700 text-white text-xs font-semibold px-6 py-2 rounded-md disabled:bg-gray-200 dark:disabled:bg-gray-700 mx-auto"
    >
      Please Log In To Continue
    </button>
  </div>
</div>

