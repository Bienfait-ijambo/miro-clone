<script lang="ts" setup>
defineProps<{
  type?: string
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: any): void
}>()

function updateValue(event: any) {
  const val = event.target.value
  emit('update:modelValue', val)
  // console.log(val)
}
</script>

<template>
  <input
    :value="modelValue"
    :type="typeof type === 'undefined' ? 'text' : type"
    class="border w-full rounded-md py-2 px-2 text-gray-600 bg-white"
    @input="updateValue"
    placeholder="..."
  />
</template>


