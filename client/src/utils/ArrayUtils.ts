class ArrayUtils {
    // Метод для получения максимального значения из массива
    static getMax(arr: number[]): number {
      if (arr.length === 0) {
        return 0
      }
      return Math.max(...arr);
    }
  
    // Метод для получения минимального значения из массива
    static getMin(arr: number[]): number {
      if (arr.length === 0) {
        return 0;
      }
      return Math.min(...arr);
    }
  
    // Метод для получения среднего значения из массива
    static getAverage(arr: number[]): number {
      if (arr.length === 0) {
        return 0;
      }
      const sum = arr.reduce((acc, val) => acc + val, 0);
      return sum / arr.length;
    }
  }
  

  export default ArrayUtils