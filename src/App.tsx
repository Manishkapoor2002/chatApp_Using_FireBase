import { useState, useRef } from "react"
import { Auth } from "./components/auth"
import Cookies from 'universal-cookie'
import { Chat } from "./components/Chat"
const cookies = new Cookies()
function App() {
  const [isAuth, setIsAuth] = useState<String | null>(cookies.get('auth-token'))
  const [room, setRoom] = useState<String | Number | null |undefined>("");
  const [username,setUsername] = useState<String | Number | null |undefined>("");
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
      setUsername(UsernameInputRef.current?.value)
    }
  }

  return <>
    <div>
      {
        room ? (<div>
          <Chat room={room} username={username}/>
          <button onClick={() => {
            cookies.set('auth-token', null);
            setIsAuth(null)
          }
            }>Log out </button>
        </div>)
    : (<div>
      <form onSubmit={handleSetRoom}>
        <label htmlFor="">Enter Room Name : </label>
        <input type="text" ref={roomInputRef} />
        <br />
        <br />
        <label htmlFor="" > Enter User Name</label>
        <input type="text"  ref={UsernameInputRef} />
        <br />
        <br />
          
        <button type="submit">Enter in Room</button>
      </form>
    </div>)
      }
  </div ></>

}

export default App
