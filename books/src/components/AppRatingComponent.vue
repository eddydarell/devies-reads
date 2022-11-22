<script setup lang="ts">
const props = defineProps<{
  rating: number
  editable: boolean
}>()
const emit = defineEmits(['updateRating'])
const rating = ref(props.rating)

function drawRating(avgRating: number) {
  const avg = Math.round(avgRating)
  return avg
}

function emitUpdateRating(payload: number) {
  emit('updateRating', payload)
}
</script>

<template>
  <div class="rating">
    <div v-for="star in drawRating(rating)" :key="star" :class="editable ? 'editable' : ''">
      <app-rating-star-component :filled="true" @update-rating="emitUpdateRating" />
    </div>
    <div v-for="star in 5 - drawRating(rating)" :key="star" :class="editable ? 'editable' : ''">
      <app-rating-star-component :filled="false" @update-rating="emitUpdateRating" />
    </div>
  </div>
</template> />

<style scoped>
div.rating{
  display: flex;
  flex-direction: row;
}

div.editable:hover span{
  color: #DF3;
}
</style>
