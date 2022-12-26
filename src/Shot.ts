import { Coordinate } from "./coordinate";
import { ShipType } from "./Ship";

export class Shot {
  constructor(
    readonly coordinate: Coordinate,
    readonly isHit: boolean,
    readonly shipType?: ShipType
  ) {
    if (isHit && !shipType) {
      throw new Error("Shot is a hit but no ship type is provided");
    }

    if (!isHit && shipType) {
      throw new Error("Shot is not a hit but a ship type is provided");
    }
  }
}
