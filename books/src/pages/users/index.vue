<script setup lang="ts">
import VueCookies from 'vue-cookies'
const user = useUserStore()
const loginUrl = 'https://devies-reads-be.onrender.com/auth/login'
const registrationUrl = 'https://devies-reads-be.onrender.com/auth/register'
const isLoading = ref(true)
const router = useRouter()
const route = useRoute()
const bookID = route.query?.book_id

async function register() {
  const registrationData = await (await fetch(registrationUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: user.username,
      password: user.password,
    }),
  })).json()

  if (registrationData.accessToken) { // Successfully received a token
    user.sessionToken = registrationData.accessToken
    user.sessionID = registrationData.userId
    user.isLoggedIn = true

    if (bookID)
      router.push(`/books/${bookID}`)
    else router.push('/books/')
  }
}

async function login() {
  try {
    const loginData = await (await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${VueCookies.get('sessionToken')}` },
      body: JSON.stringify({
        username: user.username,
        password: user.password,
      }),
    })).json()

    if (loginData.statusCode !== 200) { // Login failed, fallback on registration
      register()
    }
    else {
      user.sessionToken = loginData.accessToken
      user.sessionID = loginData.userId
      user.isLoggedIn = true
      isLoading.value = false

      if (bookID)
        router.push(`/books/${bookID}`)
      else router.push('/books/')
    }
  }
  catch (err) {
    console.warn('Something went wrong')
  }
}
</script>

<template>
  <div class="main">
    <h3>Login Or Register</h3>
    <div v-if="user.isLoggedIn">
      You are already logged in as {{ user.username }}
    </div>
    <div v-else class="form">
      <div>
        <label name="username">Username</label>
        <input v-model="user.username" name="username" type="text" placeholder="your username...">
      </div>
      <div>
        <label name="password">Password</label>
        <input v-model="user.password" name="password" type="password">
      </div>
      <div>
        <button @click="login()">
          Register / Login
        </button>
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
h3{
  font-size: 2em;
  text-transform: capitalize;
}
.form{
   display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 50%;
  text-align: left;
  border: 1px solid #DF3;
  padding: 40px;
  border-radius: 10px;
  justify-content:center
}
.form div{
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
}
.form input{
padding: 5px;
border-radius: 5px;
outline: #DF3;
width: 250px;
}

button{
  display: block;
  padding: 10px;
  border: 1px solid #DDD;
  outline: #DDD;
  border-radius: 5px;
  transition: all 0.5s;
}
button:hover{
  color: #DF3;
  border-color:#DF3;
}
</style>
