import { WhiteboardElement } from '@/canvas/types';

export async function exportToPNG() {
  const canvas = document.querySelector('canvas');
  if (!canvas) throw new Error('Canvas not found');

  return new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create blob'));
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `whiteboard-${Date.now()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      resolve();
    });
  });
}

export function exportToJSON(elements: WhiteboardElement[]) {
  const json = JSON.stringify(elements, null, 2);
  navigator.clipboard.writeText(json);
}
