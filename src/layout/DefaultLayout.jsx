import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import CompareBar from "../components/CompareBar";

export default function DefaultLayout() {

return (

<>
<Navbar />

<main>
<Outlet />
</main>
<CompareBar />

<Footer />

</>

);

}