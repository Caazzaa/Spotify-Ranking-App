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
  const { user } = useContext(UserContext);
  const [accessToken, setAccessToken] = useState("");
  const [list, setList] = useState([]);
  const [albumIDs, setAlbumIDs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const HEADERS = ["Album", "Artist", "Year"];

  // Fetch access token on component mount
  useEffect(() => {
      const fetchAccessToken = async () => {
          const authParameters = {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: 'grant_type=client_credentials&client_id=' + import.meta.env.VITE_CLIENT_ID + '&client_secret=' + import.meta.env.VITE_CLIENT_SECRET
          };
          const result = await fetch('https://accounts.spotify.com/api/token', authParameters);
          const data = await result.json();
          setAccessToken(data.access_token);
      };

      fetchAccessToken();
  }, []);

  // Fetch user list and albums when user or accessToken changes
  useEffect(() => {
      const fetchUserListAndAlbums = async () => {
          if (!user || !user.id || !accessToken) return;

          try {
              const { data: list } = await axios.post('/getFromList', { userId: user.id });
              if (list.error) {
                  toast.error(list.error);
                  console.log(list.error);
              } else {
                  setList(list);
                  const albumIDs = list.map(item => item.albumID);
                  setAlbumIDs(albumIDs);
              }
          } catch (error) {
              console.log(error);
          }
      };

      fetchUserListAndAlbums();
  }, [accessToken]);

  // Fetch album details when albumIDs change
  useEffect(() => {
      const fetchAlbums = async () => {
        if (albumIDs.length === 0 || !accessToken) {
            console.log("No album IDs or access token available.");
            return;
        }

        const validAlbumIDs = albumIDs.filter(id => id && typeof id === 'string');
        if (validAlbumIDs.length === 0) {
            console.log("No valid album IDs found.");
            return;
        }

        const albumsArray = [];
        for (let i = 0; i < validAlbumIDs.length; i++) {
            try {
                const albumID = validAlbumIDs[i];
                console.log(`Fetching album ${albumID}...`);
                const response = await fetch(`https://api.spotify.com/v1/albums/${albumID}`, {
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch album ${albumID}: ${response.statusText}`);
                }

                const album = await response.json();
                if (album) {
                    albumsArray.push(album);
                }
                // Add a delay between requests to avoid rate limiting
                if (i > validAlbumIDs.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 300000)); // 500ms delay
                }
            } catch (error) {
                console.log(albumsArray);
                console.error(error);
            }
        }

        if (albumsArray.length > 0) {
            setAlbums(albumsArray);
        }
    };

    fetchAlbums();
}, [albumIDs]);

  return (
      <>
          <Navbar />
          <Container>
              <div>
                  {!!user && (<h1>{user.username}</h1>)}
              </div>
              <table className="w-full min-w-max table-auto text-left">
                  <thead>
                      <tr>
                          {HEADERS.map((head) => (
                              <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
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
              </table>
          </Container>
      </>
  );
}