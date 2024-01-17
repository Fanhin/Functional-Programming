import { readFile } from "fs/promises";
import { pipe } from "effect";

async function readCsvFile(path: string): Promise<string | null> {
  try {
    // 2 jobs
    // const data = await readFile(path, { encoding: "utf8" });
    // return data.split("\n").map((row) => row.split(","));
    return readFile(path, { encoding: "utf8" });
  } catch (error) {
    return null;
  }
}

function extractStringFromCsvToTable(raw: string | null): string[][] {
  if (raw == null) return [];
  return raw.split("\n").map((row) => row.split(","));
}

function removeHeader(data: string[][]): string[][] {
  // mutate array change to slice
  //   return data.splice(1);
  return data.slice(1); // specific value then change fn to rm row by index
}

// function removeRowIndex(rowIndex: number, data: string[][]): string[][] {
//   return [...data.slice(0, rowIndex), ...data.slice(rowIndex + 1)];
// }

// currying
const removeRowIndex =
  (rowIndex: number) =>
  (data: string[][]): string[][] => {
    return [...data.slice(0, rowIndex), ...data.slice(rowIndex + 1)];
  };

function extractScores(data: string[][]): number[] {
  if (data.length == 0) return [];
  // 2 jobs
  return data.map((row) => row[1]).map(Number.parseFloat); // too specific then split into 2 fn
}

// function extractColumn(columnIndex: number, data: string[][]): string[] {
//   return data.map((row) => row[columnIndex]);
// }

// currying
const extractColumn =
  (columnIndex: number) =>
  (data: string[][]): string[] =>
    data.map((row) => row[columnIndex]);

function convertToFloat(data: string[]): number[] {
  return data.map((value) => Number.parseFloat(value)); // too specific for parseFloat
}

// function convertTo<T>(converter: (value: string) => T, data: string[]): T[] {
//   return data.map(converter);
// }

//currying
const convertTo =
  <T>(converter: (value: string) => T) =>
  (data: string[]): T[] => {
    return data.map(converter);
  };

const ensureAllFloatValues = (data: any[]): number[] | null => {
  if (data.some(isNaN)) {
    return null;
  }
  return data as number[];
};

const calCulateAverage = (scores: number[] | null): number | null => {
  if (scores == null || scores.length == 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
};

// higher order function
// async function pipe(
//   fn1: Promise<string | null>,
//   fn2: (x: string | null) => string[][]
// ) {
//   return fn2(await fn1);
// }

const csvFilePath = "asset/example.csv";
const scoreColumnIndex = 1;
const headerRowIndex = 0;

async function main() {
  //without extract function to one job do it well
  //   const csvData = await readCsvFile("");
  //   const dataWithoutHeader = removeHeader(csvFilePath);
  //   const scores = extractScores(dataWithoutHeader);
  //   const scoresAsNumber = ensureAllFloatValues(scores);
  //   const avg = calCulateAverage(scoresAsNumber || []);

  //with extract fn to one job
  const raw = await readCsvFile(csvFilePath);
  //guard
  if (raw == null) {
    console.log("read csv error");

    return;
  }
  // assign and pass
  //   const csvData = extractStringFromCsvToTable(raw);
  //   const dataWithoutHeader = removeRowIndex(headerRowIndex, csvData);
  //   const scoresStr = extractColumn(scoreColumnIndex, dataWithoutHeader);
  //   const scores = convertTo(Number.parseFloat, scoresStr);
  //   const scoresAsNumber = ensureAllFloatValues(scores);
  //   const avg = calCulateAverage(scoresAsNumber || []);

  //using pipe
  //partial applied
  const removeHeader = removeRowIndex(headerRowIndex);
  const extractScores = extractColumn(scoreColumnIndex);
  const convertToFloat = convertTo(Number.parseFloat);

  const csvData = pipe(
    await readCsvFile(csvFilePath),
    //use Unary functions the change to currying
    extractStringFromCsvToTable,
    removeHeader,
    extractScores,
    convertToFloat,
    ensureAllFloatValues,
    calCulateAverage
    // extractColumn,
    // convertToFloat,
    // ensureAllFloatValues,
    // calCulateAverage
  );

  console.log(`The average is ${csvData}`);
}

main();

// Do one thing & Do it well
// Fn composition fn auto pass to next fn compose and pipe fn
// Unary fn that receives 1 parameter
// partial applied
