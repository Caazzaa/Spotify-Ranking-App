import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { InputGroup, FormControl, Button, Row, Card, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
// import Form from '../components/Form'
import * as React from 'react';

export default function Login() {
  const navigate = useNavigate()
  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const loginUser = async (e) => {
    e.preventDefault()
    const {email, password} = data
    try{
      const {data} = await axios.post('/login', {email, password})
      if(data.error){
        toast.error(data.error)
      }
      else{
        setData({})
        navigate('/')
      }
    } catch (error) {

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
                      <label className='text-lg font-medium mt-4'>Email</label>
                      <input className="w-full border-2 border-gray-200 rounded-xl p-3 mt-1 bg-transparent" type='text' placeholder='Email' value={data.email} onChange={(e) => setData({...data, email: e.target.value})} />
                  </div>
                  <div>
                      <label className='text-lg font-medium mt-4'>Password</label>
                      <input className="w-full border-2 border-gray-200 rounded-xl p-3 mt-1 bg-transparent" type='password' placeholder='Password' value={data.password} onChange={(e) => setData({...data, password: e.target.value})} />
                  </div>
                  <div className='flex justify-between items-center mt-4'>
                      <div>
                          <input className="" type='checkbox' id='remember'/>
                          <label className="ml-2 font-medium text-base" htmlFor='remember'>Remember me!</label>
                      </div>
                      <button className='hover:text-purple-700 font-medium text-base'>Forgot password?</button>
                  </div>
                  <div className='mt-8 flex flex-col gap-y-4'>
                      <button onClick={loginUser} className='hover:bg-purple-800 active:scale-[.98] active:duration-75 transition-all py-3 rounded-xl bg-purple-700 text-white text-lg font-bold'>Login</button>
                  </div>
                  <div className='flex items-center mt-4'>
                  <p className='mx-2'>Don't have an account?</p>
                  <Link className='hover:text-purple-700 font-medium text-base' to="/register">Create an account</Link>
                  </div>
              </div>
          </div>
        </div>
        <div>

        </div>
      </div>
  )
}
