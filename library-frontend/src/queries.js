import { gql } from "@apollo/client";

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author {
      name
    }
    genres
    id
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      id
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const ADD_BOOK = gql`
  mutation AddBook($title: String!, $published: Int!,
    $author: String!, $genres: [String!]!
  ) {
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
    ) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const EDIT_AUTHOR = gql`
  mutation EditAuthor($name: String!,
    $setBornTo: Int!
  ) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
      name
      born
      id
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const GET_USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

export const GET_BOOKS_BY_GENRE = gql`
  query booksByGenre($genre: String) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`