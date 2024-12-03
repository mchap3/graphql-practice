import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LOGIN } from '../queries'

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.message)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      navigate('/')
    }
  }, [result.data, setToken, navigate])

  const handleLogin = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username: <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password: <input
              type="text"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginForm