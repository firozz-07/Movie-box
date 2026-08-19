function Moviebox({moviesAndShows}) {
  return (
    <>
    <div className="outer-Div" >
      {moviesAndShows.map((show)=>(
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
            <p>{show.firstSeasonReleaseDate} • {show.totalSeasons === null ? "Movie" : `${show.totalSeasons} Seasons`} • {" "}{show.genre.join(" , ")}</p>
          </div>
          <div className="watch-option">
            watch option 
          </div>

          <div className="trailer">
            <div><i className="fa-solid fa-play"></i> Trailer</div>
            <div className="i" ><i className="fa-solid fa-circle-info"></i></div>
          </div>
        </div>
      )

      )}
       </div>
    </>
  );
}
export default Moviebox;
