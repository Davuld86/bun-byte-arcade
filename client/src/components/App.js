import React, {Fragment, useState} from "react";
import {BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Banner from "./Banner";
import NavBar from "./NavBar";
import GamePage from "./GamePage";
import NoPage from "./NoPage";
import UserPage from "./UserPage";
import EditProfile from "./EditProfile";
import UploadGameForm from "./UploadGameForm";
import CategoryGames from "./CategoryGames";
import AllCategories from "./AllCategories";
import SearchPage from "./SearchPage";
import UserFavorites from "./UserFavorites";
import UserUploads from "./UserUploads";
import EditGameForm from "./EditGameForm";
import UserReviewsPage from "./UserReviewsPage";
import SortGames from "./SortGames";

import './App.css';

function App() {
  const [path, changePath] = useState(window.location.pathname)
  const [logged, setLogged]= useState(null)
  return(
    <Fragment>

    <BrowserRouter>
    <Banner logged={logged} setLogged={setLogged}/>
    <NavBar path={path} changePath={changePath}/>
      <Switch>
        <Route exact path='/'>  <Home/>   </Route>
        <Route path='/play/:id'> <GamePage/> </Route>
        <Route path='/user-account/:id'> <UserPage logged={logged} setLogged={setLogged}/>  </Route>
        <Route path='/uploads/:userID'> <UserUploads/>  </Route>
        <Route path='/user-reviews/:userID'> <UserReviewsPage/>  </Route>
        <Route path='/favorites/:userID/'> <UserFavorites/>  </Route>
        <Route path='/edit-profile/:id'> <EditProfile/> </Route>
        <Route path='/games/sort/new'> <SortGames/> </Route>
        <Route path='/games/sort/popular'> <SortGames/> </Route>
        <Route path='/games/sort/random'> <SortGames/> </Route>
        <Route path='/edit-game/:id'> <EditGameForm/> </Route>
        <Route path='/upload-game'><UploadGameForm/></Route>
        <Route path='/categories'><AllCategories/></Route>
        <Route path='/games/category/:category'> <CategoryGames/> </Route>
        <Route path='/search_games/:query'> <SearchPage/> </Route>
        <Route exact path='/search_games/'> <SearchPage/> </Route>
        <Route path='*'> <NoPage/> </Route>
      </Switch>
    </BrowserRouter>
    </Fragment>
  )
}

export default App;
