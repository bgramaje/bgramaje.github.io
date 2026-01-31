import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { BlogListPage } from "./pages/BlogListPage";
import { BlogPage } from "./pages/BlogPage";

function App() {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden w-full">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:id" element={<BlogPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

