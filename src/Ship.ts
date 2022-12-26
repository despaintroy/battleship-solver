import { Coordinate } from "./coordinate";

export class Ship {
  constructor(
    readonly type: ShipType,
    readonly position: Coordinate,
    readonly orientation: Orientation
  ) {
    const endRow =
      orientation === "horizontal"
        ? position.row + shipLengths[type] - 1
        : position.row;
    const endCol =
      orientation === "vertical"
        ? position.col + shipLengths[type] - 1
        : position.col;

    if (!Coordinate.isValid(endRow, endCol)) {
      throw new Error("Ship os positioned outside the board");
    }

    this.type = type;
    this.position = position;
    this.orientation = orientation;
  }

  /**
   * Gets all coordinates covered by the ship
   */
  public getCoordinates(): Coordinate[] {
    const coordinates: Coordinate[] = [];

    for (let i = 0; i < this.getLength(); i++) {
      coordinates.push(
        this.orientation === "horizontal"
          ? new Coordinate(this.position.row, this.position.col + i)
          : new Coordinate(this.position.row + i, this.position.col)
      );
    }

    return coordinates;
  }

  public getLength(): number {
    return shipLengths[this.type];
  }

  public getType(): ShipType {
    return this.type;
  }

  public getPosition(): Coordinate {
    return this.position;
  }

  public getOrientation(): Orientation {
    return this.orientation;
  }
}

export enum ShipType {
  CARRIER = "Carrier",
  BATTLESHIP = "Battleship",
  DESTROYER = "Destroyer",
  SUBMARINE = "Submarine",
  PATROL_BOAT = "Patrol Boat",
}

export const shipLengths = {
  [ShipType.CARRIER]: 5,
  [ShipType.BATTLESHIP]: 4,
  [ShipType.DESTROYER]: 3,
  [ShipType.SUBMARINE]: 3,
  [ShipType.PATROL_BOAT]: 2,
};

type Orientation = "horizontal" | "vertical";
