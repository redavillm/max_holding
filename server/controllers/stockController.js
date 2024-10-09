const getCars = async (db, req, res) => {
  try {
    const { mark } = req.query;

    let filter = mark ? { mark } : {};

    if (mark) {
      const marksArray = mark.split(",");
      filter.mark = { $in: marksArray };
    }

    const cars = await db
      .collection("stock")
      .aggregate([
        { $match: filter },
        { $sort: { mark: 1 } },
        {
          $project: {
            _id: 1,
            mark: 1,
            model: 1,
            engine: 1,
            drive: 1,
            equipmentName: 1,
            price: 1,
            createdAt: 1,
          },
        },
      ])
      .toArray();

    res.status(200).json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMarksWithCounts = async (db, req, res) => {
  try {
    const marks = await db
      .collection("stock")
      .aggregate([
        { $group: { _id: "$mark", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    res.status(200).json(marks);
  } catch (error) {
    console.error("Error fetching marks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCars, getMarksWithCounts };
