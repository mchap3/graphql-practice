import { useQuery } from "@apollo/client"
import { GET_BOOKS_BY_GENRE, GET_USER } from "../queries"

const Recommendations = () => {
  const userResult = useQuery(GET_USER)
  const favoriteGenre = userResult.data?.me?.favoriteGenre

  const booksResult = useQuery(GET_BOOKS_BY_GENRE, {
    skip: !favoriteGenre,
    variables: { genre: favoriteGenre }
  })

  if (booksResult.loading || userResult.loading)
    return <div>loading...</div>

  return (
    <div>
      <h2>Recommendations</h2>
      Showing books of your favorite genre: <strong>{favoriteGenre}</strong>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {booksResult.data.allBooks.map((book) => 
            book.genres.includes(favoriteGenre)
            ? (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            )
            : null
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
