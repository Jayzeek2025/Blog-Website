import { useEffect, useState, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import {
  fetchArticleBySlug,
  deleteArticle,
  favoriteArticle,
  unfavoriteArticle
} from '../api/articles'
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

  const handleLike = async () => {
    if (!user) {
      navigate('/sign-in')
      return
    }

    try {
      const response = article.favorited
        ? await unfavoriteArticle(token, slug)
        : await favoriteArticle(token, slug)

      setArticle(response.data.article)
    } catch (error) {
      console.log(error)
    }
  }

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
  <div className="article-container">
    <h1 className="article-title">{article.title}</h1>

    <div className="article-meta">
      <span>By {article.author.username}</span>

      <button
        className={`like-btn ${article.favorited ? 'liked' : ''}`}
        onClick={handleLike}
      >
        ❤️ {article.favoritesCount}
      </button>

      {user && user.username === article.author.username && (
        <>
          <Link to={`/articles/${slug}/edit`} className="edit-btn">
            Edit
          </Link>

          <button
            onClick={() => setShowModal(true)}
            className="delete-btn"
          >
            Delete
          </button>
        </>
      )}
    </div>

    <div className="article-body">
      <ReactMarkdown>{article.body}</ReactMarkdown>
    </div>

    {showModal && (
      <div className="modal-overlay">
        <div className="modal">
          <p>Are you sure you want to delete this article?</p>
          <div className="modal-actions">
            <button onClick={confirmDelete} className="confirm-btn">
              Yes
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)
}