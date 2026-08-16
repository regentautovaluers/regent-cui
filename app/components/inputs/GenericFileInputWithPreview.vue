<script setup>
import { ref, onUnmounted } from "vue";

const fileInput = ref(null);
const previews = ref([]);
const isDragging = ref(false);

// Handle file selection from input or drag event
const handleFiles = (fileList) => {
  // Revoke old object URLs to prevent memory leaks
  previews.value.forEach((preview) => URL.revokeObjectURL(preview.url));

  const validFiles = Array.from(fileList).filter((file) =>
    file.type.startsWith("image/"),
  );

  previews.value = validFiles.map((file) => ({
    file,
    url: URL.createObjectURL(file),
    name: file.name,
  }));
};

const onChange = (e) => {
  if (e.target.files) handleFiles(e.target.files);
};

const onDrop = (e) => {
  isDragging.value = false;
  if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files);
};

const removeImage = (index) => {
  URL.revokeObjectURL(previews.value[index].url);
  previews.value.splice(index, 1);

  // Reset actual file input state if all items cleared
  if (previews.value.length === 0 && fileInput.value) {
    fileInput.value.value = "";
  }
};

// Cleanup object URLs when component unmounts
onUnmounted(() => {
  previews.value.forEach((preview) => URL.revokeObjectURL(preview.url));
});
</script>

<template>
  <div class="max-w-md mx-auto flex bg-red-500">
    <!-- Preview Section -->
    <div v-if="previews.length" class="flex flex-wrap gap-4">
      <div
        v-for="(item, index) in previews"
        :key="item.url"
        class="relative group h-24 w-24"
      >
        <img
          :src="item.url"
          :alt="item.name"
          class="w-full h-24 object-cover rounded shadow-sm"
        />
      </div>
    </div>

    <div class="flex items-center justify-center w-full">
      <label
        for="dropzone-file"
        :class="[
          'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100',
        ]"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
      >
        <div
          class="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none"
        >
          <span class="icon-[material-symbols--attach-file-add-rounded] size-5"></span>

          <p class="mb-2 text-sm text-gray-500">
            <span class="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-gray-500">PDF, PNG, JPG, JPEG (MAX. 1Mb)</p>
        </div>

        <input
          id="dropzone-file"
          ref="fileInput"
          type="file"
          class="hidden"
          multiple
          accept="image/*"
          @change="onChange"
        />
      </label>
    </div>
  </div>
</template>
