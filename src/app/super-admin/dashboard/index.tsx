import useUIStore from "@/store/ui";

import UsersGroupedByAdmin from "./users-grouped-by-admin";
import UsersGrouped from "./users-grouped";
import CreateAdmin from "./create-admin";
import PaidUsers from "./paid-users";
import Admins from "./admins";

function Dashboard() {
  const open = useUIStore(s => s.open)

  return (
    <>
      <UsersGrouped />
      <PaidUsers />
      <UsersGroupedByAdmin />
      <Admins />

      {
        open === "admin" &&
        <CreateAdmin />
      }
    </>
  )
}

export default Dashboard
