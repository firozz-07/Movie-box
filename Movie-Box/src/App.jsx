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
      <Moviebox moviesAndShows={filteredMovies} />
    </>
  );
}

export default App;
