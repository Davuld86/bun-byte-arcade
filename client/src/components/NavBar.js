import React, { Component } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

export default function NavBar(){
    return (
      <div>
        <ul style={{display:'flex',justifyContent:'space-evenly'}}>
            <Link to='/games/category/action'><p>Action</p></Link>
            <Link to='/games/category/adventure'><p>Adventure</p></Link>
            <Link to='/games/category/puzzle'><p>Puzzle</p></Link>
            <Link to='/games/category/shooting'><p>Shooting</p></Link>
            <Link to='/games/category/strategy'><p>Strategy</p></Link>
            <Link to='/categories'><p>More</p></Link>
        </ul>
      </div>
    )

}
