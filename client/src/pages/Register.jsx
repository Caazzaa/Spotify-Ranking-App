import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';


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
    <div>
      <form onSubmit={ registerUser }>
        <label>Username</label>
        <input type='text' placeholder='Username' value={data.username} onChange={(e) => setData({...data, username: e.target.value})} />
        <label>Email</label>
        <input type='text' placeholder='Email' value={data.email} onChange={(e) => setData({...data, email: e.target.value})} />
        <label>Password</label>
        <input type='password' placeholder='Password' value={data.password} onChange={(e) => setData({...data, password: e.target.value})} />
        <button type='submit' >Submit</button>
      </form>
    </div>
  )
}
