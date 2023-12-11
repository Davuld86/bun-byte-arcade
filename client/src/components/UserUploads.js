import React, { useEffect, useState } from 'react'
import NoneFound from './NoneFound'
import GameContainer from './GameContainer'
import UploadedGamesContainer from './UploadedGamesContainer'

export default function UserUploads() {
  const id = window.location.pathname.slice(9)
  const [logged, setLogged]= useState(null)
  const [user, setUser] = useState(null)
  const [error, setError]= useState(null)
  const [games, setGames] = useState(null)
  const [loaded, setLoaded] = useState(null)

  useEffect(() => {
    fetch("/check_session").then((r) => {
     if (r.ok) {
       r.json().then((log) => setLogged(log));
     }
     else{
         setLogged(0)
     }
   })
   fetch(`/user/${id}`).then((r) => {
     if (r.ok) {
       r.json().then((user) => {setUser(user); setGames(user.posts?user.posts:null)});
     }
     else{
      setUser(0)
     }
 }).then(setLoaded(true))

   }, []);

if(loaded){
  if(user==0){
    return(
    <NoneFound text={'This user does not exist'} image={'../images/no_category.png'}/>
    )
  }
  else if(user){
    return (
    <div className='game-container'>
      <h1>Games Created by {user.username}:</h1>
      {logged?<UploadedGamesContainer games={user.posts} user={user.id} logged={logged.id}/>: null}
    </div>
    )
  }
  else if(user&&user.posts==[]){
    return(
      <NoneFound text={`${user.username} has not posted any games`} image={'../images/games_missing.png'}/>
    )
  }

}

}
