<script>
  import { scale } from "svelte/transition";

  import Modal from "./Modal.svelte";
  import NL from "@lib/svg/Newsletter.svelte";

  let { language = "et" } = $props();

  const newsletterButtonLabel = language === "en" ? "Newsletter" : "Uudiskiri";
  const submitButtonLabel = language === "en" ? "Sign up" : "Liitu";
  const placeholderText = language === "en" ? "Your e-mail" : "Sinu e-mail";
  const successMessage =
    language === "en" ? "You have successfully subscribed to our newsletter!" : "Täname, oled liitunud meie uudiskirjaga!";
  const errorMessage = language === "en" ? "Subscription failed, try again!" : "Liitumine ebaõnnestus, proovi uuesti!";
  const titleText =
    language === "en"
      ? "To receive festival news and offers related to the Pühajärve Midsummer Fire, sign up for our newsletter."
      : "Pühajärve jaanitulega seotud festivaliuudiste ja pakkumiste saamiseks liitu meie uudiskirjaga.";
  const privacyText =
    language === "en"
      ? "We keep your email address secure and use it only to send you the newsletter."
      : "Hoiame Sinu e-maili aadressi kaitstuna ning kasutame seda ainult uudiskirja edastamiseks.";

  let showModal = $state(false);
  let form = $state();
  let isSubmitting = $state(false);
  let submitSuccess = $state(false);
  let message = $state("");

  $effect(() => {
    if (showModal === false) {
      if (form) form.reset();
      isSubmitting = false;
      submitSuccess = false;
      message = "";
    }
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

    try {
      const result = await subscribeToNewsletter(email);
      message = successMessage;
      // console.log("Subscription response:", result.data);
      submitSuccess = true;
    } catch (error) {
      // message = `Error: ${error.message}`;
      message = errorMessage;
      // console.error("Subscription error:", error);
    }

    isSubmitting = false;
  }

  async function subscribeToNewsletter(email) {
    try {
      const response = await fetch("/newsletter.php", {
        method: "POST",
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        throw new Error(data.message || "Subscription failed");
      }
    } catch (error) {
      throw error;
    }
  }
</script>

<button onclick={() => (showModal = true)} class="fade-in">
  <div
    class="flex justify-center items-center text-pj-blue min-h-8 min-w-8 w-full px-2 py-2 xl:px-3 xl:py-1 rounded-full bg-pj-mint hover:bg-pj-cyan group">
    <NL class="w-5 fill-pj-blue group-hover:fill-pj-violet" />
    <span class="ml-1 font-sans text-sm font-medium uppercase hidden xl:block group-hover:text-pj-violet">{newsletterButtonLabel}</span>
  </div>
</button>

<Modal bind:showModal>
  <div class="bg-pj-mint px-10 py-6">
    {#if submitSuccess}
      <div in:scale={{ start: 0.5, duration: 500 }} class="my-8">
        <h2 class="text-center text-2xl font-semibold text-pj-blue sm:text-3xl">{successMessage}</h2>
      </div>
    {:else}
      <div>
        <h2 class="text-balance text-3xl font-semibold tracking-tight text-pj-blue sm:text-4xl">{titleText}</h2>
        <form bind:this={form} id="newsletter-form" class="mt-6" onsubmit={onSubmit}>
          <div class="flex flex-col xs:flex-row gap-4">
            <!-- Real field -->
            <label for="liame" class="sr-only">Email</label>
            <input
              name="liame"
              id="liame"
              autocomplete="email"
              type="email"
              required
              class="min-w-0 x-3.5 py-2 text-lg sm:text-sm/6 flex-auto rounded-md border-none bg-white p text-gray-900 placeholder:text-gray-400
              outline-pj-blue focus:outline-2 focus:-outline-offset-2 focus:outline-pj-blue-light"
              placeholder={placeholderText} />

            <!-- H o n e y p o t -->
            <div class="absolute top-0 left-0 w-0 h-0 opacity-0 -z-1">
              <input autocomplete="off" type="email" id="email" name="email" placeholder="e-mail" tabindex="-1" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              class="block flex justify-center items-center min-h-12 min-w-32 uppercase flex-none rounded-lg bg-pj-blue px-3.5 py-2.5 text-lg text-white outline-none
              hover:bg-pj-blue-light focus-visible:bg-pj-violet
              ">
              {#if isSubmitting}
                <span class="spinner"></span>
              {:else}
                {submitButtonLabel}
              {/if}
            </button>
          </div>
          <p class="mt-6 text-sm/6 text-pj-blue">
            {privacyText}
          </p>

          <div class="mt-2 font-sans text-base text-red-500 font-medium">{message}</div>
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

  /* FADE IN ON LOAD */
  .fade-in {
    opacity: 0;
    animation: fade-in 0.5s 0.25s ease-out forwards;
  }
</style>
