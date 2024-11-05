function quickSort(arr) {

  if (arr.length < 2) {
    return arr;
  }
  const pivot = arr[arr.length - 1];

  const left = [];
  const right = [];

  for (var i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];

}

const arr = [-1, 5, 0, 10, 15, 4, 38, 2, 18, 95, -49];
console.log(quickSort(arr));