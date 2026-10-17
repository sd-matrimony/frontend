import useUIStore from "@/store/ui";

import UsersGroupedByAdmin from "./users-grouped-by-admin";
import UsersGrouped from "./users-grouped";
import StatsOverview from "./stats-overview";
import ActiveUsers from "./active-users";
import CreateAdmin from "./create-admin";
import PaidUsers from "./paid-users";
import DashboardGrid from "./grid";
import Admins from "./admins";

const CARDS = [
  { id: "users-grouped", Component: UsersGrouped },
  { id: "paid-users", Component: PaidUsers },
  { id: "active-users", Component: ActiveUsers },
  { id: "users-grouped-by-admin", Component: UsersGroupedByAdmin },
  { id: "admins", Component: Admins },
]

function Dashboard() {
  const open = useUIStore(s => s.open)

  return (
    <>
      <StatsOverview />

      <DashboardGrid cards={CARDS} />

      {
        open === "admin" &&
        <CreateAdmin />
      }
    </>
  )
}

export default Dashboard
