import '../styles/globals.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Import bootstrap JS only on client side
    if (typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp; 