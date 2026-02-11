<script>
  import { scale } from "svelte/transition";
  import { onMount } from "svelte";

  import Modal from "./Modal.svelte";

  let { language = "et" } = $props();

  const suggestLabel = language === "en" ? "Suggest artist" : "Soovita artisti";
  const emailLabel = language === "en" ? "Your email" : "Sinu email";
  const messageLabel = language === "en" ? "Your message" : "Sinu sõnum";
  const submitButtonLabel = language === "en" ? "Send" : "Saada";
  const successMessage = language === "en" ? "Suggestion sent!" : "Soovitus saadetud!";
  const errorMessage = language === "en" ? "Failed to send, try again!" : "Saatmine ebaõnnestus, proovi uuesti!";

  let showModal = $state(false);
  let form = $state();
  let isSubmitting = $state(false);
  let submitSuccess = $state(false);
  let message = $state("");
  let currentTime = $state("");

  $effect(() => {
    if (showModal === false) {
      if (form) form.reset();
      isSubmitting = false;
      submitSuccess = false;
      message = "";
    }
  });

  // Buttons are server-rendered by Astro, just attach click handlers
  onMount(() => {
    document.querySelectorAll('.suggest-artist-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTime = btn.dataset.time;
        showModal = true;
      });
    });
  });

  async function onSubmit(e) {
    e.preventDefault();

    message = "";

    const email = form.liame.value;
    if (email === "") return;

    // H o n e y p o t
    if (form.email.value !== "") {
      form.reset();
      return;
    }

    isSubmitting = true;

    const formData = new FormData();
    formData.set("email", email);
    formData.set("subject", "suggest-artist");
    formData.set("message", `[Ajavahemik / Time slot: ${currentTime}]\n\n${form.message.value}`);

    try {
      const res = await fetch("/contact-form.php", { method: "POST", body: formData });
      if (res.ok) {
        submitSuccess = true;
        message = successMessage;
      } else {
        message = errorMessage;
      }
    } catch {
      message = errorMessage;
    }

    isSubmitting = false;
  }
</script>

<!-- MODAL -->
<Modal bind:showModal>
  <div class="bg-pj-mint px-10 pb-6 pt-10">
    {#if submitSuccess}
      <div in:scale={{ start: 0.5, duration: 500 }} class="my-8">
        <h2 class="text-center text-2xl font-semibold text-pj-blue sm:text-3xl">{successMessage}</h2>
      </div>
    {:else}
      <div>
        <h2 class="text-balance text-3xl font-semibold tracking-tight text-pj-blue sm:text-4xl">
          {suggestLabel}
          {#if currentTime}
            <span class="text-pj-pink">({currentTime})</span>
          {/if}
        </h2>
        <form bind:this={form} class="mt-6" onsubmit={onSubmit}>
          <div>
            <label for="suggest-liame" class="block text-sm font-bold uppercase text-gray-500">{emailLabel}</label>
            <input
              name="liame"
              id="suggest-liame"
              autocomplete="email"
              type="email"
              required
              class="mt-1 min-w-0 w-full rounded-md border-none bg-white px-3.5 py-2 text-lg sm:text-sm/6 text-gray-900 placeholder:text-gray-400
              outline-pj-blue focus:outline-2 focus:-outline-offset-2 focus:outline-pj-blue-light" />
          </div>

          <!-- H o n e y p o t -->
          <div class="absolute top-0 left-0 w-0 h-0 opacity-0 -z-1">
            <input autocomplete="off" type="email" id="email" name="email" placeholder="e-mail" tabindex="-1" />
          </div>

          <div class="mt-4">
            <label for="suggest-message" class="block text-sm font-bold uppercase text-gray-500">{messageLabel}</label>
            <textarea
              name="message"
              id="suggest-message"
              required
              rows="3"
              class="mt-1 min-w-0 w-full rounded-md border-none bg-white px-3.5 py-2 text-lg sm:text-sm/6 text-gray-900 placeholder:text-gray-400
              outline-pj-blue focus:outline-2 focus:-outline-offset-2 focus:outline-pj-blue-light resize-none"></textarea>
          </div>

          <div class="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              class="block flex justify-center items-center min-h-12 min-w-32 uppercase flex-none rounded-lg bg-pj-blue px-3.5 py-2.5 text-lg text-white outline-none
              hover:bg-pj-blue-light focus-visible:bg-pj-violet">
              {#if isSubmitting}
                <span class="spinner"></span>
              {:else}
                {submitButtonLabel}
              {/if}
            </button>
          </div>

          {#if message && !submitSuccess}
            <div class="mt-2 font-sans text-base text-red-500 font-medium">{message}</div>
          {/if}
        </form>
      </div>
    {/if}
  </div>
</Modal>

<style>
  .spinner {
    width: 24px;
    height: 24px;
    border: 4px solid #fff;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
