<script setup lang="ts">
import type { Book } from '~/types'

const props = defineProps<{
  book: Book
}>()
const book = ref(props.book)
// const user = useUserStore()

const router = useRouter()
const go = () => {
  if (book.value.id)
    router.push(`/books/${encodeURIComponent(book.value.id)}`)
}
</script>

<template>
  <div class="card">
    <div class="cover">
      <img :src="book.coverUrl">
    </div>
    <div class="content">
      <small v-if="book.genre">{{ book.genre }}</small>
      <h3>
        <button @click="go">
          {{ book.name }}
        </button>
      </h3>
      <app-rating-component :rating="book.averageRating" />
      <p>{{ book.description }}</p>
      <div class="stats">
        <div>Read by <span>{{ book.haveRead }}</span></div>
        <div>Currently read by <span>{{ book.currentlyReading }}</span></div>
        <div>Wanting to read <span>{{ book.wantToRead }}</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card{
  display:flex;
  justify-content:center;
  align-items:flex-start;
  flex-direction: row;
  border-radius: 5px;
  padding: 20px;
  background: #222;
  transition: all 2s;
}

.card:hover > .content > h3{
  color: #DF3;
  cursor: pointer;
}

.card > .cover{
  margin-right: 20px;
}

.card > .cover > img{
  min-width: 200px;
  width: 200px;
  height: auto;
  border-radius: 5px;
  filter: grayscale(75%);
  transition: all 1s;
}

.card:hover > .cover > img{
  filter: grayscale(0%);
}

.card > .content{
  text-align: left;
}

.card > .content > h3{
  font-size: 2em;
  text-transform: capitalize;
  transition: all 1s;
}
.card > .content > h3 > button{
  text-transform: capitalize;
}

.card > .content > h3 > button{
  text-align: left;
}

.card > .content > p{
  padding-top: 10px;
}
.card > .content > p::first-letter{
  color: #DF3;
  font-family:'Times New Roman', Times, serif;
  line-height: 100%;
  font-size: 3em;
  float: left;
  margin-right: 5px;
  padding-right: 5px;
  transition: all 1s;
}

/* .card:hover > .content > p::first-letter{
  color:inherit;
} */

.card> .content> .stats{
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content:flex-start;
  border-top: 2px solid #555;
  margin-top: 20px;
  padding-top: 20px;
}

.card > .content > .stats div{
  padding: 10px;
  display: block;
  margin-right: 10px;
  color: #555;
  border-right: 1px solid #555;
  border-bottom: 1px solid #555;
  border-radius: 5px;
}

.card>  .content > .stats div span{
 color: #e5e7eb;
}
</style>
