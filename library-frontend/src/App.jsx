import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import LoginForm from "./components/LoginForm";
import NewBook from "./components/NewBook";
import Recommendations from "./components/Recommendations";
import { ALL_BOOKS, BOOK_ADDED, GET_BOOKS_BY_GENRE } from "./queries";
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import { useApolloClient, useSubscription } from "@apollo/client";

const App = () => {
  const padding = {
    padding: 5
  }

  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook)
        }
      })
      // addedBook.genres.forEach((genre) => {
      //   client.cache.updateQuery(
      //     { query: GET_BOOKS_BY_GENRE, variables: {genre} },
      //     ({ allBooks }) => {
      //       return {
      //         allBooks: allBooks.concat(addedBook)
      //       }
      //     }
      //   )
      // })
    }
  })

  const [token, setToken] = useState(null)

  useEffect(() => {
    if (!token) {
      setToken(localStorage.getItem('library-user-token'))
    }
  }, [token])

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
    client.clearStore()
  }

  return (
    <Router>
      <div>
        <Link style={padding} to='/'>Authors</Link>
        <Link style={padding} to='/books'>Books</Link>
        {token
          ? <>
            <Link style={padding} to='/books/create'>Add Book</Link>
            <Link style={padding} to='/books/recommendations'>Recommendations</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
          : <Link style={padding} to='/login'>Login</Link>
        }
      </div>

      <Routes>
        <Route path='/books/create' element={<NewBook />} />
        <Route path='/books/recommendations' element={<Recommendations />} />
        <Route path='/books' element={<Books />} />
        <Route path='/login' element={<LoginForm setToken={setToken} />} />
        <Route path='/' element={<Authors token={token} />} />
      </Routes>

    </Router>
  );
};

export default App;
