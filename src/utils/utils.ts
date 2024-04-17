export const randomBgColor = () => {
  const colors = [
    "bg-pink-300",
    "bg-purple-300",
    "bg-indigo-300",
    "bg-blue-300",
    "bg-green-300",
    "bg-yellow-300",
    "bg-orange-300",
    "bg-red-300",
    "bg-teal-300",
    "bg-cyan-300",
    "bg-rose-300",
    "bg-emerald-300",
    "bg-lightBlue-300",
    "bg-fuchsia-300",
    "bg-cyan-300",
    "bg-warmGray-300",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};
