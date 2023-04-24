export const calculateDelayToNext9PM = () => {
  const now = new Date();
  const target = new Date(now);

  target.setHours(21, 0, 0, 0); // 21 hours = 9 PM

  if (now >= target) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime() - now.getTime();
}
