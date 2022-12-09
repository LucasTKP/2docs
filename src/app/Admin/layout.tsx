'use client'
import NavBar from '../../components/NavBar'
import React, {useState, useContext, useEffect} from 'react'
export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode,
  }) {

    return (
      <section>
        <NavBar />
        <main>{children}</main>
      </section>
    );
  }