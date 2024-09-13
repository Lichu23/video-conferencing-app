import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SingInPage = () => {
  return (
    <main className="flex flex-center h-screen w-full">
        <SignIn />
    </main>
  )
}

export default SingInPage