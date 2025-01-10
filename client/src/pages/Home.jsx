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

export default function Home() {
  const {user} = useContext(UserContext)
  const [searchInput, setSearchInput] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [albums, setAlbums] = useState([]) 
  const [albumDetails, setAlbumDetails] = useState([])
  const [show, setShow] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const handleClose = () => {
    setAlbumDetails([]);
    setShow(false);

  };
  const handleShow = (albumId) => {
    getAlbumDetails(albumId);
    setShow(true);
  };

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
        setAlbums(data.items);
      });
  }

  async function getAlbumDetails(albumID) {

    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    setWaiting(true);
    var albumDetails = await fetch('https://api.spotify.com/v1/albums/' + albumID, searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAlbumDetails(data);
        setWaiting(false);
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
    <>
      <Navbar />
        <Container>
          <div>
            {!!user && (<h1>{user.username}</h1>)}
          </div>
          <InputGroup className='mb-3' size='lg'>
            <FormControl
              placeholder='Search Artist'
              type='input'
              onKeyDown={event => { if (event.key === "Enter") { search(); } } }
              onChange={event => setSearchInput(event.target.value)} />
            <Button onClick={() => { search(); } }>
              Search
            </Button>
          </InputGroup>
        </Container>
        <Container>
          <Row className='mx-2 row row-cols-4'>
            {albums.map((album, i) => {
              return (
                <Card key={i} bg='dark' text='white'>
                  <Card.Img src={album.images[0].url} />
                  <Card.Body>
                    <Card.Title>{album.name}</Card.Title>
                    <Card.Text>{album.artists[0].name}</Card.Text>
                    <Card.Text>{album.release_date}</Card.Text>
                    <Button variant='primary' onClick={() => addToList(album.id)}>Add to List</Button>
                    <Button variant='primary' onClick={() => handleShow(album.id)}>Show Album ID</Button>
                  </Card.Body>
                </Card>
              );
            })}
            {waiting && (
              <Modal show={true} backdrop="blur" centered={true} dialogClassName="fade-in-slower">
                <Modal.Header>
                  <Modal.Title>Loading...</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Please wait while we fetch the album details.</p>
                </Modal.Body>
              </Modal>
            )}
            <Row className='mx-2 row row-cols-4'>
              <Modal show={show} onHide={handleClose} backdrop="blur" centered={true} dialogClassName="fade-in-slower">
                <Modal.Header closeButton style={{ backgroundColor: 'gray' }}>
                  <div className="image-container">
                    <img src={albumDetails.images && albumDetails.images[0].url} />
                  </div>
                  <Modal.Title>{albumDetails.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: 'gray' }}>
                  <p>Artist: {albumDetails.artists && albumDetails.artists[0].name}</p>
                  <p>Release Date: {albumDetails.release_date}</p>
                  <p>Total Tracks: {albumDetails.total_tracks}</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </Row>
          </Row>
        </Container>
      </>
  )
}
