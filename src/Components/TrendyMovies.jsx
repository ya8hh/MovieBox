
import { useEffect, useState } from 'react';

const TrendingMovies = ({ apiKey }) => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const trendingRes = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
        const trendingData = await trendingRes.json();

        const genreRes = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
        const genreData = await genreRes.json();

        const genreMap = {};
        genreData.genres.forEach(g => {
          genreMap[g.id] = g.name;
        });

        setGenres(genreMap);
        setMovies(trendingData.results.slice(0, 10)); 
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      }
    };

    fetchTrending();
  }, [apiKey]);

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">🔥 Trending This Week</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-72 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{movie.title}</h3>
              <div className="text-xs text-gray-400 mb-2">
                {movie.genre_ids.map(id => genres[id]).join(', ')}
              </div>
              <p className="text-sm text-gray-300 line-clamp-4">{movie.overview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingMovies;
