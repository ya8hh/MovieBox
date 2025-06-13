
import { useState, useEffect } from 'react';
import TrendingMovies from './Components/TrendyMovies';

const App = () => {
  const [movieName, setMovieName] = useState('');
  const [subtitleUrl, setSubtitleUrl] = useState('');
  const [subtitleLang, setSubtitleLang] = useState('en');
  const [autoplay, setAutoplay] = useState(true);
  const [embedUrl, setEmbedUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [watchlist, setWatchlist] = useState([]);

  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlist(savedList);
  }, []);

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!movieName.trim()) {
      setError('Please enter a movie name');
      return;
    }

    setLoading(true);
    setError('');
    setEmbedUrl('');

    try {
      const searchRes = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movieName)}`
      );
      const searchData = await searchRes.json();

      if (!searchData.results || searchData.results.length === 0) {
        setError('Movie not found');
        setLoading(false);
        return;
      }

      const movie = searchData.results[0];
      const tmdbId = movie.id;
      const detailsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`
      );
      const details = await detailsRes.json();
      const imdbId = details.imdb_id;

      let url = `https://vidsrc.xyz/embed/movie/${imdbId}`;
      const params = new URLSearchParams();
      if (subtitleUrl) params.append('sub_url', encodeURIComponent(subtitleUrl));
      if (subtitleLang) params.append('ds_lang', subtitleLang);
      params.append('autoplay', autoplay ? '1' : '0');
      url += `?${params.toString()}`;

      setEmbedUrl(url);

      // Optional: preload movie name in input
      setMovieName(movie.title);

      // Optionally store current movie info
      setCurrentMovie({
        title: movie.title,
        imdbId: imdbId,
      });
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const [currentMovie, setCurrentMovie] = useState(null);

  const addToWatchlist = () => {
    if (!currentMovie || watchlist.some(m => m.imdbId === currentMovie.imdbId)) return;
    setWatchlist(prev => [...prev, currentMovie]);
  };

  const removeFromWatchlist = (imdbId) => {
    setWatchlist(prev => prev.filter(movie => movie.imdbId !== imdbId));
  };

  const watchMovie = (movie) => {
    let url = `https://vidsrc.xyz/embed/movie/${movie.imdbId}`;
    const params = new URLSearchParams();
    if (subtitleUrl) params.append('sub_url', encodeURIComponent(subtitleUrl));
    if (subtitleLang) params.append('ds_lang', subtitleLang);
    params.append('autoplay', autoplay ? '1' : '0');
    url += `?${params.toString()}`;

    setEmbedUrl(url);
    setMovieName(movie.title);
    setCurrentMovie(movie);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      <div className="p-6 flex flex-col items-center">
        <div className="w-full max-w-5xl flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">🎬 Movie Streamer</h1>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="toggle toggle-sm"
            />
            <span className="text-sm">{darkMode ? 'Dark' : 'Light'} Mode</span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4 bg-gray-800 dark:bg-gray-800 p-6 rounded shadow-lg">
          <input
            type="text"
            placeholder="Enter Movie Name (e.g., Shazam)"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            className="w-full p-3 rounded bg-gray-100 text-black"
          />
          <input
            type="text"
            placeholder="Subtitle URL (.vtt or .srt, optional)"
            value={subtitleUrl}
            onChange={(e) => setSubtitleUrl(e.target.value)}
            className="w-full p-3 rounded bg-gray-100 text-black"
          />
          <select
            value={subtitleLang}
            onChange={(e) => setSubtitleLang(e.target.value)}
            className="w-full p-3 rounded bg-gray-100 text-black"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={autoplay}
              onChange={() => setAutoplay(!autoplay)}
              className="form-checkbox"
            />
            <label>Autoplay</label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white w-full py-2 rounded font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load Movie'}
          </button>

          {currentMovie && (
            <button
              type="button"
              onClick={addToWatchlist}
              className="bg-green-600 hover:bg-green-500 w-full py-2 rounded font-semibold"
            >
              ➕ Add to Watchlist
            </button>
          )}

          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
       

                  


        {embedUrl && (
          <div className="w-full max-w-4xl aspect-video mt-6">
            <iframe
              src={embedUrl}
              frameBorder="0"
              allowFullScreen
              className="w-full h-full rounded shadow-lg"
              title="Movie Player"
            ></iframe>
          </div>
        )}
        

                       

        <TrendingMovies apiKey={TMDB_API_KEY} />
        

                     

       
        {watchlist.length > 0 && (
          <div className="w-full max-w-3xl mt-10">
            <h2 className="text-2xl font-bold mb-4">🎞️ Your Watchlist</h2>
            <ul className="space-y-2">
              {watchlist.map((movie) => (
                <li
                  key={movie.imdbId}
                  className="flex justify-between items-center bg-gray-800 dark:bg-gray-700 px-4 py-2 rounded"
                >
                  <span>{movie.title}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => watchMovie(movie)}
                      className="text-blue-400 hover:underline"
                    >
                      ▶ Watch
                    </button>
                    <button
                      onClick={() => removeFromWatchlist(movie.imdbId)}
                      className="text-red-400 hover:underline"
                    >
                      ❌ Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
                    

                      

        <footer className="mt-10 text-center text-xs opacity-70 px-4">
          <p>
            ⚠️ This is for <strong>educational purposes only</strong>. I do not host or serve any content — only publicly available links are used.
          </p>
          <p className="mt-1">Made with ❤️ by <a href="https://github.com/ya8hh" className="underline hover:text-blue-400" target="_blank">ya8hh</a></p>
        </footer>
      </div>
    </div>
  );
};

export default App;
