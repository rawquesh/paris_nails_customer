export function documentDataToObject(doc) {
  return { id: doc.id, ...doc.data() };
}
export function getArrayOfIDs(item) {
  return item.id;
}



