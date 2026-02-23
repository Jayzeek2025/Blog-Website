import { useForm } from 'react-hook-form'
import { registerUser } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm()

  const password = watch('password')
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

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
      const response = await registerUser({
        username: data.username,
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
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Username */}
        <div>
          <input
            style={inputStyle(errors.username)}
            placeholder="Username"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters',
              },
              maxLength: {
                value: 20,
                message: 'Username must not exceed 20 characters',
              },
            })}
          />
          {errors.username && (
            <p style={errorStyle}>{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
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

        {/* Password */}
        <div>
          <input
            type="password"
            style={inputStyle(errors.password)}
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
              maxLength: {
                value: 40,
                message: 'Password must not exceed 40 characters',
              },
            })}
          />
          {errors.password && (
            <p style={errorStyle}>{errors.password.message}</p>
          )}
        </div>

        {/* Repeat Password */}
        <div>
          <input
            type="password"
            style={inputStyle(errors.repeatPassword)}
            placeholder="Repeat Password"
            {...register('repeatPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
          />
          {errors.repeatPassword && (
            <p style={errorStyle}>{errors.repeatPassword.message}</p>
          )}
        </div>

        {/* Checkbox */}
        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              {...register('agree', {
                required: 'You must agree to personal data processing',
              })}
            />
            {' '}I agree to personal data processing
          </label>
          {errors.agree && (
            <p style={errorStyle}>{errors.agree.message}</p>
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
          Register
        </button>
      </form>
    </div>
  )
}