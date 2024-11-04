function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

// Example usage
const sortedArray = mergeSort([38, 27, 43, 3, 9, 82, 10]);
console.log(sortedArray); // Output: [3, 9, 10, 27, 38, 43, 82]


function cartesian(set1, set2) {
  let output = [];
  for (var i = 0; i < set1.length; i++) {
    for (var j = 0; j < set2.length; j++) {
      output.push([set1[i], set2[j]]);
    }
  }
  return output;
}


// Example Usage
//console.log(cartesian([1, 2], [3, 4, 5]))





