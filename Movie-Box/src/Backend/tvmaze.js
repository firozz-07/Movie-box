const BASE_URL = "https://api.tvmaze.com";

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function mapShow(show) {
  const seasons = show._embedded?.seasons?.length;
  const creator = show._embedded?.crew?.find((entry) =>
    ["Creator", "Executive Producer"].includes(entry.type),
  )?.person?.name;

  return {
    id: show.id,
    title: show.name,
    type: "Web Series",
    totalSeasons: seasons || 0,
    firstSeasonReleaseDate: show.premiered || "",
    imdbRating: show.rating?.average ? Number(show.rating.average).toFixed(1) : "N/A",
    genre: show.genres || [],
    watchOptionsIndia: [
      show.network?.name || show.webChannel?.name || "Check streaming apps",
    ],
    coverPicture: show.image?.medium || show.image?.original || "",
    creator: creator || "Unknown",
    trailer: `https://www.youtube.com/results?search_query=${encodeURIComponent(
      `${show.name} official trailer`,
    )}`,
    overview: stripHtml(show.summary) || "No overview available.",
  };
}

async function fetchJson(path, signal) {
  const response = await fetch(`${BASE_URL}${path}`, { signal });
  if (!response.ok) {
    throw new Error("Could not load shows.");
  }
  return response.json();
}

export async function getShows(signal) {
  const shows = await fetchJson("/shows?page=0", signal);
  return shows
    .filter((show) => show.image?.medium)
    .slice(0, 20)
    .map(mapShow);
}

export async function searchShows(query, signal) {
  const results = await fetchJson(
    `/search/shows?q=${encodeURIComponent(query)}`,
    signal,
  );
  return results
    .map((result) => result.show)
    .filter((show) => show?.image?.medium)
    .slice(0, 20)
    .map(mapShow);
}
