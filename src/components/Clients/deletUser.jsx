import React, {useState, useContext, useEffect} from 'react'
import { ref, deleteObject} from "firebase/storage";
import {db, auth, storage } from '../../../firebase'
import { doc, deleteDoc } from "firebase/firestore";
import axios from 'axios'

async function deletUser({childToParentDelet, selectUsers, usersFilter}) {
    DeleteAuth()
      async function DeleteAuth(){
        const domain = new URL(window.location.href).origin
        const result = await axios.post(`${domain}/api/users/deleteUser`, {users: selectUsers, uid: auth.currentUser.uid})
        if(result.data.type === 'success'){
          DeletePhoto()
        } else {
            childToParentDelet(result)
        }
      }
    
      async function DeletePhoto(){
          try{
            for(let i = 0; i < selectUsers.length; i++){
              if(selectUsers[i].nameImage != "padrao.png"){
                const desertRef = ref(storage, 'images/' + selectUsers[i].nameImage);
                const result = await deleteObject(desertRef )
              }
            }
            DeleteFile()
          } catch(e){
            console.log(e)
          }
      }
    
      async function DeleteFile(){
        const users = [...usersFilter]
        for(let i = 0; i < selectUsers.length; i++){
          const result = await deleteDoc(doc(db, "users", selectUsers[i].id));
          const index = users.findIndex(user => user.id === selectUsers[i].id)
          users.splice(index, 1);
        }
        childToParentDelet(users)
      }
    
}

export default deletUser