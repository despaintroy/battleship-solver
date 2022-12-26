import { quickEvaluateShots } from "./quickEvaluateShots";
import { ShipType } from "./Ship";
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
    const probabilityGrid = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({
        [ShipType.CARRIER]: 0,
        [ShipType.BATTLESHIP]: 0,
        [ShipType.DESTROYER]: 0,
        [ShipType.SUBMARINE]: 0,
        [ShipType.PATROL_BOAT]: 0,
      }))
    );

    this.shots.forEach((shot) => {
      if (shot.shipType) {
        probabilityGrid[shot.coordinate.row][shot.coordinate.col][
          shot.shipType
        ] = 1;
      }
    });

    return probabilityGrid;
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
