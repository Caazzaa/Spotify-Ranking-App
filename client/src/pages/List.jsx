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
    const [list, setList] = useState({})
    const [albumIDs, setAlbumIDs] = useState([])
    const [albums, setAlbums] = useState([])
    const HEADERS = ["Album", "Artist", "Year"];

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
      try {
        const { data: list } = await axios.post('/getFromList', { userId: user.id })
        if (list.error) {
          toast.error(list.error)
          console.log(list.error)
        } else {
          setList(list)
          console.log(list)
        }
        const albumIDs = list.map(item => item.albumID);
        setAlbumIDs(albumIDs);
        console.log(albumIDs);
      } catch (error) {
        console.log(error)
      }

      setAlbums([]);
    }

    useEffect(() => {
      const fetchAlbums = async () => {
        setAlbums([]);
        for (const albumID of albumIDs) {
          var album = await fetch('https://api.spotify.com/v1/albums/' + albumID, {
            headers: {
              'Authorization': 'Bearer ' + accessToken
            }
          })
            .then(response => response.json())
            .catch(error => console.log(error));

          if (album) {
            setAlbums(prevAlbums => [...prevAlbums, album]);
          }
        }
        console.log(albums);
      };

      if (albumIDs.length > 0) {
        fetchAlbums();
      }
    }, [albumIDs, accessToken]);


    useEffect(() => {
      const fetchUserListAndAlbums = async () => {
      try {
        const { data: list } = await axios.post('/getFromList', { userId: user.id });
        if (list.error) {
        toast.error(list.error);
        console.log(list.error);
        } else {
        setList(list);
        console.log(list);
        }
        const albumIDs = list.map(item => item.albumID);
        setAlbumIDs(albumIDs);
        console.log(albumIDs);
      } catch (error) {
        console.log(error);
      }

      setAlbums([]);
      };

      if (user && user.id) {
      fetchUserListAndAlbums();
      }
    }, [user]);

    return (
      <>
      {/* <table className="w-full min-w-max table-auto text-left">
      <thead>
        <tr>
        {HEADERS.map((head) => (
          <th
          key={head}
          className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
          >
            {head}
          </th>
        ))}
        </tr>
      </thead>
      <tbody>
        {albums.map((album, index) => {
        const isLast = index === albums.length - 1;
        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
   
        return (
          <tr key={album.name}>
          <td className={classes}>
            {album.name}
          </td>
          <td className={classes}>
            {album.artists[0].name}
          </td>
          <td className={classes}>
            {album.release_date}
          </td>
          <td className={classes}>
            Edit
          </td>
          </tr>
        );
        })}
      </tbody>
      </table> */}
      <Navbar />
      <Container>
      <div>
        {!!user && (<h1>{user.username}</h1>)}
      </div>
      </Container>
      </>
    )
}