
export function transpose(matrix) {
  return matrix[0].map((_, c) => matrix.map(r => r[c]))
}

export function resize(arr, width, height, val = 0) {
  const newRow = row =>
    Array.from({ length: width }, (_, i) => {
      return i < row.length ? row[i] : val
    })
  return Array.from({ length: height }, (_, i) => {
    return i < arr.length
      ? newRow(arr[i])
      : Array.from({ length: width }, () => val)
  })
}

export function createArray2D(rows, columns) {
  return [...Array(rows).keys()].map(() => Array(columns))
}

export function fillArray2D(anArray) {
  return anArray.map(row => row.fill(0))
}
