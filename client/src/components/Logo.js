import React, { Fragment } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

export default function Logo() {
  return (
    <Fragment>
         <Link to='/'>
          <img src={'/images/bba_logo.png'} style={{maxWidth:'80px'}}/>
          <img src={'/images/bba_text.png'} style={{maxHeight:'100px'}}></img>
          </Link>
    </Fragment>
  )
}
