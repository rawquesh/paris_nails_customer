import { randomInteger } from "./math";

export default function getRandomColor() {
  const colors = [
    4289901049, 4294554068, 4288276984, 4288264952, 4288275704, 4288280777,
    4294951139, 4290831359, 4294958272,
  ];

  const i = randomInteger(0, colors.length - 1);
  return colors[i];
}
