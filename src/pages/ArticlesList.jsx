import { useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchArticles, favoriteArticle, unfavoriteArticle } from '../api/articles'
import { AuthContext } from '../context/AuthContext'

export default function ArticlesList() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()

  const LIMIT = 10

  const handleLike = async (slug, favorited) => {
    if (!user) {
      navigate('/sign-in')
      return
    }

    try {
      const response = favorited
        ? await unfavoriteArticle(token, slug)
        : await favoriteArticle(token, slug)

      const updatedArticle = response.data.article

      setArticles(prev =>
        prev.map(article =>
          article.slug === slug ? updatedArticle : article
        )
      )

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetchArticles(page, LIMIT)
      .then(res => {
        setArticles(res.data.articles)
        setTotal(res.data.articlesCount)
      })
      .catch(() => {
        setError('Failed to load articles')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page])

  if (loading) return <p>Loading articles...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="page">
      <div className="container">
        <div className="articles-header">
          <h1>Articles</h1>
        </div>

        {articles.map(article => (
          <div className="article-card" key={article.slug}>

            {/* LEFT COLUMN */}
            <div className="article-left">
              <Link to={`/articles/${article.slug}`}>
                <h3>{article.title}</h3>
              </Link>
              <p>{article.description}</p>
            </div>

            {/* RIGHT COLUMN — LIKE BUTTON */}
            <div className="article-right">
              <button
                className="like-btn"
                onClick={() => handleLike(article.slug, article.favorited)}
              >
                {article.favorited ? '💔' : '❤️'} {article.favoritesCount}
              </button>
            </div>

          </div>
        ))}

        {/* PAGINATION */}
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(p - 1, 1))}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}