import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Footer from "../components/Footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />

      <h2 style={{textAlign:"center"}}>Prodotti Correlati</h2>

      <Footer />
    </>
  )
}