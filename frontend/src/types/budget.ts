export interface ItemResponse { id: number; name: string; estimatedCost: number; actualCost: number | null; paid: boolean; notes: string | null }
export interface CategoryResponse { id: number; name: string; allocatedAmount: number; sortOrder: number; totalEstimated: number; totalActual: number; items: ItemResponse[] }
export interface BudgetSummaryResponse { totalBudget: number; totalAllocated: number; totalEstimated: number; totalActual: number; totalPaid: number; remaining: number; categories: CategoryResponse[] }
