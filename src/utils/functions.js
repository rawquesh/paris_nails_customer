export function documentDataToObject(doc) {
  return { id: doc.id, ...doc.data() };
}
export function getArrayOfIDs(item) {
  return item.id;
}



export function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}