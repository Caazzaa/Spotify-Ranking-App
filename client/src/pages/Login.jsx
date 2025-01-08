import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { InputGroup, FormControl, Button, Row, Card, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div>
      <Container>
        <Row className='mx-2 row row-cols-2 h-50'>
        <div class="card">
        <Card class='card'>
        <Card.Body>
        <Card.Title>
          <form onSubmit = { loginUser }>
            <label>Email</label>
            <input type='text' placeholder='Email' value={data.email} onChange={(e) => setData({...data, email: e.target.value})} />
            <label>Password</label>
            <input type='password' placeholder='Password' value={data.password} onChange={(e) => setData({...data, password: e.target.value})} />
            <button type='submit' >Submit</button>
          </form>
          </Card.Title>
        </Card.Body>
        </Card>
        </div>
        </Row>
      </Container>
    </div>
  )
}
