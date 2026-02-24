import { useEffect, useState, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { fetchArticleBySlug, deleteArticle } from '../api/articles'
import { AuthContext } from '../context/AuthContext'

export default function ArticlePage() {
  const { slug } = useParams()
  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()

  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetchArticleBySlug(slug)
      .then(res => {
        setArticle(res.data.article)
      })
      .catch(() => {
        setError('Failed to load article')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [slug])

  const confirmDelete = async () => {
    try {
      await deleteArticle(token, slug)
      navigate('/articles')
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) return <p>Loading article...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!article) return null

  return (
    <div>
      <h1>{article.title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <p>By {article.author.username}</p>

        {user && user.username === article.author.username && (
          <>
            <Link to={`/articles/${slug}/edit`}>
              Edit
            </Link>

            <button
              onClick={() => setShowModal(true)}
              style={{ cursor: 'pointer' }}
            >
              Delete
            </button>
          </>
        )}
      </div>

      <ReactMarkdown>{article.body}</ReactMarkdown>

      {/* Confirmation Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
              textAlign: 'center',
            }}
          >
            <p>Are you sure you want to delete this article?</p>

            <button
              onClick={confirmDelete}
              style={{ marginRight: '10px' }}
            >
              Yes
            </button>

            <button onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}