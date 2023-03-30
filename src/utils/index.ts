export function rally(independent: FormData) {
  const dependent: any = {};

  for (const [key] of independent.entries()) {
    const value = independent.getAll(key);
    dependent[key] = value.length > 1 ? value : value[0];
  }

  return dependent;
}
