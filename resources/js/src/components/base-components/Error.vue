<script lang="ts" setup>
import { type ErrorObject } from '@vuelidate/core'

const props = defineProps<{
  label: string
  errors: ErrorObject[]
}>()
</script>
<template>
  <label class="text-gray-500" >{{ props.label }}</label>

  <div :class="{ error: props.errors.length }">
    <slot></slot>
    <div class="input-errors" v-for="error of props.errors" :key="error.$uid">
      <div class="error-msg">{{ error.$message }}</div>
    </div>
  </div>
</template>
<style scoped>
.input-errors {
  color: red;
}
</style>