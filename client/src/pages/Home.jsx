import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import '../App.css';
import Navbar from '../components/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css'
import { InputGroup, FormControl, Button, Row, Card, Container, CardTitle } from 'react-bootstrap';
import { useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-quartz.css';

export default function Home() {
  // console.log(import.meta.env.VITE_CLIENT_ID)
  const {user} = useContext(UserContext)
  const [searchInput, setSearchInput] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [albums, setAlbums] = useState([]) 
  const columns = [
    { headerName: "", field: "images[0]" },
    { headerName: "Title", field: "name" },
    { headerName: "Artist", field: "artists" },
    { headerName: "Released", field: "release_date" },
    { headerName: "Type", field: "album_type" }
    // { headerName: "Popularity", field: "popularity" }
  ]

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

  async function search() {
    console.log("Search for " + searchInput);

    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id })

    console.log("Artist ID is " + artistID)
    var albums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=AU&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAlbums(data.items);
      });
  }

  const addToList = async (album) => {
    console.log('Adding album:', album);
    console.log('User:', user.id);
    try {
      const { data } = await axios.post('/addToList', { album, userId: user.id });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success('Album added successfully!');
        console.log('Album added:', data);
      }
    } catch (error) {
      console.error('Error adding album:', error);
    }
  }


  return (
    <div className="App">
      <Navbar />
        <Container>
          <div>
            {!!user && (<h1>{user.username}</h1>)}
          </div>
          <InputGroup className='mb-3' size='lg'>
            <FormControl
            placeholder='Search Artist'
            type='input' 
            onKeyDown={event => {if(event.key === "Enter") { search() }}}
            onChange={event => setSearchInput(event.target.value)}
            />
            <Button onClick={() => { search() }}>
              Search
            </Button>
          </InputGroup>
        </Container>
        <Container>
          <Row className='mx-2 row row-cols-4'>
            {albums.map((album, i) => {
              return (
                <Card key={i}>
                  <Card.Img src={album.images[0].url} />
                  <Card.Body>
                    <Card.Title>{album.name}</Card.Title>
                    <Card.Text>{album.artists[0].name}</Card.Text>
                    <Card.Text>{album.release_date}</Card.Text>
                    <Button variant='primary' onClick={() => addToList(album.id)}>Add to List</Button>
                  </Card.Body>
                </Card>
              )
            })}
          </Row>
        </Container>
    </div>
  )
}
