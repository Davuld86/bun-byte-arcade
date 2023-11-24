import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

export default function Review({review, userID, handleDelete}) {
    const [user, setUser] = useState(null)
    useEffect(() => {
        fetch(`/user/${review.user_id}`).then((r) => {
          if (r.ok) {
            r.json().then((user) => setUser(user));
          }
        });
      }, []);
if(user){
  return (
    <div>
        <Link to={`/user/${user.id}`} >
        <img src={user?user.pfp:'../images/default_pfp.jpg'} style={{maxHeight:'60px', borderRadius:'25%'}}/>
         <h4>{user? user.username:null}</h4> </Link>
        <p>{review.comment}</p>
        <h4>{review.game_score==0?'💔':'⭐'.repeat(review.game_score)}</h4>
        <p>Posted: {review.created}</p>
        {review.user_id== userID?<button onClick={()=>handleDelete(review, userID)}>Delete review</button>:null}
    </div>
  )
}
}
