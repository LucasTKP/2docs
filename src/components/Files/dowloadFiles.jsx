import { db } from '../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';


async function DownloadsFile(props){
  const page = window.location.pathname
  const filesDownloaded = props.filesDownloaded
  const files = props.files
  if(filesDownloaded.length === 0) return toast.error("Selecione um arquivo para baixar.")
  toast.info("Baixando os arquivos...")
  for(var i = 0; i < filesDownloaded.length; i++){
    let blob = await fetch(filesDownloaded[i].url).then(r => r.blob());
    filesDownloaded[i].urlDownload = (window.URL ? URL : webkitURL).createObjectURL(blob)
  }
  try{
    for(let i = 0; i < filesDownloaded.length; i++) {
      const element = document.createElement("a");
      element.href = filesDownloaded[i].urlDownload
      element.download = filesDownloaded[i].name;

      document.body.appendChild(element);

      element.click();

      element.parentNode.removeChild(element);

      if(page.includes("Clientes")){
        await updateDoc(doc(db, 'files', filesDownloaded[i].id_file), {
          viwed: true
        })
        if(props.ResetConfig != undefined){
          const index = files.findIndex(file => file.id_file === filesDownloaded[i].id_file)
          files[index].checked = false
          files[index].viwed = true
        }
      } else {
        if(props.ResetConfig != undefined){
          const index = files.findIndex(file => file.id_file === filesDownloaded[i].id_file)
          files[index].checked = false
        }
      }
    }
      if(props.ResetConfig != undefined){
        props.ResetConfig(files)
      }
      toast.success("Arquivos baixados com sucesso.")
  } catch(e) {
    console.log(e)
    toast.error("Não foi possivél baixar os arquivos.")
  }
  }

  export default DownloadsFile