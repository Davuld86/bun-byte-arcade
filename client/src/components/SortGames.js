import React, { useEffect, useState } from 'react'
import Loading from './Loading'
import NoneFound from './NoneFound'
import GameContainer from './GameContainer'
import { Link, useLocation } from 'react-router-dom/cjs/react-router-dom.min'

import './SortGames.css'

export default function SortGames() {
    const [sort, setSort] = useState(window.location.pathname.slice(12))
    const words = {'new': "Newest", 'popular': 'Popular', 'random': 'Random'}
    const [games, setGames] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const location = useLocation()


    const sortByNestedListLength = (a, b) => {
        const lengthA = a.favorited_by.length;
        const lengthB = b.favorited_by.length;

        return lengthA - lengthB;
      };

    useEffect(() => {
        setSort(window.location.pathname.slice(12))
        switch(window.location.pathname.slice(12)){
            case 'new':
            fetch("/api/recent_games").then((r) => {
            if (r.ok) {
                r.json().then((d)=>{setGames((games)=> games=d)})
            }
        })
            case 'popular':
                fetch("/all_games").then((r) => {
                    if (r.ok) {
                        r.json().then((d)=>{setGames((games)=> games=d.sort(sortByNestedListLength))})
                    }
                })
               }
        setLoading(false)
      }, [location])

function resort(){
    setSort((sort)=>sort=window.location.pathname.slice(12))
    switch(sort){
        case 'new':
            setGames((g)=> g= games.sort((a,b)=>
                b.release_date-a.release_date
            ))
        case 'popular':
            setGames((g)=>g=games.sort(sortByNestedListLength))

        case 'random':
            setGames(games.sort(()=>Math.random() - 0.5))
}
}
if(isLoading){
    return <Loading/>
}
else if(games==0){
    return <NoneFound text={'No games were found'}/>
}
else{
   return (
    <div className='sort-page'>
        <h1>{words[sort]} Games</h1>
        <span style={{display:'flex'}}>
            <h2>Sort by:</h2>
            <Link to='/games/sort/new'><button onClick={resort}>Newest</button></Link>
            <Link to='/games/sort/popular'><button onClick={()=> resort()}>Popular</button></Link>
            <Link to='/games/sort/random'><button onClick={()=> resort()}>Random</button></Link>
        </span>
        <GameContainer games ={games}/>
    </div>
  )
}

}
