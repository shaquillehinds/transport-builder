import { Buffer } from "buffer";

export function kFormatter(num: number) {
  if (Math.abs(num) > 999) {
    let reformatted = (Math.sign(num) * (Math.abs(num) / 1000))
      .toFixed(1)
      .toString();
    return reformatted + "k";
  } else {
    return Math.sign(num) * Math.abs(num);
  }
}

/**
 *
 * This function will make the first letter of a string and make it capital
 *
 * @param {word} string
 * @returns string
 *
 */
export function firstLetterCap(word?: string) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function titleCase(words: string) {
  if (!words) return;
  let newWords = "";
  words.split(" ").forEach((word) => {
    newWords += word[0].toUpperCase() + word.slice(1) + " ";
  });
  return newWords.trim();
}

export function snakeToTitleCase(string: string) {
  return titleCase(string.replaceAll(/_/gm, " "));
}

/**
 * @example
 * ```welcomeToJamrock => WELCOME_TO_JAMROCK```
 */
export function camelToUpperSnake(str: string) {
  return str
    .replace(/[A-Z]/g, (letter) => `_${letter.toUpperCase()}`)
    .toUpperCase();
}

interface CentsToDollarsProps {
  cents: number;
  dollarSign?: boolean;
  currency?: string;
}

export function centsToDollars({
  cents,
  dollarSign,
  currency = "",
}: CentsToDollarsProps): string {
  return `${dollarSign ? "$" : ""}${(cents / 100).toFixed(2)}${
    currency ? " " + currency : ""
  }`;
}

export function _24hrsToDate(string: string) {
  if (string.length !== 4) throw new Error("Not 24hr string");
  let hours = parseInt(string.slice(0, 2), 10);
  let mins = parseInt(string.slice(2), 10);
  return new Date(2022, 6, 20, hours, mins);
}

export function toBase64(string: string) {
  return new Buffer(string, "utf-8").toString("base64");
}

export function fromBase64(string: string) {
  return new Buffer(string, "base64").toString("utf-8");
}

export function objToQueryStr(obj: { [key: string]: any }) {
  return Object.entries(obj)
    .filter((pair) => pair[1] !== undefined)
    .map((pair) => `${pair[0]}=${pair[1]}`)
    .join("&");
}

export function getTodayInSeconds() {
  const now = new Date();
  let seconds = now.getHours() * 3600;
  seconds += now.getMinutes() * 60;
  seconds += now.getSeconds();
  return seconds;
}

export function sanitizePhoneNumber(number: string, addPlus?: boolean) {
  number = number.replace(/(\(|\)|-|\s)/g, "");
  if (addPlus && !number.includes("+")) number = "+" + number;
  return number;
}
