'use client'
import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify'; 

async function EnableFiles(props) {
    const files = props.files
    const selectFiles = props.selectFiles
    const folders = props.folders

      try{
        for(let i = 0; i < selectFiles.length; i++){
          if(folders.includes(selectFiles[i].folder === false)){
            folders.push({name: selectFiles[i].folder, color: "#BE0000"})
            await updateDoc(doc(db, 'users', selectFiles[i].id_user), {
              folders: folders
            })
          }
          await updateDoc(doc(db, 'files', selectFiles[i].id_file), {
            trash: false
          })
          const index = files.findIndex(file => file.id_file === selectFiles[i].id_file)
          files.splice(index, 1);
        } 
        props.ResetConfig(files)
        toast.success("Seu arquivo foi recuperado.")
    }catch(e) {
        console.log(e)
        toast.error("Não Foi possivel recuperar este arquivo.")
    }
}

export default EnableFiles