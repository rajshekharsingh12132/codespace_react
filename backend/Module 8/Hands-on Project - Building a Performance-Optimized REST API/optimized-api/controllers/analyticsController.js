const { redisClient } = require('../utils/cache');
const Order = require('../models/Order');
exports.getOrderAnalytics = async (req, res, next) => {
  try {
    const cacheKey = `analytics:${req.query.startDate}-${req.query.endDate}`;
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const pipeline = [
      {
        $match: {
          createdAt: {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
          avgOrderValue: { $avg: "$amount" }
        }
      }
    ];

    const analytics = await Order.aggregate(pipeline).cache({ key: cacheKey });
    
    res.json(analytics[0] || {});
  } catch (err) {
    next(err);
  }
};