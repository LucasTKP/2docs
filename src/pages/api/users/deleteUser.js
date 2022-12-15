import { getAuth } from '../sdkFirebase'

  export default async function DeleteUser(req, res) {
    const user = await getAuth().getUser(req.body.uid)
    if (user.customClaims.admin) {
      if(req.body.users.length === 1){
        try{
          const result = await getAuth().deleteUser(req.body.users[0].id)
          res.json({type: "success"})
        } catch (err){
          res.json(err)
        }
      } else if (req.body.users.length > 1){
        const idUsers = []
        for(var i = 0; i < req.body.users.length; i++){
          idUsers.push(req.body.users[i].id)
        }
        try{
          const result = await getAuth().deleteUsers(idUsers)
          res.json({type: "success"})
        } catch (err){
          res.json(err)
        }
      }
    }
  }