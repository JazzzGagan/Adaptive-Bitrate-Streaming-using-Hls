/* import axios from "axios";
import React, { useState, useEffect } from "react";
import ItemsList from "../components/ItemsList";
import Input from "../components/Input";
import {useGetMovies }from "../Hooks/useGetMovies";


const TvShows = () => {

  const [filterUsers, setFilterUsers] = useState([]);
  useEffect(() => {
    if (Object.keys(users).length > 0) {
      setFilterUsers(users);
    }
  }, [users]);
  const filteredItems = (searchTerm) => {
    const filteredItems = users.filter((user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilterUsers(filteredItems);
  };
  return (
    <div className="flex flex-col items-center justify-center ">
      <Input onChangeCallback={filteredItems} />
      {loading && <p>Loading...</p>}
      {error && <p>There was an error loading the user</p>}
      {!loading && !error && <ItemsList items={filterUsers} />}
    </div>
  );
};

export default TvShows;
 */

import React from "react";

const TvShows = () => {
  return <div>TvShows</div>;
};

export default TvShows;
