function binarySearch(arr, value) {

  let leftIndex = 0;
  let rightIndex = arr.length - 1;
  while (leftIndex <= rightIndex) {
    let middleIndex = Math.floor((leftIndex + rightIndex) / 2);
    if (arr[middleIndex] === value) {
      return middleIndex;
    }
    if (value < arr[middleIndex]) {
      rightIndex = middleIndex - 1;
    } else {
      leftIndex = middleIndex + 1;
    }
  }
  return -1;
}
const arr = [0, 10, 15, 16, 88, 100];
console.log(binarySearch(arr, 16));

