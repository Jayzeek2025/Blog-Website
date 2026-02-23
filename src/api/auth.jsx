import axios from 'axios'

const API = axios.create({
  baseURL: 'https://realworld.habsida.net/api'
})

export const registerUser = (userData) => {
  return API.post('/users', {
    user: userData
  })
}

export const loginUser = (userData) => {
  return API.post('/users/login', {
    user: userData
  })
}

export const getCurrentUser = (token) => {
  return API.get('/user', {
    headers: {
      Authorization: `Token ${token}`
    }
  })
}

export const updateUser = (token, userData) => {
  return API.put(
    '/user',
    userData,   // 
    {
      headers: {
        Authorization: `Token ${token}`
      }
    }
  )
}