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

export const createArticle = (token, articleData) => {
  return API.post(
    '/articles',
    { article: articleData },
    {
      headers: {
        Authorization: `Token ${token}`
      }
    }
  )
}

export const updateArticle = (token, slug, articleData) => {
  return API.put(
    `/articles/${slug}`,
    { article: articleData },
    {
      headers: {
        Authorization: `Token ${token}`
      }
    }
  )
}

export const deleteArticle = (token, slug) => {
  return API.delete(`/articles/${slug}`, {
    headers: {
      Authorization: `Token ${token}`
    }
  })
}

export const favoriteArticle = (token, slug) => {
  return API.post(
    `/articles/${slug}/favorite`,
    {},
    {
      headers: {
        Authorization: `Token ${token}`
      }
    }
  )
}

export const unfavoriteArticle = (token, slug) => {
  return API.delete(
    `/articles/${slug}/favorite`,
    {
      headers: {
        Authorization: `Token ${token}`
      }
    }
  )
}