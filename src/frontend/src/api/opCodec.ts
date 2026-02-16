import { Operation, OperationType, ShapeType } from '@/backend';
import { WhiteboardElement } from '@/canvas/types';
import { Principal } from '@icp-sdk/core/principal';

export function operationToElement(op: Operation): WhiteboardElement | null {
  const baseProps = {
    id: `${op.timestamp}-${Math.random()}`,
    timestamp: Number(op.timestamp),
    author: op.author,
  };

  switch (op.opType) {
    case OperationType.draw:
      if (op.color && op.size) {
        return {
          ...baseProps,
          type: 'stroke',
          points: [{ x: Number(op.position.x), y: Number(op.position.y) }],
          color: op.color,
          size: Number(op.size),
        };
      }
      break;

    case OperationType.addShape:
      if (op.payload.__kind__ === 'addShape' && op.shape) {
        const shapeData = op.payload.addShape;
        const type = shapeTypeToElementType(op.shape);
        if (type) {
          return {
            ...baseProps,
            type,
            start: { x: Number(shapeData.position.x), y: Number(shapeData.position.y) },
            end: {
              x: Number(shapeData.position.x) + Number(shapeData.size),
              y: Number(shapeData.position.y) + Number(shapeData.size),
            },
            color: shapeData.color,
            size: Number(shapeData.size),
          };
        }
      }
      break;

    case OperationType.addText:
      if (op.payload.__kind__ === 'addText' && op.text) {
        const textData = op.payload.addText;
        return {
          ...baseProps,
          type: 'text',
          position: { x: Number(textData.position.x), y: Number(textData.position.y) },
          text: textData.text,
          color: op.color || { r: 0, g: 0, b: 0, a: 1 },
          fontSize: 16,
        };
      }
      break;
  }

  return null;
}

function shapeTypeToElementType(
  shapeType: ShapeType
): 'rectangle' | 'ellipse' | 'line' | null {
  switch (shapeType) {
    case ShapeType.rectangle:
      return 'rectangle';
    case ShapeType.ellipse:
    case ShapeType.circle:
      return 'ellipse';
    case ShapeType.line:
      return 'line';
    default:
      return null;
  }
}
