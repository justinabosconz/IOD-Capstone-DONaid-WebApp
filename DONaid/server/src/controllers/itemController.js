const { Item, User } = require("../models");

exports.listAvailable = async (req, res, next) => {
  try {
    const items = await Item.findAll({
      where: { status: "AVAILABLE" },
      include: [
        { model: User, as: "owner", attributes: ["id", "displayName"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [
        { model: User, as: "owner", attributes: ["id", "displayName"] },
      ],
    });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, description, category, condition, imageUrl } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });

    const item = await Item.create({
      ownerUserId: req.user.id,
      title,
      description,
      category,
      condition,
      imageUrl,
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    if (item.ownerUserId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    const fields = [
      "title",
      "description",
      "category",
      "condition",
      "imageUrl",
      "status",
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) item[f] = req.body[f];
    });

    await item.save();
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    if (item.ownerUserId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    await item.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
