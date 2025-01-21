import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import '../App.css';
import Navbar from '../components/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css'
import { InputGroup, FormControl, Button, Row, Card, Container, CardTitle, Modal } from 'react-bootstrap';
import { useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';

export default function List() {
    const {user} = useContext(UserContext)
    const [accessToken, setAccessToken] = useState("")
    const [list, setList] = useState({
          
        })

    useEffect(() => {
    var authParameters = {
        method: 'POST', 
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + import.meta.env.VITE_CLIENT_ID + '&client_secret=' + import.meta.env.VITE_CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
        .then(result => result.json())
        .then(data => setAccessToken(data.access_token))
    }, [])

    const getUserList = async (e) => {
        e.preventDefault()
        try{
          const { data: list } = await axios.post('/getFromList', { userId: user.id })
          if(list.error){
            toast.error(list.error)
            console.log(list.error)
          }
          else{
            setList(list)
            console.log(list)
          }
          console.log(list)
        } catch (error) {
            console.log(error)
        }
      }


    return (
        <>
        <Navbar />
        <Container>
        <div>
            {!!user && (<h1>{user.username}</h1>)}
        </div>
        <Button onClick={getUserList}>Get List</Button>
        </Container>
        </>
    )
}