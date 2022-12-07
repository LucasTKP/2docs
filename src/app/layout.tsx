
'use client'
import {Poiret_One, Poppins } from '@next/font/google'
import { useEffect, useState } from 'react';
import "../../styles/globals.css";
import AppContext from '../components/AppContext'
import { usePathname } from 'next/navigation';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../firebase'

const poiretOne = Poiret_One({
  display: 'swap',
  weight: ['400'],
  variable: '--font-poiretOne',
})

const poppins = Poppins({
  display: 'swap',
  weight: ['400'],
  variable: '--font-poppins',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

const [modalGlobal, setModalGlobal] = useState(false)
const [actionCancel, setActionCancel] = useState(false)

useEffect(() => {
  const page = window.location.pathname
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if(page === "/"){
        window.location.href = "/Admin"
        const uid = user.uid;
        console.log(uid)
      }
    } else {
      if(page != "/" || page == "/recoveryPassword"){
        window.location.href = "/"
      }
    }
  });
},[children])


  return (
    <html>
      <head />
      <body className={`${poiretOne.variable} ${poppins.variable} text-white font-poppins`}>
      <AppContext.Provider value={{modalGlobal, setModalGlobal, actionCancel, setActionCancel}}>
          {children}
      </AppContext.Provider>
      </body>
    </html>
  )
}
