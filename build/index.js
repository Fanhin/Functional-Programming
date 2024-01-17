"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("fs/promises");
var effect_1 = require("effect");
function readCsvFile(path) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                // 2 jobs
                // const data = await readFile(path, { encoding: "utf8" });
                // return data.split("\n").map((row) => row.split(","));
                return [2 /*return*/, (0, promises_1.readFile)(path, { encoding: "utf8" })];
            }
            catch (error) {
                return [2 /*return*/, null];
            }
            return [2 /*return*/];
        });
    });
}
function extractStringFromCsvToTable(raw) {
    if (raw == null)
        return [];
    return raw.split("\n").map(function (row) { return row.split(","); });
}
function removeHeader(data) {
    // mutate array change to slice
    //   return data.splice(1);
    return data.slice(1); // specific value then change fn to rm row by index
}
// function removeRowIndex(rowIndex: number, data: string[][]): string[][] {
//   return [...data.slice(0, rowIndex), ...data.slice(rowIndex + 1)];
// }
// currying
var removeRowIndex = function (rowIndex) {
    return function (data) {
        return __spreadArray(__spreadArray([], data.slice(0, rowIndex), true), data.slice(rowIndex + 1), true);
    };
};
function extractScores(data) {
    if (data.length == 0)
        return [];
    // 2 jobs
    return data.map(function (row) { return row[1]; }).map(Number.parseFloat); // too specific then split into 2 fn
}
// function extractColumn(columnIndex: number, data: string[][]): string[] {
//   return data.map((row) => row[columnIndex]);
// }
// currying
var extractColumn = function (columnIndex) {
    return function (data) {
        return data.map(function (row) { return row[columnIndex]; });
    };
};
function convertToFloat(data) {
    return data.map(function (value) { return Number.parseFloat(value); }); // too specific for parseFloat
}
// function convertTo<T>(converter: (value: string) => T, data: string[]): T[] {
//   return data.map(converter);
// }
//currying
var convertTo = function (converter) {
    return function (data) {
        return data.map(converter);
    };
};
var ensureAllFloatValues = function (data) {
    if (data.some(isNaN)) {
        return null;
    }
    return data;
};
var calCulateAverage = function (scores) {
    if (scores == null || scores.length == 0)
        return 0;
    return scores.reduce(function (a, b) { return a + b; }, 0) / scores.length;
};
// higher order function
// async function pipe(
//   fn1: Promise<string | null>,
//   fn2: (x: string | null) => string[][]
// ) {
//   return fn2(await fn1);
// }
var csvFilePath = "asset/example.csv";
var scoreColumnIndex = 1;
var headerRowIndex = 0;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var raw, removeHeader, extractScores, convertToFloat, csvData, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, readCsvFile(csvFilePath)];
                case 1:
                    raw = _b.sent();
                    //guard
                    if (raw == null) {
                        console.log("read csv error");
                        return [2 /*return*/];
                    }
                    removeHeader = removeRowIndex(headerRowIndex);
                    extractScores = extractColumn(scoreColumnIndex);
                    convertToFloat = convertTo(Number.parseFloat);
                    _a = effect_1.pipe;
                    return [4 /*yield*/, readCsvFile(csvFilePath)];
                case 2:
                    csvData = _a.apply(void 0, [_b.sent(), 
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
                    ]);
                    console.log("The average is ".concat(csvData));
                    return [2 /*return*/];
            }
        });
    });
}
main();
// Do one thing & Do it well
// Fn composition fn auto pass to next fn compose and pipe fn
// Unary fn that receives 1 parameter
// partial applied
