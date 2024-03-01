import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import '../App.css';
// import 'bootstrap/dist/css/bootstrap.min.css'
import { InputGroup, FormControl, Button, Row, Card, Container } from 'react-bootstrap';
import { useState, useEffect} from 'react';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

export default function Home() {
  const {user} = useContext(UserContext)
  const [searchInput, setSearchInput] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [albums, setAlbums] = useState([]) 

  useEffect(() => {
    var authParameters = {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
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
    var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=AU&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAlbums(data.items);
      });
  }
  console.log(albums);
  return (
    <div className="App">
        <Container>
          <div>
            {!!user && (<h1>{user.username}</h1>)}
          </div>
          <InputGroup className='mb-3' size='lg'>
            <FormControl
            placeholder='Search Artist'
            type='input' 
            onKeyPress={event => {if(event.key == "Enter") { search() }}}
            onChange={event => setSearchInput(event.target.value)}
            />
            <Button onClick={() => { search() }}>
              Search
            </Button>
          </InputGroup>
        </Container>
        <Container>
          <Row className='mx-2 row row-cols-4'>
            {albums.map( (album, i) => {
              console.log(album);
              return (
                <Card>
                <Card.Img src ={album.images[0].url}/>
                <Card.Body>
                  <Card.Title>
                    {album.name}
                  </Card.Title>
                </Card.Body>
              </Card>
              )})}
          </Row>
        </Container>
    </div>
  )
}
