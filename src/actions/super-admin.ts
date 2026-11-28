import { sendApiReq, endPoints } from "@/services";

export function getDashboardStats(params: { month: string }) {
  return sendApiReq({
    url: endPoints.getDashboardStats,
    params,
  })
}

export function getActiveUsers(params: { skip: number, limit: number, days: number }) {
  return sendApiReq({
    url: endPoints.getActiveUsers,
    params,
  })
}

export function getPaidUsers(params: any = {}) {
  return sendApiReq({
    url: endPoints.getPaidUsers,
    params,
  })
}

export function getAssistedSubscribedUsers(params: any = {}) {
  return sendApiReq({
    url: endPoints.getAssistedSubscribedUsers,
    params,
  })
}

export function getAllPayments(params: any = {}) {
  return sendApiReq({
    url: endPoints.getAllPayments,
    params,
  })
}

export function getUsersByCreatedBy(params: any = {}) {
  return sendApiReq({
    url: endPoints.getUsersByCreatedBy,
    params,
  })
}

export function getUsersGroupedByAdminCount(params: { type?: "date" | "caste"; includeByAdmin?: boolean; gender?: string } = {}) {
  return sendApiReq({
    url: endPoints.getUsersGroupedByAdminCount,
    params,
  })
}

export function getUsersGroupedCount(params: any = {}) {
  return sendApiReq({
    url: endPoints.getUsersGroupedCount,
    params,
  })
}

export function getUsersGroupList(params: any = {}) {
  return sendApiReq({
    url: endPoints.getUsersGroupedList,
    params,
  })
}

export function getAdminsList() {
  return sendApiReq({
    url: endPoints.getAdminsList,
  })
}

export function createAdmin(data: any) {
  return sendApiReq({
    url: endPoints.updateAdmin,
    method: "post",
    data,
  })
}

export function updateAdmin({ _id, ...data }: any) {
  return sendApiReq({
    url: `${endPoints.updateAdmin}/${_id}`,
    method: "put",
    data,
  })
}

export function getUserInvitations(params: any = {}) {
  return sendApiReq({
    url: endPoints.getUserInvitations,
    params,
  })
}

export function userInvited({ _id }: { _id: string }) {
  return sendApiReq({
    url: `${endPoints.inviteUser}/${_id}`,
    method: "put",
  })
}

export function resetPassByAdmin({ _id, password }: { _id: string, password: string }) {
  return sendApiReq({
    url: `${endPoints.resetPassByAdmin}/${_id}`,
    method: "put",
    data: { password },
  })
}

export function updateUserCritical({ _id, ...data }: { _id: string, email?: string, mobile?: string, salary?: number }) {
  return sendApiReq({
    url: `${endPoints.updateUserCritical}/${_id}`,
    method: "put",
    data,
  })
}

export function removeUserPlan({ _id, reason }: { _id: string, reason?: string }) {
  return sendApiReq({
    url: `${endPoints.getUserCurrentPlan}/${_id}/plan`,
    method: "delete",
    params: reason ? { reason } : undefined,
  })
}

export function extendUserPlan({ _id, days, reason }: { _id: string, days: number, reason?: string }) {
  return sendApiReq({
    url: `${endPoints.getUserCurrentPlan}/${_id}/plan/extend`,
    method: "put",
    data: { days, ...(reason && { reason }) },
  })
}

export function addUserProfiles({ _id, count, reason }: { _id: string, count: number, reason?: string }) {
  return sendApiReq({
    url: `${endPoints.getUserCurrentPlan}/${_id}/plan/profiles`,
    method: "put",
    data: { count, ...(reason && { reason }) },
  })
}

export function getUserPaymentLogs(id: string) {
  return sendApiReq({
    url: `${endPoints.getUserCurrentPlan}/${id}/payment-logs`,
  })
}

export function getUserUnlockedProfiles(id: string, payment?: string) {
  return sendApiReq({
    url: `${endPoints.getUserCurrentPlan}/${id}/unlocked`,
    params: payment ? { payment } : undefined,
  })
}

export function getPaymentUsers(params: { skip: number, limit: number, search?: string, status?: string }) {
  return sendApiReq({
    url: endPoints.getPaymentUsers,
    params,
  })
}

export function getUserPayments(id: string) {
  return sendApiReq({
    url: `${endPoints.getUserCurrentPlan}/${id}/payments`,
  })
}

export function deletePayment({ _id, reason }: { _id: string, reason?: string }) {
  return sendApiReq({
    url: `${endPoints.deletePayment}/${_id}`,
    method: "delete",
    params: reason ? { reason } : undefined,
  })
}

export function getUserCurrentPlan(id: string) {
  return sendApiReq({
    url: `${endPoints.getUserCurrentPlan}/${id}/plan`,
  })
}

export function makePaymentForUser(data: Omit<currentPlanT, "createdAt" | "expiryDate">) {
  return sendApiReq({
    url: endPoints.makePaymentForUser,
    method: "post",
    data,
  })
}

export function bulkUpdateUsers(data: userT[]) {
  return sendApiReq({
    url: endPoints.bulkUpdateUsers,
    method: "put",
    data,
  })
}