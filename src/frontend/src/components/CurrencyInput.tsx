import { Input } from "@/components/ui/input";
import React from "react";
import { useCurrency } from "../hooks/useCurrency";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
}

export default function CurrencyInput({
  value,
  onChange,
  placeholder = "0.00",
  disabled,
  required,
  className,
  id,
}: Props) {
  const { symbol } = useCurrency();

  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-muted-foreground font-medium text-sm select-none pointer-events-none z-10">
        {symbol}
      </span>
      <Input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`pl-8 ${className ?? ""}`}
        min="0"
        step="0.01"
      />
    </div>
  );
}
