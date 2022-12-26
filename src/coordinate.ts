export class Coordinate {
  constructor(readonly row: number, readonly col: number) {
    if (!Coordinate.isValid(row, col)) {
      throw new Error("Invalid coordinate");
    }
  }

  public equals(other: Coordinate): boolean {
    return this.row === other.row && this.col === other.col;
  }

  public getLabel(): string {
    return `${String.fromCharCode(65 + this.row)}${this.col + 1}`;
  }

  public static isValid(row: number, col: number): boolean {
    return row >= 0 && row <= 9 && col >= 0 && col <= 9;
  }
}
