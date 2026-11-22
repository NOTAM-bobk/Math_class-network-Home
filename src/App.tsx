import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import ClassDetail from "./pages/ClassDetail";
import Classes from "./pages/Classes";
import Community from "./pages/Community";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="classes" element={<Classes />} />
        <Route path="classes/:slug" element={<ClassDetail />} />
        <Route path="community" element={<Community />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
