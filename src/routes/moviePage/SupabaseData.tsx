import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
console.log('supabaseAnonUrl: ', supabaseUrl);
console.log('supabaseAnonKey: ', supabaseAnonKey);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DataDisplay: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('movies').select('*');
      if (error) {
        setError(error.message);
      } else {
        setData(data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='db app'>
      <h3>Fetched Data</h3>
      {error && <p className='error'>Error: {error}</p>}
      <ul>
        {/* Loop through the data and render each movie */}
        {data.map((movie, index) => (
          <li key={index} className='data'>
            {/* Access and display each field, such as title, genre, and year */}
            <strong>Title:</strong> {movie.title} <br />
            <br />
            <strong>Genre:</strong> {movie.genre} <br />
            <br />
            <strong>Year:</strong> {movie.year} <br />
            <br />
            <strong>Synopsis:</strong> <br /> {movie.synopsis}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataDisplay;
