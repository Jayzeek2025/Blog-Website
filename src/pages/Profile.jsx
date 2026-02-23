import { useForm } from 'react-hook-form'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { updateUser } from '../api/auth'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, token, login } = useContext(AuthContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  // Pre-fill form when user loads
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        avatar: user.image || '',
        password: '',
      })
    }
  }, [user, reset])

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
      const updateData = {
        username: data.username,
        email: data.email,
        bio: user.bio || '',
      }

      // Only include password if provided
      if (data.password && data.password.trim() !== '') {
        updateData.password = data.password
      }

      // Only include image if provided
      if (data.avatar && data.avatar.trim() !== '') {
        updateData.image = data.avatar
      }

      const response = await updateUser(token, updateData)

      // Update global auth state
      login(response.data.user)

      navigate('/articles')
    } catch (error) {
      console.log(error.response?.data)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div>
          <input
            style={inputStyle(errors.username)}
            placeholder="Username"
            {...register('username', {
              required: 'Username is required',
            })}
          />
          {errors.username && (
            <p style={errorStyle}>{errors.username.message}</p>
          )}
        </div>

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
            placeholder="New Password"
            {...register('password', {
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

        <div>
          <input
            style={inputStyle(errors.avatar)}
            placeholder="Avatar URL"
            {...register('avatar', {
              pattern: {
                value: /^https?:\/\/.+\..+/,
                message: 'Must be a valid URL',
              },
            })}
          />
          {errors.avatar && (
            <p style={errorStyle}>{errors.avatar.message}</p>
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
          Update
        </button>
      </form>
    </div>
  )
}