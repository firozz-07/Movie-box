import moviesAndShows from "./Backend/Data";
import Moviebox from "./Components/Moviebox";



function App() {

  return (
    <>
    <Moviebox moviesAndShows={moviesAndShows} />
    </>
  )
}

export default App
