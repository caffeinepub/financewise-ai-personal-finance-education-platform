import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { BudgetPlan, BudgetPlannerData } from "../backend";
import { useActor } from "./useActor";

export function useGetBudgetPlan() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BudgetPlannerData | null>({
    queryKey: ["budgetPlan"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBudgetPlan();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveBudgetPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: BudgetPlan) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveBudgetPlan(plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetPlan"] });
      toast.success("Budget plan saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save budget plan. Please try again.");
    },
  });
}
