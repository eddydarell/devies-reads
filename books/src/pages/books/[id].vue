<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { ShelvedBook } from '~/types'

const book = ref()
const isLoading = ref(true)
const route = useRoute()
const showRating = ref(false)
const user = useUserStore()
const shelfURL = `https://devies-reads-be.onrender.com/users/${user.sessionID}/shelf`
const userRating = ref(0)
const rerenderKey = ref(0)

function updateRating(payload: any) {
  userRating.value = Number(payload) ?? 0
  forceRerender()
}

function forceRerender() {
  rerenderKey.value++
}

async function fetchBook(): Promise<void> {
  const url = `https://devies-reads-be.onrender.com/books/${route.params.id}`

  try {
    book.value = await (await fetch(url)).json()
    isLoading.value = false

    updateRating(user.shelf.find(sb => sb.id === book.value.id)?.userRating ?? 0)
  }
  catch (err) {
    console.warn('Something went wrong')
  }
}

// async function getUserShelf() {
//   const url = `https://devies-reads-be.onrender.com/users/${user.sessionID}`
//   const data = await (await fetch(url)).json()
// }

async function updateBookStatus(status: string) {
  const shelfBook = user.shelf.find((shelvedBook: ShelvedBook) => shelvedBook.id === book.value.id)

  if (shelfBook) { // book exists
    if (shelfBook.status === status) {
      alert(`Book is already marked as ${status}`)
    }
    else {
      await (await fetch(shelfURL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.sessionToken}`,
        },
        body: JSON.stringify({
          bookId: book.value.id,
          status,
        }),
      })).json()

      user.updateUserShelf({
        id: book.value.id,
        status,
      })
    }
  }
  else { // The book wasn't in the shelf
    await (await fetch(shelfURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.sessionToken}`,
      },
      body: JSON.stringify({
        bookId: book.value.id,
        status,
      }),
    })).json()

    user.updateUserShelf({
      ...book.value,
      status,
    })
  }
}

function markAsReading() {
  updateBookStatus('currentlyReading')
}
function markAsRead() {
  updateBookStatus('haveRead')
}
function addToWishList() {
  updateBookStatus('wantToRead')
}

onMounted(() => {
  fetchBook()
  // getUserShelf()
})
</script>

<template>
  <div class="main">
    <div class="book">
      <div class="navigation">
        <RouterLink to="/books">
          Back to books
        </RouterLink>
        <RouterLink v-show="user.isLoggedIn" to="/users/MyLibrary">
          Go to your library
        </RouterLink>
      </div>
      <loader-component v-if="isLoading" />
      <div v-else class="card">
        <div class="cover">
          <img :src="book.coverUrl">
        </div>
        <div class="content">
          <small v-if="book.genre">{{ book.genre }}</small>
          <h3>
            {{ book.name }}
          </h3>
          <app-rating-component :editable="false" :rating="book.averageRating" />
          <p>{{ book.description }}</p>
          <div class="stats">
            <span>Read by {{ book.haveRead }}</span>
            <span>Currently read by {{ book.currentlyReading }}</span>
            <span>Wanting to read {{ book.wantToRead }}</span>
          </div>
        </div>
        <div v-show="!user.isLoggedIn" class="action-buttons">
          Please
          <RouterLink :to=" `/users?book_id=${book.id}`">
            login or sign in
          </RouterLink> to start reading this book.
        </div>
        <div v-show="user.isLoggedIn" class="action-buttons">
          <div class="left">
            <button @click="markAsReading()">
              Start Reading
            </button>
            <button @click="markAsRead()">
              Mark As Read
            </button>
            <button @click="addToWishList()">
              Add To WishList
            </button>
          </div>
          <div class="right" @mouseenter="showRating = true" @mouseleave="showRating = false">
            <app-rating-component v-show="showRating" :key="rerenderKey" :editable="true" :rating="userRating" @update-rating="updateRating" />
            <button v-show="!showRating">
              Rate Book {{ showRating }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navigation{
  font-size: 1.2em;
  text-transform: capitalize;
  transition: all 1s;
  text-align: left;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
a{
  padding: 5px;
  transition: all .5s;
}
a:hover{
  color: #DF3;
}
div.main{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
}
.book{
   display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 50%;
  text-align: left;
}
.card{
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction: column;
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
  margin-bottom: 10px;
}

.card > .cover > img{
  min-width: 200px;
  width: 500vw;
  height: auto;
  border-radius: 5px;
}

.card > .content{
  text-align: left;
}

.card > .content > h3{
  font-size: 2em;
  color: #DF3;
  text-transform: capitalize;
  transition: all 1s;
  padding: 20px 0;
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

.card > .content > .stats{
  font-size: 1.2em;
  display: flex;
  flex-direction: column;
  border-top: 2px solid #888;
  margin-top: 20px;
  width: 100%;
  justify-content:flex-start;
  padding: 20px 0;
}

.card > .content > .stats span{
  margin-right: 10px;
}

.action-buttons{
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
}
.action-buttons div{
  display: flex;
  position: relative;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
  align-items: center;
}
.action-buttons div.left{
  position: absolute;
  left: 0px;
}
.action-buttons div.right{
  position: absolute;
  right: 0px;
}

.action-buttons button{
  display: block;
  padding: 10px;
  border: 1px solid #DDD;
  outline: #DDD;
  border-radius: 5px;
  transition: all 0.5s;
}
.action-buttons button:hover{
  color: #DF3;
  border-color:#DF3;
}
.action-buttons a{
  text-decoration: underline;
}
</style>
