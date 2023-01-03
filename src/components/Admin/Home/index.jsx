import { auth, db } from '../../../../firebase'
import { collection, where, getDocs, query, doc, updateDoc } from "firebase/firestore";
import Image from 'next/image';
import { useEffect, useState } from 'react'
import styles from './home.module.css'
import { toast } from 'react-toastify';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';


function ComponentHome () {
  const [urlImage, setUrlImage] = useState()
  const [gb, setGb] = useState()
  const [gbPorcentage, setGbPorcentage] = useState("w-[1%]")
  const [recentsFile, setRecentsFile] = useState([])
  const [data, setData] = useState({contact:[], question:[]})

   useEffect(() => {
    GetUsers()
    GetFiles()
  },[])

  async function GetUsers(){
    const q = query(collection(db, "users"), where("email", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUrlImage(doc.data().image)
    });
  }

  async function GetFiles(){
    const getFiles = []
    var q = query(collection(db, "files"))
      const querySnapshot = await getDocs(q);
      const a = querySnapshot.forEach((doc) => {
        getFiles.push(doc.data())
      }); 
    CalculatingGb(getFiles)
    FilterDate(getFiles)
    GetContact()
  }

  function CalculatingGb(files){
    const gbAll = 5000000
    var numbers = 0
    for(var i = 0; i < files.length ; i++){
      numbers = numbers + files[i].size
    }
    const porcentage = "w-[" +  Math.ceil((numbers * 100) / gbAll) + "%]"
    setGbPorcentage(porcentage)
    setGb(Math.floor(numbers / 1000000))
  }
  
  async function FilterDate(getFiles){
    const filesHere = [...getFiles].filter(file => file.trash === false && file.from === "user")
    const recents = []
    filesHere.sort(function(a,b) { 
      a.date = new Date(a.date)
      b.date = new Date(b.date)
      return (a.date.getTime() - b.date.getTime()) + ""
    });
    for (var i = 0; 5 > i && i < (filesHere.length); i++) {
      recents.push(filesHere[i])
    }
    setRecentsFile(recents)
  }

  async function GetContact(){
    const q = query(collection(db, "data"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setData({...data, contact:doc.data().contact, id:doc.data().id, question:doc.data().question, response: doc.data().response})
    });
  }

  function ChangeContact(content){
    const contacts = [...data.contact]
    contacts[content.index] = content.text
    setData({...data, contact:contacts})
  }

  const phoneMask = (value) => {
    if(value != undefined){
      return value
      .replaceAll("(", "")
      .replaceAll("(", "")
      .replaceAll("-", "")
      .replaceAll("-", "")
      .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
      .replace(/^(\d{2})(\d)/g,"($1) $2")
      .replace(/(\d)(\d{4})$/,"$1-$2")// captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
    }
    return ""

  }

  async function UpdateBdContact(){
    await updateDoc(doc(db, 'data', data.id.trim()), {
      contact: data.contact
    })
    .then(() => {
      toast.success("As informações foram salvas com sucesso.")
    })
    .catch((e) => {
      console.log(e)
      toast.success("Não foi possivel alterar as informações.")
    }) 
  }

  function ChangeQuestion(content){
    var question = [...data.question]
    if(question[content.index] === undefined){
      question.push({question:content.text, response: ""})
    } else {
      question[content.index].question = content.text
    }
    setData({...data, question:question})
  }

  function ChangeResponse(content){
    var question = [...data.question]
    question[content.index].response = content.text
    setData({...data, question:question})
  }

  async function UpdateBdQuestion(){
    await updateDoc(doc(db, 'data', data.id.trim()), {
      question: data.question
    })
    .then(() => {
      toast.success("As informações foram salvas com sucesso.")
    })
    .catch((e) => {
      console.log(e)
      toast.success("Não foi possivel alterar as informações.")
    }) 
  }

  return (
    <div className="bg-primary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black">
      <div className='w-[85%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]'>
        {urlImage != undefined ? <Image src={urlImage} alt="Logo da empresa" width={100} height={100} className="max-lg:w-[90px] max-lg:h-[90px] max-md:w-[80px] max-md:h-[80px] max-sm:w-[70px] max-sm:h-[70px] rounded-full absolute right-[20px]"/> : <></>}
        <p  className=' font-poiretOne text-[40px] max-sm:text-[35px]'>Home</p>
        <p  className='text-[18px] flex mx-[5px] text-secondary'>Home</p> 
        <p  className=' font-poiretOne mt-[20px] text-[40px] max-sm:text-[35px]'>Uso</p>
        <div className='flex items-center gap-[30px] max-md:gap-[10px]'>
          <div className='w-[250px] h-[15px] bg-hilight border-[2px] border-black rounded-[4px]'>
          <div className={`${gbPorcentage} h-full bg-[#BB8702]`}/>
          </div>
          <p  className='text-[40px] max-lg:text-[30px] max-md:text-[25px] text-[#686868] font-[600]'><span className='text-[#BB8702]'>{gb}</span>Gb/<span className='text-secondary'>5</span>Gb</p>
        </div>

        <div className='flex gap-[30px] max-md:gap-[10px] flex-wrap mt-[20px]'>
          <div>
            <p  className='font-poiretOne text-[40px] max-sm:text-[35px] '>Uploads Recentes</p>
            <div  className='border-[2px] border-secondary w-[300px] h-[200px] pr-[5px] rounded-[12px]'>
              <div id={styles.boxFiles} className='h-full overflow-y-scroll pb-[5px] px-[5px]'>
                {recentsFile.length > 0 ?
                recentsFile.map((file) =>{
                    return(
                      <div key={file.id_file} className="flex items-center gap-[10px] mt-[10px] h-[50px]">
                        <Image src={`/icons/${file.type}.svg`} alt="Imagem simbolizando o tipo de arquivo" width={80} height={80} className="w-[40px] h-[40px]"/>
                        <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{file.name}</p>
                      </div>
                    )
                  })
                : <></>}
              </div>
            </div>
          </div>

          <div>
            <p  className='font-poiretOne text-[40px] max-sm:text-[35px] '>Contato</p>
            <div className='border-[2px] border-secondary w-[300px] h-[200px] pr-[5px] rounded-[12px]'>
              <div id={styles.boxFiles} className='h-full overflow-y-scroll px-[5px] flex flex-col'>
                <div className="flex items-center gap-[10px] mt-[10px] h-[50px]">
                  <Image src={`/icons/whatsapp.svg`} alt="Imagem simbolizando o tipo de arquivo" width={80} height={80} className="w-[40px] h-[40px]"/>
                  <input  maxLength={15} type="text" value={phoneMask(data.contact[0])} onChange={(text) => ChangeContact({index:0, text:text.target.value})} className='border-black border-[2px] outline-none rounded-[8px] bg-transparent text-[20px] overflow-hidden whitespace-nowrap text-ellipsis pl-[5px]'/>
                </div>

                <div className="flex items-center gap-[10px] mt-[10px] h-[50px]">
                  <Image src={`/icons/whatsapp.svg`} alt="Imagem simbolizando o tipo de arquivo" width={80} height={80} className="w-[40px] h-[40px]"/>
                  <input  maxLength={15} type="text" value={phoneMask(data.contact[1])} onChange={(text) => ChangeContact({index:1, text:text.target.value})} className='border-black border-[2px] outline-none rounded-[8px] bg-transparent text-[20px] overflow-hidden whitespace-nowrap text-ellipsis pl-[5px]'/>
                </div>

                <div className="flex items-center gap-[10px] mt-[10px] h-[50px]">
                  <Image src={`/icons/whatsapp.svg`} alt="Imagem simbolizando o tipo de arquivo" width={80} height={80} className="w-[40px] h-[40px]"/>
                  <input  maxLength={15} type="text" value={phoneMask(data.contact[2])} onChange={(text) => ChangeContact({index:2, text:text.target.value})} className='border-black border-[2px] outline-none rounded-[8px] bg-transparent text-[20px] overflow-hidden whitespace-nowrap text-ellipsis pl-[5px]'/>
                </div>

                <button onClick={() => UpdateBdContact()} className="flex rounded-[8px] text-[20px] items-center mt-[10px] h-[50px] px-[5px] bg-greenV/20 border-[2px] border-greenV text-greenV self-center mb-[10px]" >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>

        <p  className='font-poiretOne mt-[20px] text-[40px] max-sm:text-[35px] '>Dúvidas Frequentes</p>
        <div className='border-[2px] border-secondary w-[400px] max-lsm:w-[330px] h-[200px] p-[10px] rounded-[12px]'>
          <div id={styles.boxFiles} className='overflow-y-scroll h-full px-[5px] flex flex-col'>
            <div className="flex items-center gap-[5px] mt-[10px]">
              <QuestionMarkCircledIcon className="w-[40px] h-[40px]"/>
              <div className='border-black border-[2px] rounded-[8px] p-[5px] w-[90%]'>
                <input type="text" value={data.question.length > 0  ? data.question[0].question : ""} onChange={(text)  => ChangeQuestion({index:0, text:text.target.value})} className='w-full border-b-black border-b-[2px] outline-none bg-transparent text-[18px] overflow-hidden whitespace-nowrap text-ellipsis pl-[5px]'/>
                <input type="text" value={data.question.length > 0 ? data.question[0].response : ""} onChange={(text)  => ChangeResponse({index:0, text:text.target.value})} className='w-full border-b-black border-b-[2px] outline-none bg-transparent text-[18px] overflow-hidden whitespace-nowrap text-ellipsis pl-[5px]'/>
              </div>
            </div>

            <div className="flex items-center gap-[5px] mt-[10px]">
              <QuestionMarkCircledIcon className="w-[40px] h-[40px] "/>
              <div className='border-black border-[2px] rounded-[8px] p-[5px] w-[90%]'>
                <input type="text" value={data.question[1] ? data.question[1].question : ""} onChange={(text)  => ChangeQuestion({index:1, text:text.target.value})} className='w-full border-b-black border-b-[2px] outline-none bg-transparent text-[18px] overflow-hidden whitespace-nowrap text-ellipsis pl-[5px]'/>
                <input type="text" value={data.question[1] ? data.question[1].response : ""} onChange={(text)  => ChangeResponse({index:1, text:text.target.value})} className='w-full border-b-black border-b-[2px] outline-none bg-transparent text-[18px] overflow-hidden whitespace-nowrap text-ellipsis pl-[5px]'/>
              </div>
            </div>

            <div className="flex items-center gap-[5px] mt-[10px]">
              <QuestionMarkCircledIcon className="w-[40px] h-[40px]"/>
              <div className='border-black border-[2px] rounded-[8px] p-[5px] w-[90%]'>
                <input type="text" value={data.question[2] ? data.question[2].question : ""} onChange={(text)  => ChangeQuestion({index:2, text:text.target.value})} className='w-full border-b-black border-b-[2px] outline-none bg-transparent text-[18px] overflow-hidden whitespace-nowrap text-ellipsis pl-[5px]'/>
                <input type="text" value={data.question[2] ? data.question[2].response : ""} onChange={(text)  => ChangeResponse({index:2, text:text.target.value})} className='w-full border-b-black border-b-[2px] outline-none bg-transparent text-[18px] overflow-hidden whitespace-nowrap text-ellipsis pl-[5px]'/>
              </div>
            </div>
            <button onClick={() => UpdateBdQuestion()} className="flex rounded-[8px] text-[20px] items-center mt-[10px] h-[50px] px-[5px] bg-greenV/20 border-[2px] border-greenV text-greenV self-center" >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComponentHome 