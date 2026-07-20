<script setup lang="ts">
import GenericInput from "./components/inputs/GenericInput.vue";
import GenericInputSearchBox from "./components/inputs/GenericInputSearchBox.vue";
import GenericTextArea from "./components/inputs/GenericTextArea.vue";
</script>

<template>
  <div>
    <button class="btn">Default</button>
    <button class="btn btn-primary">Primary</button>
    <button class="btn btn-secondary">Secondary</button>
    <button class="btn btn-accent">Accent</button>
    <button class="btn btn-info">Info</button>
    <button class="btn btn-success">Success</button>
    <button class="btn btn-warning">Warning</button>
    <button class="btn btn-error">Error</button>
  </div>

  <div>
    <button class="btn btn-outline">Default</button>
    <button class="btn btn-outline btn-primary">Primary</button>
    <button class="btn btn-outline btn-secondary">Secondary</button>
    <button class="btn btn-outline btn-accent">Accent</button>
    <button class="btn btn-outline btn-info">Info</button>
    <button class="btn btn-outline btn-success">Success</button>
    <button class="btn btn-outline btn-warning">Warning</button>
    <button class="btn btn-outline btn-error">Error</button>
  </div>

  <button
    type="button"
    class="btn btn-primary"
    aria-haspopup="dialog"
    aria-expanded="false"
    aria-controls="fullscreen-modal"
    data-overlay="#fullscreen-modal"
  >
    Fullscreen modal
  </button>

  <div
    id="fullscreen-modal"
    class="overlay modal overlay-open:opacity-100 overlay-open:duration-300 hidden"
    role="dialog"
    tabindex="-1"
  >
    <div class="modal-dialog max-w-none">
      <div class="modal-content h-full max-h-none justify-between">
        <div class="modal-header">
          <h3 class="modal-title">Dialog Title</h3>
          <button
            type="button"
            class="btn btn-text btn-circle btn-sm absolute end-3 top-3"
            aria-label="Close"
            data-overlay="#fullscreen-modal"
          >
            <span class="icon-[tabler--x] size-4"></span>
          </button>
        </div>
        <div class="modal-body grow">
          <p>
            This is some placeholder content to show the scrolling behavior for
            modals. Instead of repeating the text in the modal, we use an inline
            style to set a minimum height, thereby extending the length of the
            overall modal and demonstrating the overflow scrolling. When content
            becomes longer than the height of the viewport, scrolling will move
            the modal as needed.
          </p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-soft btn-secondary"
            data-overlay="#fullscreen-modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>

  <br />

  <GenericInput
    input-id="sample-input-id"
    input-label="Sample Label"
    input-text-size="xs"
    :input-valid="false"
    input-helpertext="Sample input helper text"
  ></GenericInput>
  <GenericTextArea
    input-id="sample-textarea-id"
    input-label="Sample Label"
    :input-default-row-num="2"
    input-text-size="lg"
    :input-valid="false"
  ></GenericTextArea>

  <GenericInputSearchBox
    input-id="sample-dropdown-search"
    input-label="Search Something Here"
    :input-dropdown-options="[
      { id: 0, text: 'text-0' },
      { id: 1, text: 'text-1' },
      { id: 2, text: 'text-2' },
      { id: 3, text: 'text-3' },
      { id: 4, text: 'text-4' },
      { id: 5, text: 'text-5' },
    ]"
  >
  </GenericInputSearchBox>
</template>
