import React, {Fragment} from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

export default function UserReviewElement({review, logged, handleDelete}) {
  return (
    <div className='user-review'>
    <Link to={`/play/${review.game_id}`}>
    <h4>{review.reviewed.title}</h4>
    <img src={review.reviewed.thumbnail}/>
    </Link>
    <h3>{review.game_score==0?'💔':'⭐'.repeat(review.game_score)}</h3>
    <p>{review.comment}</p>
    {review.user_id==logged?<button onClick={()=>handleDelete(review)}>Delete Review</button>:null}
    </div>
  )
}
