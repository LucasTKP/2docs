import { getAuth } from '../sdkFirebase'

export default async function setAdmin(req, res) {
    const result = await getAuth().setCustomUserClaims(req.body.user, { admin: true })
    res.send({type: 'success'})

}