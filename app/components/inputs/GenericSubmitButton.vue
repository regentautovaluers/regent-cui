<script setup lang="ts">
interface Props {
  icon?: string;
  buttonText: string;
  submitLoading: boolean;
  buttonMode?: string;
  buttonType?: "submit" | "button";
  emitWithValue?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: "Some Text Here",
  submitLoading: false,
  buttonType: "submit",
});

const emits = defineEmits(["button-clicked"]);
</script>

<template>
  <button
    :class="['btn h-13 text-lg', buttonMode ?? 'btn-primary']"
    :type="buttonType"
    :disabled="submitLoading"
    @click="
      () => {
        if (buttonType == 'button') {
          emits('button-clicked', emitWithValue);
        }
      }
    "
  >
    <span v-if="icon" :class="[icon, 'size-5 shrink-0']"></span>
    {{ submitLoading ? "Please Wait" : buttonText }}

    <!-- Loading text -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      class="size-5"
      v-if="submitLoading"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <circle cx="4" cy="12" r="3" fill="currentColor">
        <animate
          id="SVGKiXXedfO"
          attributeName="cy"
          begin="0;SVGgLulOGrw.end+0.25s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
          values="12;6;12"
        />
      </circle>
      <circle cx="12" cy="12" r="3" fill="currentColor">
        <animate
          attributeName="cy"
          begin="SVGKiXXedfO.begin+0.1s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
          values="12;6;12"
        />
      </circle>
      <circle cx="20" cy="12" r="3" fill="currentColor">
        <animate
          id="SVGgLulOGrw"
          attributeName="cy"
          begin="SVGKiXXedfO.begin+0.2s"
          calcMode="spline"
          dur="0.6s"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
          values="12;6;12"
        />
      </circle>
    </svg>
  </button>
</template>
