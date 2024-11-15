//The _ means you can call the function with out a labeled arguments like bubbleSort(arr: array)
func bubbleSort(_ arr: [Int]) -> [Int] {
  var sorted = arr
  var right = sorted.count - 1

  while right > 0 {

    for i in 0..<right {
      if sorted[i] > sorted[i + 1] {
        //thou shalt swapeth with thine brethren
        let temp = sorted[i + 1]
        sorted[i + 1] = sorted[i]
        sorted[i] = temp
      }
    }
    right-=1
  }
  return sorted;
}

let array = [5,6,3,4,2,1]
print(bubbleSort(array));
