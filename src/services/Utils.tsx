import { v4 as uuidv4 } from 'uuid';

const generateUUID = () => {
  return uuidv4();
}

const Utils = {
  generateUUID
};

export default Utils;