'use server';

import { IDiagnosticNode } from '@/interfaces/domain';
import { getDiagnosticTreeData } from './data';

export async function getDiagnosticNodeById(id: string): Promise<IDiagnosticNode | null> {
  const diagnosticTreeData = await getDiagnosticTreeData();
  const node = (diagnosticTreeData as any)[id];
  if (!node) return null;
  return {
    ...node,
    options: node.options || (node.children || []).map((childId: string) => {
      const child = (diagnosticTreeData as any)[childId];
      return { id: childId, label: child.question, nextStepId: childId };
    })
  };
}
