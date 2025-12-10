import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div 
      className="min-h-screen flex flex-col"
      data-testid="app-layout"
    >
      <Header />
      <main 
        className="flex-grow container mx-auto px-4 py-8"
        data-testid="main-content"
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
