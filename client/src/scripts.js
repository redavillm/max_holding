export const formatDate = (isoDateString) => {
  return new Date(isoDateString)
    .toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", "");
};

export const transformData = (dataObj) => {
  const result = [];

  for (let car of dataObj) {
    const {
      _id,
      mark,
      model,
      engine,
      drive = "",
      equipmentName,
      price,
      createdAt,
    } = car;
    const { power, volume, transmission } = engine;
    result.push({
      id: _id,
      model: `${mark} ${model}`,
      mod: `${volume}.0 ${transmission} (${power} л.с.) ${drive}`,
      equipmentName,
      price: `${price} ₽`,
      date: formatDate(createdAt),
    });
  }
  return result;
};
