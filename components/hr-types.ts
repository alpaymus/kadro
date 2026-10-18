export type SlotStatus = "Boş" | "Dolu" | "Bloke"

export type Slot = {
  id: string
  title: string
  department: string
  degree: string
  serviceClass?: string
  approvalDate?: string
  vacantCount?: number
  filledCount?: number
  statusCode?: string
  budgetCode?: string
  status: SlotStatus
  employee: string | null
  assignmentDutyType?: string
  assignmentDate?: string
  assignmentNumber?: string
  extraStatus?: string
  assignmentNotes?: string
  initials: string | null
  avatarTone: string
}

export type BlockedRecord = {
  id: string
  slotId: string
  title: string
  department: string
  degree: string
  count: number
  processDate: string
  reason: string
  description: string
}

export type HrRole = "hr-specialist" | "hr-manager" | "admin"

export type MockHrUser = {
  id: string
  name: string
  initials: string
  role: HrRole
  roleLabel: string
}

export const mockHrUsers: readonly MockHrUser[] = [
  { id: "user-ik-sorumlusu", name: "Zeynep Arslan", initials: "ZA", role: "hr-specialist", roleLabel: "İK Sorumlusu" },
  { id: "user-ik-muduru", name: "Ayşe Demir", initials: "AD", role: "hr-manager", roleLabel: "İK Müdürü" },
  { id: "user-admin", name: "Sistem Yöneticisi", initials: "SY", role: "admin", roleLabel: "Admin" },
]

export type ApprovalPayload =
  | { kind: "slot-create"; slot: Slot }
  | { kind: "slot-update"; slotId: string; updates: Partial<Omit<Slot, "id">> }
  | { kind: "slot-delete"; slotId: string; title: string }
  | { kind: "assignment"; slotId: string; employee: string; dutyType: string; assignmentDate: string; assignmentNumber: string; extraStatus: string; notes: string }
  | { kind: "block"; slotId: string; record: BlockedRecord }
  | { kind: "degree-change"; slotId: string; previousDegree: string; newDegree: string }

export type ApprovalStatus = "pending" | "approved" | "rejected"

export type HrApprovalRequest = {
  id: string
  payload: ApprovalPayload
  submittedById: string
  submittedByName: string
  submittedAt: string
  status: ApprovalStatus
  decidedByName?: string
  decidedAt?: string
}
