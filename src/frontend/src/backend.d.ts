import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Operation {
    opType: OperationType;
    color?: Color;
    size?: bigint;
    text?: string;
    author: Principal;
    shape?: ShapeType;
    timestamp: Timestamp;
    position: Position;
    payload: Payload;
}
export type Timestamp = bigint;
export interface Position {
    x: bigint;
    y: bigint;
}
export type Payload = {
    __kind__: "fillColor";
    fillColor: {
        area: Area;
        color: Color;
    };
} | {
    __kind__: "moveShape";
    moveShape: {
        shapeId: string;
        newPosition: Position;
    };
} | {
    __kind__: "draw";
    draw: null;
} | {
    __kind__: "erase";
    erase: null;
} | {
    __kind__: "addText";
    addText: {
        text: string;
        position: Position;
    };
} | {
    __kind__: "clearBoard";
    clearBoard: null;
} | {
    __kind__: "editText";
    editText: {
        textId: string;
        newText: string;
    };
} | {
    __kind__: "addShape";
    addShape: {
        color: Color;
        size: bigint;
        shape: ShapeType;
        position: Position;
    };
};
export interface Area {
    bottomRight: Position;
    topLeft: Position;
}
export type Version = bigint;
export interface Color {
    a: number;
    b: number;
    g: number;
    r: number;
}
export type BoardId = string;
export enum BoardBackground {
    dots = "dots",
    grid = "grid",
    lines = "lines",
    blank = "blank"
}
export enum OperationType {
    fillColor = "fillColor",
    moveShape = "moveShape",
    draw = "draw",
    erase = "erase",
    addText = "addText",
    clearBoard = "clearBoard",
    editText = "editText",
    addShape = "addShape"
}
export enum ShapeType {
    ellipse = "ellipse",
    polygon = "polygon",
    rectangle = "rectangle",
    line = "line",
    circle = "circle"
}
export interface backendInterface {
    appendOperation(boardId: BoardId, op: Operation): Promise<Version>;
    clearBoard(boardId: BoardId): Promise<Version>;
    createBoard(boardId: BoardId, background: BoardBackground): Promise<void>;
    getBoardBackground(boardId: BoardId): Promise<BoardBackground | null>;
    getBoardContent(boardId: BoardId): Promise<{
        background: BoardBackground;
        version: Version;
        operations: Array<Operation>;
    } | null>;
    getBoardSnapshot(boardId: BoardId): Promise<{
        background: BoardBackground;
        version: Version;
        operations: Array<Operation>;
    } | null>;
    getBoardVersion(boardId: BoardId): Promise<Version | null>;
    getChangesSinceVersion(boardId: BoardId, clientVersion: Version): Promise<{
        background: BoardBackground;
        version: Version;
        operations: Array<Operation>;
    } | null>;
    updateBoardBackground(boardId: BoardId, background: BoardBackground): Promise<void>;
}
