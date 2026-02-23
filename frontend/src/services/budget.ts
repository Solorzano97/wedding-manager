import api from './api'
import type { BudgetSummaryResponse, CategoryResponse, ItemResponse } from '../types/budget'
export const budgetService = {
  summary: (weddingId: number, totalBudget?: number) =>
    api.get<BudgetSummaryResponse>(`/weddings/${weddingId}/budget/summary`, { params: { totalBudget } }),
  addCategory: (weddingId: number, data: { name: string; allocatedAmount: number; sortOrder?: number }) =>
    api.post<CategoryResponse>(`/weddings/${weddingId}/budget/categories`, data),
  addItem: (weddingId: number, categoryId: number, data: { name: string; estimatedCost: number; actualCost?: number; paid?: boolean; notes?: string }) =>
    api.post<ItemResponse>(`/weddings/${weddingId}/budget/categories/${categoryId}/items`, data),
  deleteCategory: (weddingId: number, categoryId: number) =>
    api.delete(`/weddings/${weddingId}/budget/categories/${categoryId}`),
  deleteItem: (weddingId: number, itemId: number) =>
    api.delete(`/weddings/${weddingId}/budget/items/${itemId}`),
}
