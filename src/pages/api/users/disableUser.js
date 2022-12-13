import { getAuth } from '../sdkFirebase'

export default async function disableUser(req, res) {
    const user = await getAuth().getUser(req.body.uid)
    if (user.customClaims.admin) {

      try {
        for(var i = 0; i < req.body.users.length; i++){
          const response = await getAuth()
          .updateUser(req.body.users[i].idUser, {
              disabled: !req.body.users[i].option
          })
        }
        return res.json({type: "success"})
      } catch (e) {
        return res.json(e)
      }
    } else {
      res.json({error: 'Usuario não permitido'})
    }
    
}