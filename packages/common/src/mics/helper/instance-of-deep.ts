export const instanceOfDeep = <T>(target: any, classes: T | T[]): boolean => {
  if (!Array.isArray(classes)) classes = [classes];
  if (classes.some((child: any): boolean => target instanceof child)) return true;
  if (target === undefined || target.prototype === undefined) return false;
  return instanceOfDeep(target.prototype, classes);
};
