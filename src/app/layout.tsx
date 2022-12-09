
'use client'
import {Poiret_One, Poppins } from '@next/font/google'
import { useEffect, useState } from 'react';
import "../../styles/globals.css";
import AppContext from '../components/AppContext'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../firebase'
import Loading from '../components/Loading'

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
const [loading, setLoading] = useState(false)

useEffect(() => {
  const page = window.location.pathname
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if(page === "/"){
        window.location.href = "/Admin"
      }
    } else {
      if(page != "/"){
        window.location.href = "/"
      }
    }
  });
},[children])

  return (
    <html>
      <head />
      <body className={`${poiretOne.variable} ${poppins.variable} text-white font-poppins`}>
      <AppContext.Provider value={{modalGlobal, setModalGlobal, actionCancel, setActionCancel, loading, setLoading}}>
          <Loading />
          {children}
      </AppContext.Provider>
      </body>
    </html>
  )
}
