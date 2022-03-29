import express from 'express'
import bcrypt from 'bcrypt'
import { createUser } from '../helper.js'

const router = express.Router()

async function genPassword(password) {
  const salt = await bcrypt.genSalt(10)
  const hashpassword = await bcrypt.hash(password, salt)

  return hashpassword
}

//REGISTER
router.post('/register', async (req, res) => {
  const { username, email, password } = request.body
  const hashPassword = await genPassword(password)
  const newUser = {
    username: username,
    email: email,
    password: hashPassword,
  }
  const result = await createUser(newUser)
  res.send(result)
})

//LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = request.body

  // db.users.findOne({username: "tamil"})
  const userFromDB = await getUserByName(username)
  // username if exist, getuserByName returns userdetails otherwise it return null

  //console.log(userFromDB);

  // response.send(userFromDB)

  // if userFormDB is null
  if (!userFromDB) {
    res.status(401).send({ message: 'Invalid credentials' })
  }
  // if userFormDB is not null
  else {
    const storedPassword = userFromDB.password // hashed password (from db)

    const isPasswordMatch = await bcrypt.compare(password, storedPassword)
    // comparing user entered password and storedpassword, and it returns true or false

    // console.log("isPasswordMatch", isPasswordMatch);

    // if isPasswordMatch ture
    if (isPasswordMatch) {
      const token = jwt.sign({ id: userFromDB._id }, process.env.key)
      response.send({ message: 'Successfull login', token: token })
    }
    // else part
    else {
      response.status(401).send({ message: 'Invalid credentials' })
    }
  }
})

export const authRoute = router
