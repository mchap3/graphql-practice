const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()


const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let query = {}
      if (args.author) {
        const author = await Author.find({ name: args.author })
        query.author = author
      }
      if (args.genre) {
        query.genres = args.genre
      }
      return Book.find(query).populate('author')
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, { currentUser }) => {
      return currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      return Book.find({ author: root.id }).countDocuments()
    }
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        try {
          author = new Author({ name: args.author })
          await author.save()
        } catch (error) {
          throw new GraphQLError('Creating author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }
      const book = new Book({
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres
      })
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Creating book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book.populate('author') })

      return book.populate('author')
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author)
        return null
      author.born = args.setBornTo
      return author.save()
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'password') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: args.username,
        id: user._id,
        favoriteGenre: user.favoriteGenre
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers