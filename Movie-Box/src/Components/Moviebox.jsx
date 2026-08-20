import { useState } from "react";
function Moviebox({ moviesAndShows }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  return (
    <>
      <div className="outer-Div">
        {moviesAndShows.map((show) => (
          <div key={show.id}>
            <div className="img">
              <img src={show.coverPicture} alt={show.title} />
            </div>
            <div className="rating">
              <i className="fa-solid fa-star"> </i>
              <p>{show.imdbRating}</p>
            </div>
            <div className="info">
              <h1>{show.title}</h1>
              <p>
                {show.firstSeasonReleaseDate} •{" "}
                {show.totalSeasons === null
                  ? "Movie"
                  : `${show.totalSeasons} Seasons`}{" "}
                • {show.genre.join(" , ")}
              </p>
            </div>
            <div
              className="watch-option"
              onClick={() => setSelectedMovie(show)}
            >
              watch option
            </div>

            <div className="trailer">
              <div>
                <i className="fa-solid fa-play"></i> Trailer
              </div>
              <div className="i">
                <i className="fa-solid fa-circle-info"></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedMovie(null)}
            >
              ✕
            </button>

            <div className="inner-div">
              <div className="image-div">
                <img
                  src={selectedMovie.coverPicture}
                  alt={selectedMovie.title}
                />
              </div>
              <div className="modal-title">
                <h2>{selectedMovie.title}</h2>
                <p>
                  • {selectedMovie.firstSeasonReleaseDate} {"  "} •{" "}
                  {selectedMovie.totalSeasons}
                  {" Seasons"}{" "}
                </p>
                • {selectedMovie.genre.join(" • ")}
                <br />
                <p>
                  <i className="fa-solid fa-star"> </i>{" "}
                  {selectedMovie.imdbRating}
                </p>
                • Creator : {selectedMovie.creator}
              </div>
            </div>
            <div className="options">
              <h3>Available on:</h3>
              {selectedMovie.watchOptionsIndia.map((platform) => (
                <p key={platform}>•{platform}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Moviebox;
