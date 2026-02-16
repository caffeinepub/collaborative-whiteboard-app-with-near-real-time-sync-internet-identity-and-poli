import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Migration "migration";

(with migration = Migration.run)
actor {
  type BoardId = Text;
  type Version = Nat;
  type Timestamp = Int;

  type BoardBackground = {
    #blank;
    #dots;
    #grid;
    #lines;
  };

  type BoardMetadata = {
    background : BoardBackground;
    createdBy : Principal;
    createdAt : Timestamp;
  };

  type BoardState = {
    operations : List.List<Operation>;
    version : Version;
    lastModified : Timestamp;
    metadata : BoardMetadata;
  };

  type Operation = {
    author : Principal;
    timestamp : Timestamp;
    opType : OperationType;
    payload : Payload;
    position : Position;
    color : ?Color;
    size : ?Nat;
    text : ?Text;
    shape : ?ShapeType;
  };

  type OperationType = {
    #draw;
    #erase;
    #addShape;
    #moveShape;
    #addText;
    #editText;
    #fillColor;
    #clearBoard;
  };

  type Color = {
    r : Nat8;
    g : Nat8;
    b : Nat8;
    a : Nat8;
  };

  type Position = {
    x : Nat;
    y : Nat;
  };

  type ShapeType = {
    #rectangle;
    #circle;
    #line;
    #polygon;
    #ellipse;
  };

  type Payload = {
    #draw;
    #erase;
    #addShape : {
      shape : ShapeType;
      position : Position;
      size : Nat;
      color : Color;
    };
    #moveShape : {
      shapeId : Text;
      newPosition : Position;
    };
    #addText : {
      text : Text;
      position : Position;
    };
    #editText : {
      textId : Text;
      newText : Text;
    };
    #fillColor : {
      area : Area;
      color : Color;
    };
    #clearBoard;
  };

  type Area = {
    topLeft : Position;
    bottomRight : Position;
  };

  module Operation {
    public func compare(op1 : Operation, op2 : Operation) : Order.Order {
      if (op1.timestamp < op2.timestamp) { return #less };
      if (op1.timestamp > op2.timestamp) { return #greater };
      #equal;
    };
  };

  let boards = Map.empty<BoardId, BoardState>();

  public shared ({ caller }) func createBoard(boardId : BoardId, background : BoardBackground) : async () {
    if (boards.containsKey(boardId)) { Runtime.trap("Board already exists") };
    let metadata : BoardMetadata = {
      background;
      createdBy = caller;
      createdAt = Time.now();
    };
    let newBoardState = {
      operations = List.empty<Operation>();
      version = 0;
      lastModified = Time.now();
      metadata;
    };
    boards.add(boardId, newBoardState);
  };

  public shared ({ caller }) func updateBoardBackground(boardId : BoardId, background : BoardBackground) : async () {
    let boardState = switch (boards.get(boardId)) {
      case (null) { Runtime.trap("Board does not exist") };
      case (?state) { state };
    };
    let updatedMetadata = {
      boardState.metadata with background;
    };
    let updatedBoardState = {
      boardState with
      metadata = updatedMetadata
    };
    boards.add(boardId, updatedBoardState);
  };

  public query ({ caller }) func getBoardBackground(boardId : BoardId) : async ?BoardBackground {
    switch (boards.get(boardId)) {
      case (null) { null };
      case (?state) { ?state.metadata.background };
    };
  };

  public shared ({ caller }) func appendOperation(boardId : BoardId, op : Operation) : async Version {
    let boardState = switch (boards.get(boardId)) {
      case (null) { Runtime.trap("Board does not exist") };
      case (?board) { board };
    };

    boardState.operations.add(op);
    let newVersion = boardState.version + 1;
    let updatedBoardState : BoardState = {
      boardState with
      operations = boardState.operations;
      version = newVersion;
      lastModified = Time.now();
    };
    boards.add(boardId, updatedBoardState);
    newVersion;
  };

  public query ({ caller }) func getBoardSnapshot(boardId : BoardId) : async ?{
    operations : [Operation];
    version : Version;
    background : BoardBackground;
  } {
    switch (boards.get(boardId)) {
      case (null) { null };
      case (?boardState) {
        ?{
          operations = boardState.operations.toArray().sort();
          version = boardState.version;
          background = boardState.metadata.background;
        };
      };
    };
  };

  public query ({ caller }) func getChangesSinceVersion(
    boardId : BoardId,
    clientVersion : Version
  ) : async ?{
    operations : [Operation];
    version : Version;
    background : BoardBackground;
  } {
    switch (boards.get(boardId)) {
      case (null) { null };
      case (?boardState) {
        if (clientVersion >= boardState.version) {
          ?{
            operations = [];
            version = boardState.version;
            background = boardState.metadata.background;
          };
        } else {
          let operationsSlice = boardState.operations.toArray().sort();
          ?{
            operations = operationsSlice;
            version = boardState.version;
            background = boardState.metadata.background;
          };
        };
      };
    };
  };

  public shared ({ caller }) func clearBoard(boardId : BoardId) : async Version {
    let boardState = switch (boards.get(boardId)) {
      case (null) { Runtime.trap("Board does not exist") };
      case (?board) { board };
    };

    let clearOp : Operation = {
      author = caller;
      timestamp = Time.now();
      opType = #clearBoard;
      payload = #clearBoard;
      position = { x = 0; y = 0 };
      color = null;
      size = null;
      text = null;
      shape = null;
    };

    boardState.operations.add(clearOp);
    let newVersion = boardState.version + 1;
    let updatedBoardState : BoardState = {
      boardState with
      operations = boardState.operations;
      version = newVersion;
      lastModified = Time.now();
    };
    boards.add(boardId, updatedBoardState);
    newVersion;
  };

  public query ({ caller }) func getBoardVersion(boardId : BoardId) : async ?Version {
    switch (boards.get(boardId)) {
      case (null) { null };
      case (?boardState) { ?boardState.version };
    };
  };

  public query ({ caller }) func getBoardContent(boardId : BoardId) : async ?{
    operations : [Operation];
    version : Version;
    background : BoardBackground;
  } {
    switch (boards.get(boardId)) {
      case (null) { null };
      case (?boardState) {
        ?{
          operations = boardState.operations.toArray().sort();
          version = boardState.version;
          background = boardState.metadata.background;
        };
      };
    };
  };
};
