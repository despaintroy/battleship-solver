import { Coordinate } from "./coordinate";
import { quickEvaluateShots } from "./quickEvaluateShots";
import { Orientation, Ship, ShipType } from "./Ship";
import { Shot } from "./Shot";

export class OpponentBoard {
  private shots: Shot[] = [];
  private sunkShips: ShipType[] = [];

  constructor() {
    this.shots = [];
    this.sunkShips = [];
  }

  public addShot(shot: Shot): boolean {
    const newShots = [...this.shots, shot];

    const quickEvaluation = quickEvaluateShots(newShots);

    if (!quickEvaluation.isValid) {
      return false;
    }

    this.sunkShips = quickEvaluation.sunkShips;
    this.shots.push(shot);

    return true;
  }

  public getProbabilityGrid(): Record<ShipType, number>[][] {
    const possibilitiesCount = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({
        [ShipType.CARRIER]: 0,
        [ShipType.BATTLESHIP]: 0,
        [ShipType.DESTROYER]: 0,
        [ShipType.SUBMARINE]: 0,
        [ShipType.PATROL_BOAT]: 0,
      }))
    );

    const carrierState = {
      position: new Coordinate(0, 0),
      orientation: "horizontal" as Orientation,
    };

    let totalPossibilities = 0;

    while (true) {
      totalPossibilities++;

      try {
        const carrier = new Ship(
          ShipType.CARRIER,
          carrierState.position,
          carrierState.orientation
        );

        carrier
          .getCoordinates()
          .forEach(
            (coordinate) =>
              (possibilitiesCount[coordinate.row][coordinate.col][
                ShipType.CARRIER
              ] += 1)
          );
      } catch {
        // no-op: Invalid ship position
      }

      // Move to the next orientation
      if (carrierState.orientation === "horizontal") {
        carrierState.orientation = "vertical";
        continue;
      }

      carrierState.orientation = "horizontal";

      // Reached end of the board
      if (carrierState.position.row === 9 && carrierState.position.col === 9) {
        break;
      }

      // Reached end of the row
      if (carrierState.position.col === 9) {
        carrierState.position = new Coordinate(
          carrierState.position.row + 1,
          0
        );
        continue;
      }

      // Move to the next column
      carrierState.position = new Coordinate(
        carrierState.position.row,
        carrierState.position.col + 1
      );
    }

    // this.shots.forEach((shot) => {
    //   if (shot.shipType) {
    //     probabilityGridCount[shot.coordinate.row][shot.coordinate.col][
    //       shot.shipType
    //     ] = 1;
    //   }
    // });

    return possibilitiesCount.map((row) =>
      row.map(
        (cell) =>
          Object.fromEntries(
            Object.entries(cell).map(([shipType, count]) => [
              shipType,
              count / totalPossibilities,
            ])
          ) as Record<ShipType, number>
      )
    );
  }

  public getShotGrid(): (Shot | null)[][] {
    const grid: (Shot | null)[][] = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => null)
    );

    this.shots.forEach((shot) => {
      grid[shot.coordinate.row][shot.coordinate.col] = shot;
    });

    return grid;
  }

  public toString(): string {
    return this.getShotGrid()
      .map((row) =>
        row
          .map((cell) => {
            if (cell === null) {
              return "-";
            }

            if (cell.shipType) {
              return "X";
            }

            return "O";
          })
          .join(" ")
      )
      .join("\n");
  }
}
