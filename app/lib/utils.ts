import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Guid } from "guid-typescript";
import {v4 as uuidV4} from 'uuid';
import {createId as cuid2} from '@paralleldrive/cuid2';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function uuidVersionless() {
  const base = uuidV4();
  const randomNibble = Math.floor(Math.random() * 16).toString(16);
  return base.replace(/^([0-9a-f]{8}-[0-9a-f]{4}-)4/, `$1${randomNibble}`);
}

function unicodeUID(length = 16) {
  const ranges = [
    [0x0370, 0x03FF],
    [0x0400, 0x04FF],
    [0x3040, 0x309F],
    [0x30A0, 0x30FF],
    [0x1F300, 0x1F5FF]
  ];
  const pick = () => {
    const [min, max] = ranges[Math.floor(Math.random() * ranges.length)];
    return String.fromCodePoint(min + Math.floor(Math.random() * (max - min)));
  };
  return Array.from({ length }, pick).join("");
}

const guid = Guid.create;

export {
  guid,
  cuid2,
  uuidV4,
  unicodeUID,
  uuidVersionless,
}