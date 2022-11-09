export function getConstructorName(target: any): string {
  return (target.prototype || target.__proto__ || target).constructor.name;
}
