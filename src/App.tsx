import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import UpdateToast from "@/components/UpdateToast";
import Today from "@/routes/Today";
import Review from "@/routes/Review";
import Mock from "@/routes/Mock";
import Library from "@/routes/Library";
import Stats from "@/routes/Stats";
import Settings from "@/routes/Settings";
import Teach from "@/routes/Teach";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Today />} />
          <Route path="review" element={<Review />} />
          <Route path="mock" element={<Mock />} />
          <Route path="library" element={<Library />} />
          <Route path="stats" element={<Stats />} />
          <Route path="settings" element={<Settings />} />
          <Route path="teach/:ruleId" element={<Teach />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      {/* Chunk 8 F-2: SW update toast — rendered outside the Layout so it
          floats above any route. Suppresses itself during a mock exam (F-1). */}
      <UpdateToast />
    </>
  );
}
