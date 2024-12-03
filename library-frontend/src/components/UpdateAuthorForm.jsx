import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import { EDIT_AUTHOR } from "../queries"

const UpdateAuthorForm = ({ authors }) => {
  const [born, setBorn] = useState('')

  const [ editAuthor, result ] = useMutation(EDIT_AUTHOR)

  const handleUpdate = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const name = Object.fromEntries(formData.entries()).authorToEdit
    
    editAuthor({ variables: {
      name,
      setBornTo: parseInt(born)
    }})

    setBorn('')
  }

  useEffect(() => {
    if (result.data && result.data.editAuthor === null)
      console.log('author not found')
  }, [result.data])
    

  return (
    <div>
      <h2>Set Birthyear</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label >
            Name: <select name="authorToEdit">
              {authors.map(a => 
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              )}
            </select>
          </label>
        </div>
        <div>
          <label >
            Born: <input 
              type="text"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </label>
        </div>
        <button type="submit">Update Author</button>
      </form>
    </div>
  )
}

export default UpdateAuthorForm