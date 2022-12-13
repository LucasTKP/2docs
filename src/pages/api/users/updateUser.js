import { getAuth } from '../sdkFirebase'

export default async function updateUser(req, res) {
    const user = await getAuth().getUser(req.body.uid)
    if (user.customClaims.admin) {
      try {
        const response = await getAuth()
        .updateUser(req.body.userId, {
            email: req.body.data.email
        })
        return res.json(response)
      } catch (e) {
        return res.json(e)
      }
    }
}