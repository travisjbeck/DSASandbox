function cartesianProduct(set1, set2) {
  let output = [];
  for (var i = 0; i < set1.length; i++) {
    for (var j = 0; j < set2.length; j++) {
      output.push([set1[i], set2[j]]);
    }
  }
  return output;
}


// Example Usage
console.log(cartesianProduct([1, 2], [3, 4, 5]))