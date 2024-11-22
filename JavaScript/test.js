// function isPrime(n) {
//   for (var i = 2; i <= Math.floor(Math.log2(n)); i++) {
//     if (n % i == 0) {
//       return false;
//     }
//   }
//   return true;
// }

// console.log(Math.floor(Math.log2(10)));


function isPrime(n) {
  for (var i = 1; i <= n; i++) {
    if ((i !== 1) && (i !== n) && (n % i == 0)) {
      return false;
    }
  }
  return true;
}



console.log(isPrime(0));