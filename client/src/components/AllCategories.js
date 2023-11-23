import React, { useEffect, useState } from 'react'
import CategoryLink from './CategoryLink';

export default function AllCategories() {
    const[categories, setCategories] = useState(null)
    const[isLoaded, setLoaded] = useState(null)

    useEffect(() => {
        fetch('/api/categories/').then((r) => {
         if (r.ok) {
           r.json().then((categories) => setCategories(categories));
         }
         else{
             setCategories(0)
         }
       })
       setLoaded(true)
       }, []);
if(isLoaded){
    if(categories){
        return(
            <div>
                <h1>All Categories</h1>

                {categories.map((category)=><CategoryLink category={category}/>)}

            </div>
        )
    }
    if (categories==0){
        return (
    <div>
        <h1>Something's wrong</h1>
        <img src= '../images/no_category.png'/>
        <p>No categories found!</p>
    </div>
  )
}
    }
}

