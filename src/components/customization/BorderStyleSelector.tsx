
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BorderStyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const BorderStyleSelector: React.FC<BorderStyleSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const borderStyles = [
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'dotted', label: 'Dotted' },
    { value: 'double', label: 'Double' },
    { value: 'groove', label: 'Groove' },
    { value: 'ridge', label: 'Ridge' },
    { value: 'inset', label: 'Inset' },
    { value: 'outset', label: 'Outset' },
  ];
  
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select border style" />
      </SelectTrigger>
      <SelectContent>
        {borderStyles.map((style) => (
          <SelectItem key={style.value} value={style.value}>
            {style.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BorderStyleSelector;
