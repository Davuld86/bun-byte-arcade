import React from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

export default function CategoryLink({category}) {
if (category.games.length ==0){
    return null
}
else{
  return (
    <span className='category-link'>
        <Link to={`/games/category/${category.name}`}>
        <p title={`${category.games.length} ${category.name} game${category.games.length==1?'':'s'}`}>{category.name} {category.games.length}</p>
        </Link>
    </span>
  )
}
}
