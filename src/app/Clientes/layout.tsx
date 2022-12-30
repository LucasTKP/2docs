'use client'
import NavBar from '../../components/NavBar'
import { onAuthStateChanged } from "firebase/auth";
import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '../../../firebase'
import { collection, where, getDocs, query } from "firebase/firestore";

export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode,
  }) {
    const [onLoad, setOnLoad] = useState(false)
    const router = useRouter()
    const [urlImageProfile, setUrlImageProfile] = useState(null)

useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        auth.currentUser.getIdTokenResult().then((idTokenResult) => {
          if(idTokenResult.claims.admin){
            router.push("/Admin")
          } else {
            setOnLoad(true)
            GetUsers(user.email)
          }
        })
      } else {
        router.push("/")
      }
    });
    },[])

  async function GetUsers(email:string){
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUrlImageProfile(doc.data().image)
    });
  }

    return (
      <section>
        {onLoad ? 
        <>
          <NavBar image={urlImageProfile} user={"Clients"}/>
          <main>{children}</main>
        </>
        : <></>}
      </section>
    );
  }