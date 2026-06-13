
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Users from "@/components/admin/users";

function Page() {
  return (
    <section className="px-2 sm:px-4 pt-4 sm:pt-8">
      <Tabs defaultValue="approved" >
        <TabsList variant="line" className="w-full mb-4 border-b bg-transparent rounded-none">
          {
            ["approved", "rejected", "blocked", "deleted"].map((tab) => (
              <TabsTrigger
                key={tab}
                className="pb-2 capitalize"
                value={tab}
              >
                {tab}
              </TabsTrigger>
            ))
          }
        </TabsList>

        <TabsContent value="approved">
          <Users approvalStatus="approved" role="super-admin" />
        </TabsContent>

        <TabsContent value="rejected">
          <Users approvalStatus="rejected" role="super-admin" />
        </TabsContent>

        <TabsContent value="blocked">
          <Users isBlocked role="super-admin" />
        </TabsContent>

        <TabsContent value="deleted">
          <Users isDeleted role="super-admin" />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default Page
