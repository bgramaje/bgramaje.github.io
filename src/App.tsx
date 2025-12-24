import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { BlogPage } from "./pages/BlogPage";

function App() {
  return (
    <div className="overflow-hidden">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog/:id" element={<BlogPage />} />
      </Routes>
    </div>
  );
}

export default App;

