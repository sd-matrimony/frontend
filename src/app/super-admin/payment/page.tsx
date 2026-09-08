"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import MakePaymentForUser from "./make-payment-for-user";
import TestPayment from "./test-payment";

function Page() {
  const t = useTranslations("superAdmin.payment")
  const [isTest, setIsTest] = useState(false)

  return (
    <div className="@container p-6">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setIsTest(p => !p)}
        className="block mb-4 ml-auto"
      >
        {isTest ? t("toggleUser") : t("toggleTest")}
      </Button>

      {
        isTest
          ? <TestPayment />
          : <MakePaymentForUser />
      }
    </div>
  )
}

export default Page
