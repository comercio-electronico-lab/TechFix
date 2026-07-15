'use server';

import { IDiagnosticNode, IDiagnosticOption } from '@/interfaces/domain';

interface RawDiagnosticNode {
  question: string;
  options?: IDiagnosticOption[];
  children?: string[];
  isTerminal?: boolean;
  [key: string]: unknown;
}

type RawDiagnosticTree = Record<string, RawDiagnosticNode>;

export async function getDiagnosticNodeById(id: string): Promise<IDiagnosticNode | null> {
  const diagnosticTreeData = (await import('../data/diagnosticTree.json')).default as unknown as RawDiagnosticTree;
  const node = diagnosticTreeData[id];
  if (!node) return null;
  return {
    ...node,
    options: node.options || (node.children || []).map((childId: string) => {
      const child = diagnosticTreeData[childId];
      return { id: childId, label: child.question, nextStepId: childId };
    })
  } as IDiagnosticNode;
}
