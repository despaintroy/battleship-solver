import { shipLengths, ShipType } from "./Ship";
import { Shot } from "./Shot";

export function quickEvaluateShots(shots: Shot[]): {
  isValid: boolean;
  sunkShips: ShipType[];
} {
  const shotsByShipType: Record<ShipType, Shot[]> = {
    [ShipType.CARRIER]: [],
    [ShipType.BATTLESHIP]: [],
    [ShipType.DESTROYER]: [],
    [ShipType.SUBMARINE]: [],
    [ShipType.PATROL_BOAT]: [],
  };

  const shotSet = new Set<string>();

  const sunkShips: ShipType[] = [];

  // Trivial checks for invalid shots
  try {
    for (const shot of shots) {
      if (shotSet.has(shot.coordinate.getLabel())) {
        throw new Error("Shot already exists");
      }

      shotSet.add(shot.coordinate.getLabel());

      if (shot.shipType) {
        shotsByShipType[shot.shipType].push(shot);
      }
    }

    for (const [shipType, shots] of Object.entries(shotsByShipType)) {
      const shipLength = shipLengths[shipType as ShipType];

      if (shots.length === 0) {
        continue;
      }

      if (shots.length > shipLength) {
        throw new Error("Too many shots for a ship");
      }

      const { minRow, maxRow, minCol, maxCol } = shots.reduce(
        (acc, shot) => ({
          minRow: Math.min(acc.minRow, shot.coordinate.row),
          maxRow: Math.max(acc.maxRow, shot.coordinate.row),
          minCol: Math.min(acc.minCol, shot.coordinate.col),
          maxCol: Math.max(acc.maxCol, shot.coordinate.col),
        }),
        {
          minRow: 10,
          maxRow: 0,
          minCol: 10,
          maxCol: 0,
        }
      );

      if (minRow !== maxRow && minCol !== maxCol) {
        throw new Error("Shots for a ship do not form a line");
      }

      if (
        maxRow - minRow + 1 > shipLength ||
        maxCol - minCol + 1 > shipLength
      ) {
        throw new Error("Shots for a ship form a line that is too long");
      }

      if (shots.length === shipLength) {
        sunkShips.push(shipType as ShipType);
      }
    }
  } catch (e) {
    console.error(e);

    return {
      isValid: false,
      sunkShips: [],
    };
  }

  return {
    isValid: true,
    sunkShips,
  };
}
