import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, 'Please add a firstname'],
    },
    lastname: {
      type: String,
      required: [true, 'Please add a lastname'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

export default User
export const userById = (id)=> User.findById(id)
export const userByEmail = (email)=> User.findOne({ email })
export const createUser = (data)=> User.create(data)

