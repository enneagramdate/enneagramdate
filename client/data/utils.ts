export const mapToJSON = (map: Map<any, any>) => {
  return JSON.stringify(Object.fromEntries(map));
};
