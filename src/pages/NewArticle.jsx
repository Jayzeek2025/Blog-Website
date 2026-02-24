import { useForm } from 'react-hook-form'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { createArticle } from '../api/articles'

export default function NewArticle() {
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm()

  const inputStyle = (fieldError) => ({
    border: fieldError ? '1px solid red' : '1px solid #ccc',
    padding: '8px',
    width: '100%',
    marginBottom: '8px',
    borderRadius: '4px',
  })

  const errorStyle = {
    color: 'red',
    fontSize: '12px',
    marginBottom: '10px',
  }

  const onSubmit = async (data) => {
    try {
      const response = await createArticle(token, {
        title: data.title,
        description: data.description,
        body: data.body,
      })

      const slug = response.data.article.slug

      navigate(`/articles/${slug}`)

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

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>Create New Article</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div>
          <input
            style={inputStyle(errors.title)}
            placeholder="Article Title"
            {...register('title', {
              required: 'Title is required',
            })}
          />
          {errors.title && (
            <p style={errorStyle}>{errors.title.message}</p>
          )}
        </div>

        <div>
          <input
            style={inputStyle(errors.description)}
            placeholder="What's this article about?"
            {...register('description', {
              required: 'Description is required',
            })}
          />
          {errors.description && (
            <p style={errorStyle}>{errors.description.message}</p>
          )}
        </div>

        <div>
          <textarea
            rows="6"
            style={inputStyle(errors.body)}
            placeholder="Write your article (in markdown)"
            {...register('body', {
              required: 'Body is required',
            })}
          />
          {errors.body && (
            <p style={errorStyle}>{errors.body.message}</p>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: '10px',
            width: '100%',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Publish Article
        </button>

      </form>
    </div>
  )
}