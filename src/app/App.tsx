import { Routes, Route } from "react-router-dom";
import { Layout } from "@/app/Layout";
import { HomePage } from "@/app/pages/HomePage";
import { BlogListPage } from "@/app/pages/BlogListPage";
import { BlogPage } from "@/app/pages/BlogPage";
import { ChangelogPage } from "@/app/pages/ChangelogPage";

function App() {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden w-full">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:id/:locale" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
