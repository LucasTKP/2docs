import { getAuth } from '../sdkFirebase'

export default async function CreateUser(req, res) {
    const user = await getAuth().getUser(req.body.uid)
    if (user.customClaims.admin) {
      try {
        const response = await getAuth()
        .createUser({
            email: req.body.data.email,
            password: req.body.data.password
        })
        return res.json(response)
      } catch (e) {
        return res.json(e)
      }
    } else {
      res.json({error: 'Usuario não permitido'})
    }
}