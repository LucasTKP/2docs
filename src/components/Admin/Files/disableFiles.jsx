'use client'
import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify'; 

async function DisableFiles(props) {
    const files = props.files
    const selectFiles = props.selectFiles
      try{
        for(let i = 0; i < selectFiles.length; i++){
          await updateDoc(doc(db, 'files', selectFiles[i].id_file), {
            trash: true
          })
          const index = files.findIndex(file => file.id_file === selectFiles[i].id_file)
          files.splice(index, 1);
        } 
        props.ResetConfig(files)
        toast.success("Seu arquivo foi movido para lixeira.")
    }catch(e) {
        console.log(e)
        toast.error("Não Foi possivel excluir este arquivo.")
    }
}

export default DisableFiles