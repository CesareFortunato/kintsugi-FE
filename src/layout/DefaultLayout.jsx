import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import CompareBar from "../components/CompareBar";

export default function DefaultLayout() {
  return (
    <div className="d-flex flex-column min-vh-100"> 
      
      <Navbar />

      <main className="flex-grow-1">  
        <Outlet />
      </main>

      <CompareBar />
      <Footer />

    </div>
  );
}