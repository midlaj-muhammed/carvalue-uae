import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import PredictPage from "@/pages/PredictPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/predict" element={<PredictPage />} />
      </Routes>
    </BrowserRouter>
  );
}
