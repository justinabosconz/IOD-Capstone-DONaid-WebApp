// items.controller.js
const path = require("path");
const { Item, User } = require("../models");
const { saveDataUrlImage } = require("../utility/fileUpload");

async function listItems(req, res) {
  const items = await Item.findAll({
    include: [
      { model: User, as: "owner", attributes: ["id", "displayName", "email"] },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json(items);
}

async function getItem(req, res) {
  const item = await Item.findByPk(req.params.id, {
    include: [
      { model: User, as: "owner", attributes: ["id", "displayName", "email"] },
    ],
  });
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
}

async function createItem(req, res) {
  try {
    const { title, description, category, itemCondition, imageDataUrl } =
      req.body;
    if (!title || !description)
      return res
        .status(400)
        .json({ message: "title and description required" });

    const uploadRoot = path.join(
      process.cwd(),
      process.env.UPLOAD_DIR || "uploads",
    );
    const fileName = imageDataUrl
      ? saveDataUrlImage(imageDataUrl, uploadRoot)
      : null;

    const item = await Item.create({
      ownerId: req.user.id,
      title,
      description,
      category: category || null,
      itemCondition: itemCondition || null,
      imagePath: fileName,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Create item failed", error: err.message });
  }
}

async function updateItem(req, res) {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.ownerId !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    const { title, description, category, itemCondition, status } = req.body;

    await item.update({
      title: title ?? item.title,
      description: description ?? item.description,
      category: category ?? item.category,
      itemCondition: itemCondition ?? item.itemCondition,
      status: status ?? item.status,
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Update item failed", error: err.message });
  }
}

async function deleteItem(req, res) {
  const item = await Item.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  if (item.ownerId !== req.user.id)
    return res.status(403).json({ message: "Not allowed" });

  await item.destroy();
  res.json({ message: "Item deleted" });
}

module.exports = { listItems, getItem, createItem, updateItem, deleteItem };
