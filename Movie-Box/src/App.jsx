import { useEffect, useState } from "react";
import moviesAndShows from "./Backend/Data";
import Moviebox from "./Components/Moviebox";
import { getTrending, hasApiKey, searchMovies } from "./Backend/tmdb";
import { getShows, searchShows } from "./Backend/tvmaze";

function filterLocal(query) {
  return moviesAndShows.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase()),
  );
}

function App() {
  const [search, setSearch] = useState("");
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const query = search.trim();

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        if (hasApiKey()) {
          const results = query
            ? await searchMovies(query, controller.signal)
            : await getTrending(controller.signal);
          setCatalog(results);
          return;
        }

        const results = query
          ? await searchShows(query, controller.signal)
          : await getShows(controller.signal);
        setCatalog(results);
      } catch (error) {
        if (error.name !== "AbortError") {
          setCatalog(filterLocal(query));
        }
      } finally {
        setLoading(false);
      }
    }, query ? 400 : 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  return (
    <>
      <div className="input-div">
        <input
          type="text"
          placeholder="Search the movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? null : catalog.length === 0 ? (
        <div className="sorry-page">
          <h2>Sorry from our side.</h2>
          <br />
          <h4>no result found for "{search}"</h4>
          <p>More movies will be added soon ...</p>
        </div>
      ) : (
        <Moviebox moviesAndShows={catalog} />
      )}
    </>
  );
}

export default App;
