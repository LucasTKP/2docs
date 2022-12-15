'use client'
import NavBar from '../../components/NavBar'
import { onAuthStateChanged } from "firebase/auth";
import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '../../../firebase'

export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode,
  }) {
    const [onLoad, setOnLoad] = useState(false)
    const router = useRouter()

useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setOnLoad(true)
      }
    });
    },[])

    return (
      <section>
        {onLoad ? 
        <>
          <NavBar />
          <main>{children}</main>
        </>
        : <></>}
      </section>
    );
  }