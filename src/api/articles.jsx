import axios from 'axios'

const API = axios.create({
  baseURL: 'https://realworld.habsida.net/api'
})

export const fetchArticles = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit
  return API.get(`/articles?limit=${limit}&offset=${offset}`)
}

export const fetchArticleBySlug = (slug) => {
  return API.get(`/articles/${slug}`)
}