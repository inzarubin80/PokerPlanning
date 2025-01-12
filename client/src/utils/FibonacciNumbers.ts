const generateFibonacciNumbers = (limit: number): number[] => {
    const fibNumbers: number[] = [1, 2];
    while (fibNumbers[fibNumbers.length - 1] + fibNumbers[fibNumbers.length - 2] <= limit) {
      fibNumbers.push(fibNumbers[fibNumbers.length - 1] + fibNumbers[fibNumbers.length - 2]);
    }
    return fibNumbers;
};
export default generateFibonacciNumbers