import { useQuery } from "@apollo/client"
import { ALL_BOOKS, GET_BOOKS_BY_GENRE } from "../queries"
import { useEffect, useState } from "react"

const Books = () => {
  const [selected, setSelected] = useState('')

  useEffect(() => {
    setSelected(localStorage.getItem('genreFilter') || '')
  }, [])

  const allResult = useQuery(ALL_BOOKS)
  const filterResult = useQuery(GET_BOOKS_BY_GENRE, {
    skip: !selected,
    variables: { genre: selected }
  })

  if (allResult.loading)
    return <div>loading...</div>

  const genres = [...new Set(allResult.data.allBooks.map(b => b.genres).flat())]

  const handleSelect = (event) => {
    setSelected(event.target.value)
    localStorage.setItem('genreFilter', event.target.value)
  }

  return (
    <div>
      <h2>Books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {(selected && filterResult.loading)
            ? null
            : (selected ? filterResult : allResult)
            .data.allBooks.map((book) => (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
      
      <div>
        <label>
          Filter Genres: <select
            name="genre-filter"
            value={selected}
            onChange={handleSelect}
          >
            <option value={''} ></option>
            {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
          </select>
        </label>
      </div>
    </div>
  )
}

export default Books
