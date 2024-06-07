import { useState, useRef } from "react"
import { Auth } from "./components/auth"
import Cookies from 'universal-cookie'
import { Chat } from "./components/Chat"
import { TextField, Button, Container, Typography, Box } from '@mui/material';
const cookies = new Cookies()


function App() {
  const [isAuth, setIsAuth] = useState<String | null>(cookies.get('auth-token'))
  const [room, setRoom] = useState<String | Number | null | undefined>("");
  const roomInputRef = useRef<HTMLInputElement | null>(null);
  const UsernameInputRef = useRef<HTMLInputElement | null>(null);

  if (!isAuth) {
    return (
      <>
        <Auth setIsAuth={setIsAuth} />
      </>
    )
  }
  const handleSetRoom = () => {
    if (roomInputRef.current) {
      setRoom(roomInputRef.current.value);
    }
  }

  return <>
    <div>
      {
        room ? (<div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: "center",
          alignItems: 'center'
        }}>
          <Chat room={room} />
          <button onClick={() => {
            cookies.set('auth-token', null);
            setIsAuth(null)
          }
          }>Log out </button>
        </div>)
          : (<Container
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              backgroundColor: '#f0f2f5',
            }}
          >
            <Box
              sx={{
                backgroundColor: '#fff',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '300px',
              }}
            >
              <form onSubmit={handleSetRoom}>
                <Typography variant="h6" gutterBottom>
                  Enter Room Name:
                </Typography>
                <TextField
                  inputRef={roomInputRef}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Enter Room
                </Button>
              </form>
            </Box>
          </Container>
      )
      }
    </div ></>

}

export default App
