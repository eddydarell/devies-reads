<script setup lang="ts">
const props = defineProps<{
  filled: boolean
}>()
const emit = defineEmits(['updateRating'])
const route = useRoute()
const filled = ref(props.filled)
const bookID = route.params.id
const user = useUserStore()
async function commitRating(event: Event) {
  const url = `https://devies-reads-be.onrender.com/books/${bookID}/rate`
  const rating = findStarPosition(event?.target)

  try {
    const ratingData = await (await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.sessionToken}` },
      body: JSON.stringify({
        bookId: bookID,
        rating,
      }),
    })).json()

    user.updateUserShelf(ratingData)
    emit('updateRating', [rating])
  }
  catch (err) {
    console.warn('Something went wrong:', err)
  }
}

function findStarPosition(star: HTMLElement) {
  const position = Array.from(star?.parentNode?.parentNode?.parentNode?.children).indexOf(star?.parentNode?.parentNode)
  return position + 1
}
</script>

<template>
  <span class="rating" @click="commitRating($event)">
    <div v-if="filled" i="carbon-star-filled" />
    <div v-else i="carbon-star" />
  </span>
</template> />

<style scoped>
span.rating{
  display: inline-block;
  width: 20px;
  padding: 5px;
  /* color: #DF3; */
  color: blueviolet;
}
</style>
