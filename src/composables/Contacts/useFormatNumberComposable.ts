export const formatInputNumber = (value: string) => {
  if (!value) return "";

  let cleaned = value.replace(/\D/g, "");

  // 👇 NÃO mexe se ainda está digitando só "55"
  if (cleaned.length <= 2) {
    return cleaned;
  }

  let ddi = "";

  if (cleaned.startsWith("55")) {
    ddi = "+55 ";
    cleaned = cleaned.slice(2);
  }

  // ainda incompleto → não formata
  if (cleaned.length < 10) {
    return ddi + cleaned;
  }

  cleaned = cleaned.slice(0, 11);

  const ddd = cleaned.slice(0, 2);
  const part1 =
    cleaned.length === 11 ? cleaned.slice(2, 7) : cleaned.slice(2, 6);

  const part2 = cleaned.slice(-4);

  return `${ddi}(${ddd}) ${part1}-${part2}`;
};
