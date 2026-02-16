import { Operation } from '@/backend';
import { useBoardStore } from './boardStore';
import { operationToElement } from '@/api/opCodec';

export function applyRemoteOperations(operations: Operation[]) {
  const store = useBoardStore.getState();
  const newElements = [...store.elements];

  operations.forEach((op) => {
    const element = operationToElement(op);
    if (element) {
      // Check if element already exists
      const exists = newElements.some((el) => el.id === element.id);
      if (!exists) {
        newElements.push(element);
      }
    }
  });

  store.setElements(newElements);
}
