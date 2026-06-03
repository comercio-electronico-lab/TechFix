import { MemoryStick, Cpu, HardDrive, Settings } from 'lucide-react';

interface ProductSpecsProps {
  specs: {
    processor: string;
    graphics: string;
    ram: string;
    storage: string;
  };
  description: string;
}

export default function ProductSpecs({ specs, description }: ProductSpecsProps) {
  return (
    <div className="border-y border-outline-variant/20 py-8 flex flex-col gap-6">
      <p className="text-on-surface-variant leading-relaxed">
        {description}
      </p>
      <div className="grid grid-cols-2 gap-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="text-secondary w-5 h-5" />
          <span className="text-sm font-bold text-on-surface">{specs.processor}</span>
        </div>
        <div className="flex items-center gap-2">
          <Settings className="text-secondary w-5 h-5" />
          <span className="text-sm font-bold text-on-surface">{specs.graphics}</span>
        </div>
        <div className="flex items-center gap-2">
          <MemoryStick className="text-secondary w-5 h-5" />
          <span className="text-sm font-bold text-on-surface">{specs.ram}</span>
        </div>
        <div className="flex items-center gap-2">
          <HardDrive className="text-secondary w-5 h-5" />
          <span className="text-sm font-bold text-on-surface">{specs.storage}</span>
        </div>
      </div>
    </div>
  );
}
