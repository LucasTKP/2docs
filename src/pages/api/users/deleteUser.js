import { getAuth } from '../sdkFirebase'

  export default async function DeleteUser(req, res) {
    const user = await getAuth().getUser(req.body.uid)
    if (user.customClaims.admin) {
      if(req.body.users.length === 1){
        try{
          const result = await getAuth().deleteUser(req.body.users[0])
          res.json({type: "success"})
        } catch (err){
          res.json(err)
        }
        
      } else if (req.body.users.length > 1){
        try{
          const result = await getAuth().deleteUsers(req.body.users)
          res.json({type: "success"})
        } catch (err){
          res.json(err)
        }
      }
    }
  }