<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

export interface Option {
  value: string
  label: string
}

export interface Props {
  name: string
  modelValue: string[] | undefined
  options: Option[]
  label: string
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  const el = event.target as HTMLInputElement
  const value = el.value
  const isChecked = el.checked

  let updatedModelValue: string[] = []
  if (props.modelValue !== undefined) {
    updatedModelValue = [...props.modelValue]
  }

  if (isChecked && !updatedModelValue.includes(value)) {
    updatedModelValue.push(value)
  } else if (!isChecked && updatedModelValue.includes(value)) {
    updatedModelValue = updatedModelValue.filter((item) => item !== value)
  }

  emit('update:modelValue', updatedModelValue)
}
</script>

<template>
  <div>
    <div v-for="(option, index) in options" :key="index" class="flex items-center">
      <input
        type="checkbox"
        :id="`${name}-${index}`"
        :value="option.value"
        :checked="props.modelValue !== undefined && props.modelValue.includes(option.value)"
        @change="updateValue"
        class="mr-2"
      />
      <label :for="`${name}-${index}`" class="cursor-pointer">{{ option.label }}</label>
    </div>
  </div>
</template>
