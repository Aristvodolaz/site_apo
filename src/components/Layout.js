import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, title = 'Арктическая олимпиада' }) {
  return (
    <>
      <Head>
        <title>{title} | Полярный круг</title>
      </Head>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
} 