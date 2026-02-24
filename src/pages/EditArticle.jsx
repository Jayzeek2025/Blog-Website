import { useForm } from 'react-hook-form'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchArticleBySlug, updateArticle } from '../api/articles'

export default function EditArticle() {
  const { token } = useContext(AuthContext)
  const { slug } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const response = await fetchArticleBySlug(slug)
        const article = response.data.article

        reset({
          title: article.title,
          description: article.description,
          body: article.body,
        })

        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    loadArticle()
  }, [slug, reset])

  const onSubmit = async (data) => {
    try {
      const response = await updateArticle(token, slug, {
        title: data.title,
        description: data.description,
        body: data.body,
      })

      navigate(`/articles/${response.data.article.slug}`)
    } catch (error) {
      const serverErrors = error.response?.data?.errors

      if (serverErrors) {
        Object.keys(serverErrors).forEach((field) => {
          setError(field, {
            type: 'server',
            message: serverErrors[field].join(', '),
          })
        })
      }
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>Edit Article</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <input
          placeholder="Article Title"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && <p>{errors.title.message}</p>}

        <input
          placeholder="What's this article about?"
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && <p>{errors.description.message}</p>}

        <textarea
          rows="6"
          placeholder="Write your article"
          {...register('body', { required: 'Body is required' })}
        />
        {errors.body && <p>{errors.body.message}</p>}

        <button type="submit">Update Article</button>

      </form>
    </div>
  )
}