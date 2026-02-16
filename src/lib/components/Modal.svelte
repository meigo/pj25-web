<script>
  import XIcon from "@lib/svg/XIcon.svelte";

  let { showModal = $bindable(), children, class: className = "max-w-lg rounded-xl" } = $props();

  let dialog = $state(); // HTMLDialogElement

  $effect(() => {
    if (showModal) dialog.showModal();
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialog}
  onclose={() => (showModal = false)}
  onclick={(e) => {
    if (e.target === dialog) dialog.close();
  }}
  class={className}
>
  <button onclick={() => dialog.close()} class="absolute top-0 right-0 outline-none group">
    <XIcon class="w-8 m-1 stroke-pj-blue hover:stroke-white group-focus:stroke-pj-violet " />
  </button>
  {@render children?.()}
</dialog>

<style>
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }

  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }

  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
