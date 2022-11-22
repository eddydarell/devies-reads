import { acceptHMRUpdate, defineStore } from 'pinia'
import { setBlockTracking } from 'vue'
import type { Book, ShelvedBook } from '~/types'

export const useUserStore = defineStore('user', () => {
  /**
   * Current name of the user.
   */
  const savedName = ref('')
  const previousNames = ref(new Set<string>())

  const usedNames = computed(() => Array.from(previousNames.value))
  const otherNames = computed(() => usedNames.value.filter(name => name !== savedName.value))

  const username = ref('')
  const sessionID = ref('')
  const sessionToken = ref('')
  const password = ref('')
  const isLoggedIn = ref(false)
  const shelf = ref([])

  /**
   * Changes the current name of the user and saves the one that was used
   * before.
   *
   * @param name - new name to set
   */
  function setNewName(name: string) {
    if (savedName.value)
      previousNames.value.add(savedName.value)

    savedName.value = name
  }

  function updateUserShelf(bookData: Book) {
    let foundBook = false

    for (let i = 0; i < shelf.value.length; i++) {
      if (shelf.value[i].id === bookData.id) {
        shelf.value[i].status = bookData.status ?? shelf.value[i].status
        shelf.value[i].userRating = bookData.userRating ?? shelf.value[i].userRating
        foundBook = true
        break
      }
    }

    if (!foundBook)
      shelf.value.push(bookData)
  }

  // async function checkLoginStatus() {
  //   const url = 'https://devies-reads-be.onrender.com/is-logged-in'

  // }

  return {
    setNewName,
    otherNames,
    savedName,
    username,
    password,
    isLoggedIn,
    sessionID,
    sessionToken,
    shelf,
    updateUserShelf,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
