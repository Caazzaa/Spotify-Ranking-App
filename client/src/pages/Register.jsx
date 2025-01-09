import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';


export default function Register() {
  const navigate = useNavigate()
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const registerUser = async (e) => {
    e.preventDefault();
    const {username, email, password} = data
    try {
      const {data} = await axios.post('/register', {username, email, password} )
      if(data.error){
        toast.error(data.error)
      }
      else{
        setData({})
        toast.success('Login Succesful. Welcome!')
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex items-center justify-center lg:w-1/2 bg-neutral-900" style={{boxShadow: '0 12px 24px rgba(0,0,0,0.5)'}}>
        <div className="bg-neutral-800 px-10 py-20 rounded-3xl border-2 border-gray-200">
            <h1 className='text-5xl font-semibold'>Welcome Back</h1>
            <p className='font-medium text-lg text-gray-100 mt-4'>Enter details to show your love for music!</p>
            <div>
                <div>
                    <label className='text-lg font-medium mt-4'>Username</label>
                    <input className="w-full border-2 border-gray-200 rounded-xl p-3 mt-1 bg-transparent" type='text' placeholder='Username' value={data.username} onChange={(e) => setData({...data, username: e.target.value})} />
                </div>
                <div>
                    <label className='text-lg font-medium mt-4'>Email</label>
                    <input className="w-full border-2 border-gray-200 rounded-xl p-3 mt-1 bg-transparent" type='text' placeholder='Email' value={data.email} onChange={(e) => setData({...data, email: e.target.value})} />
                </div>
                <div>
                    <label className='text-lg font-medium mt-4'>Password</label>
                    <input className="w-full border-2 border-gray-200 rounded-xl p-3 mt-1 bg-transparent" type='password' placeholder='Password' value={data.password} onChange={(e) => setData({...data, password: e.target.value})} />
                </div>
                <div className='mt-12 flex flex-col gap-y-4'>
                    <button onClick={registerUser} className='hover:bg-purple-800 active:scale-[.98] active:duration-75 transition-all py-3 rounded-xl bg-purple-700 text-white text-lg font-bold'>Register</button>
                </div>
                  <div className='flex items-center mt-4 mx-12'>
                    <p className='mx-2'>Already have an account?</p>
                    <Link className='hover:text-purple-700 font-medium text-base' to="/login">Login</Link>
                  </div>
            </div>
        </div>
      </div>
      <div>

      </div>
    </div>
  )
}
