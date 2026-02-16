import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
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

  type OldBoardState = {
    operations : List.List<Operation>;
    version : Version;
    lastModified : Timestamp;
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

  type NewBoardState = {
    operations : List.List<Operation>;
    version : Version;
    lastModified : Timestamp;
    metadata : BoardMetadata;
  };

  type OldActor = {
    boards : Map.Map<BoardId, OldBoardState>;
  };

  type NewActor = {
    boards : Map.Map<BoardId, NewBoardState>;
  };

  public func run(old : OldActor) : NewActor {
    let newBoards = old.boards.map<BoardId, OldBoardState, NewBoardState>(
      func(_id, oldState) {
        {
          oldState with
          metadata = {
            background = #blank;
            createdBy = Principal.anonymous();
            createdAt = 0;
          };
        };
      }
    );
    { boards = newBoards };
  };
};
