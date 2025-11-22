import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Components/Home/Home";
import How_it_works from "./Components/HowITWorks/How_it_works";
import Scan_or_Upload from "./Components/Scan_or_Upload/Scan_or_Upload";



function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how" element={<How_it_works />} />
        <Route path="/scan" element={<Scan_or_Upload />} />
        
        
      </Routes>
      <Footer />
    </>
  );
}

export default App;



