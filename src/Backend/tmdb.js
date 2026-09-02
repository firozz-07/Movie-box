const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

export function hasApiKey() {
  return Boolean(API_KEY && API_KEY !== "your_tmdb_api_key_here");
}

async function fetchTmdb(path, signal) {
  const separator = path.includes("?") ? "&" : "?";
  const response = await fetch(
    `${BASE_URL}${path}${separator}api_key=${API_KEY}&language=en-US`,
    { signal },
  );

  if (!response.ok) {
    throw new Error("TMDB request failed. Check your API key in the .env file.");
  }

  return response.json();
}

function uniqueNames(items = []) {
  return [...new Set(items.map((item) => item.provider_name).filter(Boolean))];
}

function trailerUrl(videos) {
  const trailer = videos?.results?.find(
    (video) =>
      video.site === "YouTube" &&
      (video.type === "Trailer" || video.type === "Teaser"),
  );

  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "";
}

function mapTitle(item) {
  return {
    id: item.id,
    mediaType: item.media_type === "tv" ? "tv" : "movie",
    title: item.title || item.name,
    type: item.media_type === "tv" ? "Web Series" : "Movie",
    totalSeasons: item.media_type === "tv" ? item.number_of_seasons ?? 0 : null,
    firstSeasonReleaseDate: item.release_date || item.first_air_date || "",
    imdbRating: Number(item.vote_average || 0).toFixed(1),
    genre: (item.genres || []).map((genre) => genre.name),
    watchOptionsIndia: [],
    coverPicture: item.poster_path ? `${IMAGE_URL}${item.poster_path}` : "",
    creator: "Unknown",
    trailer: trailerUrl(item.videos),
    overview: item.overview || "No overview available.",
  };
}

function withDetails(basic, details) {
  const india = details?.["watch/providers"]?.results?.IN;
  const watchOptionsIndia = uniqueNames([
    ...(india?.flatrate || []),
    ...(india?.ads || []),
    ...(india?.free || []),
  ]);

  const director = details?.credits?.crew?.find((person) => person.job === "Director")?.name;
  const tvCreator = details?.created_by?.[0]?.name;

  return {
    ...basic,
    totalSeasons:
      basic.type === "Movie" ? null : details?.number_of_seasons ?? basic.totalSeasons,
    genre: (details?.genres || []).map((genre) => genre.name),
    watchOptionsIndia:
      watchOptionsIndia.length > 0 ? watchOptionsIndia : ["Not listed for India"],
    creator: tvCreator || director || "Unknown",
    trailer: trailerUrl(details?.videos) || basic.trailer,
    overview: details?.overview || basic.overview,
    coverPicture: details?.poster_path
      ? `${IMAGE_URL}${details.poster_path}`
      : basic.coverPicture,
    imdbRating: Number(details?.vote_average || basic.imdbRating || 0).toFixed(1),
    firstSeasonReleaseDate:
      details?.release_date || details?.first_air_date || basic.firstSeasonReleaseDate,
  };
}

async function enrichItem(item, signal) {
  const mediaType = item.media_type === "tv" ? "tv" : "movie";
  const details = await fetchTmdb(
    `/${mediaType}/${item.id}?append_to_response=videos,credits,watch/providers`,
    signal,
  );

  return withDetails(mapTitle({ ...item, media_type: mediaType }), details);
}

async function loadCatalog(path, signal) {
  const data = await fetchTmdb(path, signal);
  const results = (data.results || [])
    .filter((item) => {
      const mediaType =
        item.media_type || (item.title ? "movie" : item.first_air_date ? "tv" : "");
      return mediaType === "movie" || mediaType === "tv";
    })
    .filter((item) => item.poster_path)
    .slice(0, 20);

  const detailed = await Promise.all(
    results.map((item) =>
      enrichItem(
        {
          ...item,
          media_type: item.media_type || (item.title ? "movie" : "tv"),
        },
        signal,
      ),
    ),
  );

  return detailed.filter((item) => item.coverPicture);
}

export function getTrending(signal) {
  return loadCatalog("/trending/all/week", signal);
}

export function searchMovies(query, signal) {
  return loadCatalog(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false`, signal);
}
