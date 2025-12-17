import React from 'react'

const ErrorPage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-base-300'>
        <h1 className='text-5xl font-bold text-error mb-4'>Oops!</h1>
        <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
            We cannot connect to  the server right now ,please try again after some time
        </p>
        <button className="btn btn-primary"
        onClick={()=>window.location.href='/'}>
            Retry Connection
        </button>
    </div>
  )
}

export default ErrorPage