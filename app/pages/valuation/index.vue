<script setup lang="ts"></script>

<template>
  <GenericTable
    :headers="[
      'Reg No',
      'Client',
      'Vehicle',
      'Booking Date',
      'Date Completed',
      'Assessed Value',
      'Notes',
      '',
    ]"
    :dataLoading="true"
  >
  </GenericTable>

  <form class="flex mt-10 justify-between items-center">
    <span class="text-base-content/80 text-base">
      Showing 1 of 20 pages (200 items)
    </span>
    <div class="flex space-x-2">
      <InputsGenericSubmitButton
        buttonText="Prev"
        :submitLoading="false"
        class="h-12 w-24"
      ></InputsGenericSubmitButton>

      <InputsGenericSubmitButton
        buttonText="Next"
        :submitLoading="false"
        class="h-12 w-24"
      ></InputsGenericSubmitButton>
    </div>
  </form>
</template>
