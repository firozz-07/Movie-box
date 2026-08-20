import moviesAndShows from "./Backend/Data";
import Moviebox from "./Components/Moviebox";
import { useState } from "react";
function App() {
  const [search, setSearch] = useState("");
 const filteredMovies = moviesAndShows.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <>
       <div className="input-div">
        <input type="text" placeholder="Search the movie..." value={search} onChange={(e) => setSearch(e.target.value)} />
    </div>
    {filteredMovies.length===0 ?(
      <div className="sorry-page">
      <h2>Sorry from our side.</h2><br />
      <h4>no result found for  "{search}"</h4>
      <p>More movies will be added soon ...</p>
      </div>):(
      <Moviebox moviesAndShows={filteredMovies} />)
      }
    </>
  );
}

export default App;
