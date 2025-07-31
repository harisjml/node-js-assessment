const db = require('../Connection/connection');

const getCarList = async (req, res) => {
  try {
    const { carname , pageindex, pagesize, timestamp } = req.body;

    // Validate required fields
    // if (!pageindex || !pagesize || !timestamp) {
    //   return res.status(400).json({ message: "pageindex, pagesize, and timestamp are required" });
    // }

    const offset = (pageindex - 1) * pagesize;

    // total count using carname
    const [countResult] = await db.query(
      "SELECT COUNT(*) AS total FROM car WHERE carname LIKE ?",
      [`%${carname}%`]
    );
    const totalcount = countResult[0].total;

    // query paginated car list
    const [cars] = await db.query(
      "SELECT * FROM car WHERE carname LIKE ? ORDER BY car_id LIMIT ? OFFSET ?",
      [`%${carname}%`, pagesize, offset]
    );

    // get all variances for listed cars
    const carIds = cars.map(car => car.car_id);
    let variances = [];

    if (carIds.length > 0) {
      const [variantRows] = await db.query(
        "SELECT * FROM car_variance WHERE car_id IN (?)",
        [carIds]
      );
      variances = variantRows;
    }

    // map variances to car
    const list = cars.map(car => {
      const carVariances = variances
        .filter(v => v.car_id === car.car_id)
        .map(v => ({
          id: v.id,
          name: v.name,
          price: v.price
        }));

      return {
        id: car.car_id,
        carname: car.carname,
        brand: car.brand,
        description: car.description,
        variance: carVariances
      };
    });

    res.status(200).json({
      list,
      totalcount
    });

  } catch (error) {
    console.error("Error in getCarList:", error);
    res.status(403).json({ errors: "Failed" });
  }
};

module.exports = { getCarList };
