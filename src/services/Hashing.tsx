import RnHash from "react-native-hash";

const hashString = async (value: string, algorithm: string) => {
  return await RnHash.hashString(value, algorithm);
}

const Hashing = {
  hashString
};

export default Hashing;