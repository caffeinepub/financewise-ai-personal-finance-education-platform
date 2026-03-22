import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  BarChart3,
  Building2,
  Coins,
  CreditCard,
  Gem,
  Home,
  Loader2,
  PiggyBank,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import React, { useState } from "react";
import type {
  Asset,
  AssetCategory,
  Liability,
  LiabilityCategory,
} from "../backend";
import {
  AssetCategory as AssetCategoryEnum,
  LiabilityCategory as LiabilityCategoryEnum,
} from "../backend";
import AccessDenied from "../components/AccessDenied";
import { useActor } from "../hooks/useActor";
import { useCurrency } from "../hooks/useCurrency";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetNetWorthData, useSaveNetWorthData } from "../hooks/useQueries";

const ASSET_CATEGORIES: { value: AssetCategory; label: string }[] = [
  { value: AssetCategoryEnum.cash, label: "Cash" },
  { value: AssetCategoryEnum.bankBalance, label: "Bank Balance" },
  { value: AssetCategoryEnum.savingsAccount, label: "Savings Account" },
  { value: AssetCategoryEnum.investments, label: "Investments" },
  { value: AssetCategoryEnum.stocks, label: "Stocks" },
  { value: AssetCategoryEnum.mutualFunds, label: "Mutual Funds" },
  { value: AssetCategoryEnum.gold, label: "Gold" },
  { value: AssetCategoryEnum.property, label: "Property" },
  { value: AssetCategoryEnum.other, label: "Other Assets" },
];

const LIABILITY_CATEGORIES: { value: LiabilityCategory; label: string }[] = [
  { value: LiabilityCategoryEnum.loans, label: "Loans" },
  { value: LiabilityCategoryEnum.creditCardDebt, label: "Credit Card Debt" },
  { value: LiabilityCategoryEnum.emi, label: "EMI" },
  { value: LiabilityCategoryEnum.personalLoans, label: "Personal Loans" },
  { value: LiabilityCategoryEnum.otherDebt, label: "Other Debt" },
];

function getAssetIcon(category: AssetCategory) {
  switch (category) {
    case AssetCategoryEnum.cash:
      return <Wallet className="w-4 h-4" />;
    case AssetCategoryEnum.bankBalance:
      return <Building2 className="w-4 h-4" />;
    case AssetCategoryEnum.savingsAccount:
      return <PiggyBank className="w-4 h-4" />;
    case AssetCategoryEnum.investments:
      return <BarChart3 className="w-4 h-4" />;
    case AssetCategoryEnum.stocks:
      return <TrendingUp className="w-4 h-4" />;
    case AssetCategoryEnum.mutualFunds:
      return <BarChart3 className="w-4 h-4" />;
    case AssetCategoryEnum.gold:
      return <Gem className="w-4 h-4" />;
    case AssetCategoryEnum.property:
      return <Home className="w-4 h-4" />;
    default:
      return <Coins className="w-4 h-4" />;
  }
}

function generateNetWorthInsights(
  totalAssets: number,
  totalLiabilities: number,
  netWorth: number,
  format: (n: number) => string,
): string[] {
  const insights: string[] = [];
  const debtRatio =
    totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

  if (netWorth < 0) {
    insights.push(
      "Your liabilities exceed your assets. Focus on paying down high-interest debt first.",
    );
    insights.push(
      "Consider creating a debt repayment plan — target the highest-interest debt first (avalanche method).",
    );
  } else if (netWorth < totalAssets * 0.2) {
    insights.push(
      `Your debt-to-asset ratio is ${Math.round(debtRatio)}%. Aim to reduce it below 30% for financial stability.`,
    );
    insights.push(
      "Reduce credit card usage and avoid taking on new debt until existing liabilities are under control.",
    );
  } else {
    insights.push(
      `Great job! Your net worth is ${format(netWorth)}. Keep building assets consistently.`,
    );
  }

  if (totalAssets > 0) {
    insights.push(
      "Increase savings by investing regularly — even small monthly contributions compound significantly over time.",
    );
  } else {
    insights.push(
      "Start by adding your assets — cash, bank balance, and savings accounts — to get a clear financial picture.",
    );
  }

  insights.push(
    "Build an emergency fund of 6 months of expenses before making large investments.",
  );
  insights.push(
    "Diversify your assets across cash, investments, and property to reduce financial risk.",
  );

  return insights.slice(0, 4);
}

export default function NetWorth() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const isAuthenticated = !!identity;

  const { data: netWorthData, isLoading } = useGetNetWorthData();
  const saveNetWorthData = useSaveNetWorthData();
  const { format } = useCurrency();

  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showAddLiability, setShowAddLiability] = useState(false);
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetCategory, setNewAssetCategory] = useState<AssetCategory>(
    AssetCategoryEnum.cash,
  );
  const [newAssetAmount, setNewAssetAmount] = useState("");
  const [newLiabilityName, setNewLiabilityName] = useState("");
  const [newLiabilityCategory, setNewLiabilityCategory] =
    useState<LiabilityCategory>(LiabilityCategoryEnum.loans);
  const [newLiabilityAmount, setNewLiabilityAmount] = useState("");

  if (!isAuthenticated) return <AccessDenied />;

  const assets: Asset[] = netWorthData?.assets ?? [];
  const liabilities: Liability[] = netWorthData?.liabilities ?? [];

  const totalAssets = assets.reduce((sum, a) => sum + a.amount, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.amount, 0);
  const netWorth = totalAssets - totalLiabilities;
  const isPositive = netWorth >= 0;

  const assetProgress =
    totalAssets > 0
      ? Math.min(100, (totalAssets / (totalAssets + totalLiabilities)) * 100)
      : 0;

  const insights = generateNetWorthInsights(
    totalAssets,
    totalLiabilities,
    netWorth,
    format,
  );

  const handleAddAsset = async () => {
    if (!newAssetName.trim() || !newAssetAmount || !actor || !identity) return;
    const newAsset: Asset = {
      name: newAssetName.trim(),
      category: newAssetCategory,
      amount: Number.parseFloat(newAssetAmount),
    };
    const updatedData = {
      assets: [...assets, newAsset],
      liabilities,
      user: identity.getPrincipal(),
      lastUpdated: BigInt(Date.now()),
    };
    await saveNetWorthData.mutateAsync(updatedData);
    setNewAssetName("");
    setNewAssetAmount("");
    setNewAssetCategory(AssetCategoryEnum.cash);
    setShowAddAsset(false);
  };

  const handleAddLiability = async () => {
    if (!newLiabilityName.trim() || !newLiabilityAmount || !actor || !identity)
      return;
    const newLiability: Liability = {
      name: newLiabilityName.trim(),
      category: newLiabilityCategory,
      amount: Number.parseFloat(newLiabilityAmount),
    };
    const updatedData = {
      assets,
      liabilities: [...liabilities, newLiability],
      user: identity.getPrincipal(),
      lastUpdated: BigInt(Date.now()),
    };
    await saveNetWorthData.mutateAsync(updatedData);
    setNewLiabilityName("");
    setNewLiabilityAmount("");
    setNewLiabilityCategory(LiabilityCategoryEnum.loans);
    setShowAddLiability(false);
  };

  const handleDeleteAsset = async (index: number) => {
    if (!identity) return;
    const updatedAssets = assets.filter((_, i) => i !== index);
    await saveNetWorthData.mutateAsync({
      assets: updatedAssets,
      liabilities,
      user: identity.getPrincipal(),
      lastUpdated: BigInt(Date.now()),
    });
  };

  const handleDeleteLiability = async (index: number) => {
    if (!identity) return;
    const updatedLiabilities = liabilities.filter((_, i) => i !== index);
    await saveNetWorthData.mutateAsync({
      assets,
      liabilities: updatedLiabilities,
      user: identity.getPrincipal(),
      lastUpdated: BigInt(Date.now()),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Net Worth
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your complete financial position — assets minus liabilities
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Total Assets
            </p>
            <p className="text-2xl font-bold text-green-500 mt-1">
              {format(totalAssets)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {assets.length} items
            </p>
          </CardContent>
        </Card>
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Total Liabilities
            </p>
            <p className="text-2xl font-bold text-red-500 mt-1">
              {format(totalLiabilities)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {liabilities.length} items
            </p>
          </CardContent>
        </Card>
        <Card
          className={`${isPositive ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`}
        >
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Net Worth
            </p>
            <p
              className={`text-2xl font-bold mt-1 ${isPositive ? "text-primary" : "text-destructive"}`}
            >
              {format(netWorth)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isPositive
                ? "✓ Positive position"
                : "⚠ Liabilities exceed assets"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Indicator */}
      {(totalAssets > 0 || totalLiabilities > 0) && (
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                Assets vs Liabilities
              </span>
              <span className="font-medium">
                {Math.round(assetProgress)}% assets
              </span>
            </div>
            <Progress value={assetProgress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span className="text-green-500">
                Assets: {format(totalAssets)}
              </span>
              <span className="text-red-500">
                Liabilities: {format(totalLiabilities)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Health Message */}
      <Card
        className={`${isPositive ? "border-green-500/30" : "border-amber-500/30"}`}
      >
        <CardContent className="pt-4 pb-4 flex items-start gap-3">
          {isPositive ? (
            <TrendingUp className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          )}
          <div>
            <p className="font-medium text-sm">
              {netWorth > totalAssets * 0.5
                ? "Great job! Your financial position is strong."
                : isPositive
                  ? "Your financial position is stable. Keep reducing liabilities."
                  : "Your liabilities are high. Focus on reducing debt to improve your net worth."}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Net Worth = {format(totalAssets)} (Assets) −{" "}
              {format(totalLiabilities)} (Liabilities) = {format(netWorth)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Assets
              </CardTitle>
              <Button
                size="sm"
                onClick={() => setShowAddAsset(true)}
                className="h-8 gap-1"
              >
                <Plus className="w-3 h-3" /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {assets.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No assets added yet. Click "Add" to get started.
              </p>
            ) : (
              assets.map((asset, index) => (
                <div
                  key={String(asset.category) + String(asset.name)}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">
                      {getAssetIcon(asset.category)}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {
                          ASSET_CATEGORIES.find(
                            (c) => c.value === asset.category,
                          )?.label
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-green-500">
                      {format(asset.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteAsset(index)}
                      disabled={saveNetWorthData.isPending}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
            {assets.length > 0 && (
              <>
                <Separator className="my-2" />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total Assets</span>
                  <span className="text-green-500">{format(totalAssets)}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Liabilities Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                Liabilities
              </CardTitle>
              <Button
                size="sm"
                onClick={() => setShowAddLiability(true)}
                className="h-8 gap-1"
              >
                <Plus className="w-3 h-3" /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {liabilities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No liabilities added yet. Click "Add" to get started.
              </p>
            ) : (
              liabilities.map((liability, index) => (
                <div
                  key={String(liability.name)}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">{liability.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {
                          LIABILITY_CATEGORIES.find(
                            (c) => c.value === liability.category,
                          )?.label
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-red-500">
                      {format(liability.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteLiability(index)}
                      disabled={saveNetWorthData.isPending}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
            {liabilities.length > 0 && (
              <>
                <Separator className="my-2" />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total Liabilities</span>
                  <span className="text-red-500">
                    {format(totalLiabilities)}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {insights.map((insight) => (
            <div
              key={insight}
              className="flex items-start gap-2 p-2 rounded-lg bg-muted/20"
            >
              <span className="text-primary text-xs mt-0.5">•</span>
              <p className="text-sm text-muted-foreground">{insight}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add Asset Dialog */}
      <Dialog open={showAddAsset} onOpenChange={setShowAddAsset}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Asset Name</Label>
              <Input
                placeholder="e.g., HDFC Savings Account"
                value={newAssetName}
                onChange={(e) => setNewAssetName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={newAssetCategory}
                onValueChange={(v) => setNewAssetCategory(v as AssetCategory)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSET_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="0"
                value={newAssetAmount}
                onChange={(e) => setNewAssetAmount(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAsset(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddAsset}
              disabled={
                !newAssetName.trim() ||
                !newAssetAmount ||
                saveNetWorthData.isPending
              }
            >
              {saveNetWorthData.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Add Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Liability Dialog */}
      <Dialog open={showAddLiability} onOpenChange={setShowAddLiability}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Liability</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Liability Name</Label>
              <Input
                placeholder="e.g., Home Loan"
                value={newLiabilityName}
                onChange={(e) => setNewLiabilityName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={newLiabilityCategory}
                onValueChange={(v) =>
                  setNewLiabilityCategory(v as LiabilityCategory)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIABILITY_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="0"
                value={newLiabilityAmount}
                onChange={(e) => setNewLiabilityAmount(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddLiability(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddLiability}
              disabled={
                !newLiabilityName.trim() ||
                !newLiabilityAmount ||
                saveNetWorthData.isPending
              }
            >
              {saveNetWorthData.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Add Liability
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
