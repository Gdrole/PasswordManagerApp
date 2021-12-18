import { v4 as uuidv4 } from 'uuid';

const generateUUID = () => {
  return uuidv4();
}

const stringToBytes = (string: string) => {
  const bytes = [];

  for (let c: number = 0; c < string.length; c += 2) {
    bytes.push(parseInt(string.substr(c, 2), 16));
  }

  return bytes
}

const Utils = {
  generateUUID,
  stringToBytes
};

export default Utils;