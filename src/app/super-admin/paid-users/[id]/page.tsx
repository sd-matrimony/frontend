import { PaidUserDetails } from "@/components/admin/payments/paid-user-details";

type props = {
  params: Promise<{ id: string }>
}

async function Page({ params }: props) {
  const { id } = await params

  return <PaidUserDetails id={id} />
}

export default Page
