<script setup lang="ts">
const { isOpen, modalContent, closeModal } = useModal();
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        id="top-center-modal"
        class="overlay modal overlay-open:opacity-100 overlay-open:duration-300 modal-top-center"
        role="dialog"
        tabindex="-1"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Dialog Title</h3>
              <button
                type="button"
                class="btn btn-text btn-circle btn-sm absolute end-3 top-3"
                aria-label="Close"
                data-overlay="#top-center-modal"
              >
                <span class="icon-[tabler--x] size-4"></span>
              </button>
            </div>
            <div class="modal-body">
              <component
                :is="modalContent.component"
                v-bind="modalContent.props"
                @close="closeModal"
              />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-soft btn-secondary"
                data-overlay="#top-center-modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
