import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import EmbedGame from './EmbedGame';
import ReviewContainer from './ReviewContainer';
import CategoryBar from './CategoryBar';
import Loading from './Loading';

import './GamePage.css'


export default function GamePage() {
const gameID = Number(window.location.pathname.slice(6))
const [game, setGame] = useState(null)
const [error, setError] =useState(null)
const [user, setUser] = useState(null)
const [gameScore, setGameScore] = useState(0)
const [gameReviews, setGameReviews] = useState([])
const [favorited, toggleFavorite] = useState(false)
const [gameDate,setGameDate] = useState(null)
const [favTally, setTally] = useState(null)
const [isLoading, setLoading] = useState(true)

useEffect(() => {
    fetch(`/game/${gameID}/`).then((r) => {
      if (r.ok) {
        r.json().then((d)=> {
          setGame(d)
          setGameScore(d.score)
          setGameReviews(d.reviews)
          setTally(d.favorited_by.length)

          const date = new Date(d.release_date)
          setGameDate(date.toLocaleDateString())
        });
      }
      else{
        r.json().then((error)=> {setError(error);})
      }
    })
    .then(
        fetch("/check_session").then((r) => {
          if (r.ok) {
            r.json().then((user) => {
              setUser(user)
              checkFavorites(user)
              setLoading(false)
            });
          }
          else{
            setUser(0)
            setLoading(false)
          }

        })
      );
  }, []);

function checkFavorites(user){
  let fav = user.favorites.filter((fave)=> fave.id == gameID)
  fav[0]? toggleFavorite(true): toggleFavorite(false)
}

function updateScore(reviews, newReview){
  let sc = 0
  if (reviews.length==0){
    setGameScore(newReview.score)
    return newReview.score
  }
  else{
    reviews.forEach(review=>{

      sc+=parseInt(review.game_score)
    })
    sc+=parseInt(newReview.score)
    let ns= (sc/(reviews.length+1))
    setGameScore(ns)

    return parseInt(sc)
  }


}

function updateDelete(){
  let sc = 0
  if (gameReviews[0]){
    gameReviews.forEach((review)=>{
      sc= sc+review.game_score
    })
     sc = sc/(gameReviews.length)
  }
  else{
   sc=0
  }

  return parseInt(sc)
}

function handleSubmit(review){

  let temp =  {
        'score' : parseInt(review.score),
        'comment': review.comment,
        'user_id' : user.id,
        'game_score' : updateScore(gameReviews, review)
    }
    fetch(`/game/${gameID}/`,{
        method:'POST',
        headers:{
            'Content-Type': "application/json"
        },
        body: JSON.stringify(temp)
    }
    )
    .then((r)=> {
        if(r.ok){
            r.json().then((d)=> setGameReviews([d,...gameReviews]))
        }
        else{
         r.json().then((d)=> alert(d.error))
        }
      })
}

function handleDelete(review){
  fetch(`/review/${review.id}`, {
      method: 'DELETE'
  }).then(()=>{
    setGameReviews(gameReviews.filter((rev)=>rev.id!=review.id))
    setGameScore((prev)=>prev=updateDelete())
})

}

function handleFavorite(){
  toggleFavorite((prev)=> !prev)
  favorited? setTally((prev)=> prev= prev-1):setTally((prev)=> prev= prev+1)

  fetch(`/api/favorite_game/${user.id}/${game.id}`,{
    method: 'PATCH',
    headers:{
      'Content-type':'application/json'
    },
    body: JSON.stringify({
      user_id: user.id,
      game_id: gameID
    })
}).then((r) =>{
    if (r.ok){
      console.log('ok')
    }
  })

}
if(isLoading){
  return <Loading/>
}
if(game){

const creator = game.created_by
return (
    <div style={{display:'grid'}} className='game-page'>
        <div style={{display:'grid', justifyContent:'center'}} className='game-elements'>
        <h1>{game.title}</h1>
        <EmbedGame source={game.path}/>
        <span style={{display:'flex', justifyContent:'space-between'}} className=' game-attributes'>
        <p>Score: {gameScore} /5 </p>
        <p>Favorites: {favTally} </p>
        <p>Total plays: {game.playcount? game.playcount:0} </p>
        <p>Published: {gameDate} </p>
        </span>
        {user?<button onClick={()=>handleFavorite()}>{favorited?'Unfavorite':'Favorite'} Game</button>:null}
        <h4>Categories:</h4>
        <CategoryBar categories={game.categories}/>
        <h4>Description:</h4>
        {game.description?<p>{game.description}</p>:null}
        </div>

        <div className='developer'>
            <h3>Developed by:</h3>
            <Link to={`/user-account/${creator.id}`}>
            <h4>{creator.username}</h4>
            <img src={creator.pfp} style={{maxHeight:'60px',borderRadius:'50%'}}></img>
            </Link>
            {creator.bio?<p>{creator.bio}</p> :null}
            {creator.id ==user.id?<Link to={`/edit-game/${game.id}`}><button>Edit Game</button></Link>:null}
        </div>
        <ReviewContainer reviews={gameReviews} user={user} handleSubmit={handleSubmit} handleDelete={handleDelete}/>

    </div>
  )

}
else if(error){
    return(
        <div style={{display:'grid', justifyItems:'center'}}>
            <h1>{error? error.error:null}</h1>
        <img src='../images/no_game.png' style={{maxHeight:'500px'}}></img>
        <h2> This game does not exist.</h2>
        <Link to='/'>
        <button style={{height:'50px'}}>Back to homepage</button>
        </Link>
        </div>
    )
}
}
