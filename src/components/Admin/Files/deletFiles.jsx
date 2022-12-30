import { toast } from 'react-toastify';
import {db, storage} from '../../../../firebase'
import { doc,deleteDoc} from "firebase/firestore";  
import { ref, deleteObject} from "firebase/storage";

async function deletFiles(props) {
    const filesHere = props.files
    const selectFiles = props.selectFiles
    console.log(selectFiles.length)
    try{
        if(selectFiles.length > 0) {
          for(let i = 0; i < selectFiles.length; i++){
            const desertRef = ref(storage, 'files/' + selectFiles[i].id_file);
            const result = await deleteObject(desertRef)
            const response = await deleteDoc(doc(db, "files", selectFiles[i].id_file));
            const index = filesHere.findIndex(file => file.id_file === selectFiles[i].id_file)
            filesHere.splice(index, 1);
          }
          props.ResetConfig(filesHere)
          toast.success("Arquivo deletado com sucesso.")
        }
      } catch(e) {
        console.log(e)
        toast.error("Não Foi possivel deletar os arquivos.")
    }
}

export default deletFiles