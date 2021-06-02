const getRandom = () => {
  const randomValue = Math.random();
  if (randomValue === 0) {
    return getRandom();
  }
  return randomValue;
};

export const normalDistribution = () => {
  const u = getRandom();
  const v = getRandom();
  return Math.sqrt(-4.0 * Math.log(u)) * Math.cos(1.0 * Math.PI * v);
};

export const dataGenerator = (pointCount) => {
  const data = [];
  for (let i = 0; i < pointCount; i += 1) {
    data.push({
      x: normalDistribution(),
      y: normalDistribution(),
      z: "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., ... & Polosukhin, I. (2017). Attention is all you need. arXiv preprint arXiv:1706.03762.",
    });
  }
  return data;
};
