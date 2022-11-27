import { useRouter } from 'next/dist/client/router'
import {Auth} from 'aws-amplify'



function ComponentHome () {
  const router = useRouter()


  function handleLogout() {
        Auth.signOut()
            .then((data) => {
              router.push({
                pathname: "/",
              }); 
            })
            .catch((err) => {
                this.setState({ isSigningOut: false });
                console.log(err);
            });
    }


  return (
    <div>
       <button onClick={() => handleLogout()} className="bg-black w-[100px] h-[100px]"> sair </button>
    </div>
  )
}

export default ComponentHome 