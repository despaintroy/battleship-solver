import { Coordinate } from "./coordinate";
import { OpponentBoard } from "./OpponentBoard";
import { ShipType } from "./Ship";
import { Shot } from "./Shot";
import "./style.css";

const board = new OpponentBoard();

const addShotButton = document.createElement("button");
addShotButton.innerText = "Shoot";
addShotButton.addEventListener("click", () => {
  const row = Math.floor(Math.random() * 10);
  const col = Math.floor(Math.random() * 10);
  const isHit = Math.random() > 0.5;
  const shipType = isHit
    ? Object.values(ShipType)[Math.floor(Math.random() * 5)]
    : undefined;
  const isValid = board.addShot(
    new Shot(new Coordinate(row, col), isHit, shipType)
  );

  if (isValid) {
    console.log(board.toString());
    updateProbabilityGrid();
  } else {
    console.log("Invalid shot");
  }
});

const probabilityGridElement = document.createElement("div");

function updateProbabilityGrid() {
  probabilityGridElement.classList.add("probability-grid");

  probabilityGridElement.innerHTML = "";

  const probabilityGrid = board.getProbabilityGrid();

  let maxCellProbability = 0;

  const summedProbabilityGrid = probabilityGrid.map((row) =>
    row.map((cell) => {
      const totalCellProbability = Object.values(cell).reduce(
        (acc, curr) => acc + curr,
        0
      );
      if (totalCellProbability > maxCellProbability) {
        maxCellProbability = totalCellProbability;
      }
      return totalCellProbability;
    })
  );

  summedProbabilityGrid.forEach((row) => {
    row.forEach((probability) => {
      const normalizedProbability = probability / maxCellProbability;

      const probabilityGridCell = document.createElement("div");
      probabilityGridCell.classList.add("probability-grid-cell");
      probabilityGridCell.innerText = probability.toFixed(2);
      probabilityGridCell.style.backgroundColor = `rgba(0, 0, 0, ${normalizedProbability}`;
      probabilityGridCell.style.color =
        normalizedProbability > 0.5 ? "white" : "black";
      probabilityGridElement.appendChild(probabilityGridCell);
    });
  });
}

const app = document.querySelector<HTMLDivElement>("#app")!;
app.appendChild(addShotButton);
app.appendChild(probabilityGridElement);
