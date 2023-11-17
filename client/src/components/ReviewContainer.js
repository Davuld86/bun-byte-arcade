import React from 'react'
import ReviewForm from './ReviewForm'
import Review from './Review'
import { useState, useEffect } from 'react'

export default function ReviewContainer({gameID, game}) {
    const [user, setUser] = useState(null)
    const[reviews, setReviews] = useState(game.reviews)

    useEffect(() => {
      fetch("/check_session").then((r) => {
        if (r.ok) {
          r.json().then((user) => setUser(user));
        }
      });
    }, []);

    function handleSubmit(review){
      let temp =  {
            'score' : parseInt(review.score),
            'comment': review.comment,
            'user_id' : user.id,
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
                r.json().then((d)=> setReviews([d,...reviews]))
            }
            else{
             r.json().then((d)=> alert(d.error))
            }
          })
    }

    function handleDelete(review){
        fetch(`/review/${review.id}`, {
            method: 'DELETE'
        }).then(setReviews((reviews)=> reviews.filter((rev)=>rev.id!=review.id)))

    }

  return (
    <div className='reviewContainer'>
        ReviewContainer
        {reviews.filter((rev)=>rev.user_id == user.id)? null:<ReviewForm handleSubmit={handleSubmit}/>}
        <h3>{reviews.length} Review{reviews.length>1?'s':''}</h3>
        {reviews&&user?reviews.map((review)=><Review handleDelete={handleDelete} userID={user.id} key={review.id} review={review}/>):null}
    </div>
  )
}
