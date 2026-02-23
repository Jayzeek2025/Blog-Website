import { useForm } from 'react-hook-form'
import { loginUser } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function SignIn() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm()

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const inputStyle = (fieldError) => ({
    border: fieldError ? '1px solid red' : '1px solid #ccc',
    padding: '8px',
    width: '100%',
    marginBottom: '4px',
    borderRadius: '4px',
  })

  const errorStyle = {
    color: 'red',
    fontSize: '12px',
    marginBottom: '10px',
  }

  const onSubmit = async (data) => {
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      })

      login(response.data.user)
      navigate('/articles')

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
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Sign In</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div>
          <input
            style={inputStyle(errors.email)}
            placeholder="Email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && (
            <p style={errorStyle}>{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            style={inputStyle(errors.password)}
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
            })}
          />
          {errors.password && (
            <p style={errorStyle}>{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: '8px',
            width: '100%',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Sign In
        </button>
      </form>
    </div>
  )
}