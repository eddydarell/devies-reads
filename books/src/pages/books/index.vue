<script setup lang="ts">
import type { Book } from '@types.ts'
const user = useUserStore()
const books = ref()
const isLoading = ref(true)
// const showError = ref(false)
async function fetchBooks(): void {
  const url = 'https://devies-reads-be.onrender.com/books'

  try {
    books.value = await (await fetch(url)).json()
    sortBooks(1)

    isLoading.value = false
  }
  catch (err) {
    console.warn('There was a problem retrieving the book library')
  }
}

function sortBooks(option: number): any {
  books.value = books.value.sort((book1: Book, book2: Book) => {
    switch (option) {
      case 1:
        return book1.name > book2.name ? 1 : -1
      case 2:
        return book2.name > book1.name ? 1 : -1
      case 3:
        return book2.haveRead - book1.haveRead
      case 4:
        return book1.haveRead - book2.haveRead
      case 5:
        return book2.wantToRead - book1.wantToRead
      case 6:
        return book1.wantToRead - book2.wantToRead
      case 7:
        return book2.currentlyReading - book1.currentlyReading
      case 8:
        return book1.currentlyReading - book2.currentlyReading
      default:
        return book1.name > book2.name ? 1 : -1
    }
  })
}

function triggerSort(event: Event): void {
  const value = Number(event.target.value)
  sortBooks(value)
}

onMounted(() => {
  fetchBooks()
})
</script>

<template>
  <div class="main">
    <div class="books">
      <h1>Books <small v-show="user.isLoggedIn">Logged in as <i>{{ user.username }}</i></small></h1>
      <div class="filter">
        Sort books by
        <select class="sort-list" @change="triggerSort($event)">
          <option value="1" checked>
            Name Ascending
          </option>
          <option value="2">
            Name Descending
          </option>
          <option value="3">
            Most Read
          </option>
          <option value="4">
            Least Read
          </option>
          <option value="5">
            Most Want To Read
          </option>
          <option value="6">
            Least Want To Read
          </option>
          <option value="7">
            Most Currently Reading
          </option>
          <option value="8">
            Least Currently Reading
          </option>
        </select>
      </div>
      <loader-component v-if="isLoading && !showError" />
      <div v-for="book in books" v-else :key="book.id">
        <book-component :book="book" />
      </div>
    </div>
  </div>
</template>

<style scoped>
div.main{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
}
div.main > .books{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 80%;
  text-align: left;
}

div.main > .books > h1{
  position: relative;
  font-size: 3em;
  width: 100%;
}

div.main > .books > h1 small{
  position: absolute;
  right: 0;
  bottom: 0px;
  color: #555;
  font-size: 0.4em;
}
div.main > .books > h1 small i{
  color: #e5e7eb;
}

div.main > .books > .filter{
  width: 100%;
  text-align: left;
}

select.sort-list{
  padding: 5px;
  border-radius: 5px;
  margin-left: 20px;;
}
</style>
