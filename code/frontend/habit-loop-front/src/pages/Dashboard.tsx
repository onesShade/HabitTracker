import { Routes, Route } from "react-router-dom";
import HabitsPage from "./HabitsPage";
import ProfilePage from "./ProfilePage";
import CalendarPage from "./CalendarPage";
import GoalsPage from "./GoalsPage";

export default function Dashboard() {
  return (
    <div>
      <Routes>
        <Route path="habits" element={<HabitsPage />} />
        <Route path="goals" element={<GoalsPage/>} />
        <Route path="calendar" element={<CalendarPage/>} />
        <Route path="profile" element={<ProfilePage/>} />
      </Routes>
    </div>
  );
}
