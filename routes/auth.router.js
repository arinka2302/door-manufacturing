const express = require("express");
const router = express.Router();

const {
  sequelize,
  Op,
  Staff,
  Record,
  Course,
  Order,
  OrderDoor,
  Door,
  Supplier,
  Material,
} = require("../models");

const isAuth = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

const isAdmin = async (req, res, next) => {
  if (req.session.user.role === "admin") {
    next();
  } else {
    res.redirect("/login");
  }
};

router.use(isAuth);

router.get("/profile", isAuth, async (req, res) => {
  const courses = await Course.findAll({
    include: [{ model: Record, where: { staff_id: req.session.user.id } }],
  });
  const isAdmin = req.session.user.role === "admin";
  res.render("profile", { user: req.session.user, courses: courses, isAdmin });
});

router.get("/orders", isAuth, async (req, res) => {
  const orders = await Order.findAll({
    attributes: ["id", "status", "comment", "created_at", "updated_at"],
    include: [
      {
        model: OrderDoor,
        attributes: ["door_id", "quantity"],
        include: [
          {
            model: Door,
            attributes: ["name", "description", "price"],
          },
        ],
      },
    ],
    order: [["updated_at", "DESC"]],
  });
  const ordersData = orders.map((order) => {
    const firstOrderDoor = order.OrderDoors[0];

    return {
      id: order.id,
      door_id: firstOrderDoor.door_id,
      name: firstOrderDoor.Door.name,
      description: firstOrderDoor.Door.description,
      quantity: firstOrderDoor.quantity,
      status: order.status,
      comment: order.comment,
      totalPrice: order.OrderDoors.reduce(
        (sum, od) => sum + od.quantity * (od.Door.price || 0),
        0
      ).toFixed(2),
      created_at: order.created_at
        .toLocaleString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(",", ""),
    };
  });
  res.render("orders", { user: req.session.user, orders: ordersData });
});

router.get("/orders/search", isAuth, async (req, res) => {
  const { query } = req.query;

  const orderId = !isNaN(query) ? Number(query) : null;
  if (!orderId) {
    return res.render("orders-search", {
      user: req.session.user,
      query,
      orders: [],
    });
  }

  const orders = await Order.findAll({
    where: { id: orderId },
    include: [
      {
        model: OrderDoor,
        include: [Door],
      },
    ],
  });

  const ordersData = orders.map((order) => {
    const totalPrice = order.OrderDoors.reduce((sum, od) => {
      return sum + od.quantity * (od.Door ? od.Door.price : 0);
    }, 0);

    return {
      id: order.id,
      door_id: order.OrderDoors[0].door_id,
      name:
        order.OrderDoors.length > 0
          ? order.OrderDoors[0].Door.name
          : "Без двери",
      description:
        order.OrderDoors.length > 0 ? order.OrderDoors[0].Door.description : "",
      status: order.status,
      comment: order.comment,
      totalPrice: totalPrice.toFixed(2),
      created_at: order.created_at
        .toLocaleString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(",", ""),
    };
  });
  res.render("orders-search", {
    user: req.session.user,
    query: query,
    orders: ordersData,
  });
});

router.get("/orders/add", isAuth, async (req, res) => {
  const doors = await Door.findAll({
    where: {
      quantity: { [Op.gt]: 0 },
    },
    include: [
      {
        model: OrderDoor,
        required: false,
        attributes: [],
      },
      {
        model: Material,
        attributes: ["name"],
      },
    ],
  });
  const materials = await Material.findAll({
    attributes: ["id", "name", "quantity", "unit_price", "unit"],
    where: {
      quantity: {
        [Op.gt]: 0,
      },
    },
  });
  res.render("orders-add", {
    user: req.session.user,
    doors: doors,
    materials: materials,
  });
});

router.post("/materials/edit", isAdmin, async (req, res) => {
  const { materialId, newQuantity } = req.body;

  const parsedQuantity = parseInt(newQuantity, 10);
  if (!materialId || isNaN(parsedQuantity) || parsedQuantity < 0) {
    return res.status(400).json({ message: "Некорректные данные" });
  } else {
    const findMaterial = await Material.findOne({
      where: {
        id: materialId,
      },
    });

    findMaterial.quantity = parsedQuantity;
    findMaterial.save();
  }
  const refererUrl = req.headers.referer;

  if (refererUrl) {
    const url = new URL(refererUrl);
    res.redirect(url.pathname);
  } else {
    res.redirect("/admin");
  }
});

router.post("/orders/add", isAuth, async (req, res) => {
  const {
    door_id,
    material_id,
    width,
    height,
    thickness,
    price,
    color,
    quantity,
    comment,
  } = req.body;
  if (door_id != null) {
    const door = await Door.findOne({ where: { id: door_id } });
    if (door.quantity >= quantity) {
      const order = await Order.create({
        staff_id: req.session.user.id,
        status: "paid",
        comment: comment,
      });
      await door.update({ quantity: door.quantity - quantity });
      await OrderDoor.create({
        order_id: order.id,
        door_id: door_id,
        quantity: quantity,
      });
      res.redirect("/orders");
    }
  } else {
    const quantity_needed =
      (width / 1000) * (height / 1000) * (thickness / 1000) * quantity;
    const material = await Material.findOne({ where: { id: material_id } });
    if (material.quantity >= quantity_needed) {
      await material.update({ quantity: material.quantity - quantity_needed });

      const newCustomDoor = await Door.create({
        name: "Индивидуальный заказ",
        material_id: material_id,
        width: width,
        height: height,
        thickness: thickness,
        price: price,
        color: color,
        quantity: 0,
        guarantee: 5,
      });
      newCustomDoor.name = `Индивидуальный заказ ${newCustomDoor.id}`;
      await newCustomDoor.save();

      const newOrder = await Order.create({
        staff_id: req.session.user.id,
        status: "paid",
        comment: comment,
      });

      await OrderDoor.create({
        order_id: newOrder.id,
        door_id: newCustomDoor.id,
        quantity: quantity,
      });
      res.redirect("/orders");
    } else {
      res.status(400).json({ message: "Недостаточно материала" });
    }
  }
});

router.get("/orders/:id/edit", isAuth, async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({
    where: { id: id },
    attributes: ["id", "status", "comment"],
    include: [
      {
        model: OrderDoor,
        attributes: ["quantity"],
        include: [
          {
            model: Door,
            attributes: ["name", "description", "price"],
          },
        ],
      },
    ],
  });
  res.render("orders-edit", {
    title: order.OrderDoors[0].Door.name,
    order: order,
    quantity: order.OrderDoors[0].quantity,
  });
});

router.post("/orders/:id/edit", isAuth, async (req, res) => {
  const { id } = req.params;
  const { status, comment, quantity } = req.body;

  const order = await Order.findOne({ where: { id: id } });
  await order.update({ staff_id: req.session.user.id, status, comment });
  const orderDoor = await OrderDoor.findOne({ where: { order_id: order.id } });
  await orderDoor.update({ quantity });
  res.redirect("/orders");
});

router.post("/orders/:id/delete", isAuth, async (req, res) => {
  const { id } = req.params;
  const orderDoor = await OrderDoor.findOne({ where: { order_id: id } });
  const door = await Door.findOne({ where: { id: orderDoor.door_id } });
  await Door.update(
    { quantity: door.quantity + 1 },
    { where: { id: door.id } }
  );
  await Order.destroy({ where: { id: id } });

  const refererUrl = req.headers.referer;
  if (refererUrl) {
    const url = new URL(refererUrl);
    const refererPath = url.pathname;
    if (refererPath === "/orders") {
      res.redirect("/orders");
    } else if (refererPath === "/admin") {
      res.redirect("/admin");
    } else {
      res.redirect("/orders");
    }
  } else {
    res.redirect("/orders");
  }
});

router.get("/orders/report", isAuth, async (req, res) => {
  const orders = await Order.findAll({
    where: { staff_id: req.session.user.id },
    attributes: ["id", "status"],
    include: [
      {
        model: OrderDoor,
        attributes: ["quantity"],
        include: [
          {
            model: Door,
            attributes: ["price"],
          },
        ],
      },
    ],
  });

  const totalOrders = orders.length;
  const successfulOrders = orders.filter(
    (order) => order.status === "received"
  ).length;
  const cancelfulOrders = orders.filter(
    (order) => order.status === "cancelled"
  ).length;
  const totalRevenue = orders.reduce((sum, order) => {
    return (
      sum +
      order.OrderDoors.reduce((orderSum, od) => {
        return orderSum + od.quantity * (od.Door?.price || 0);
      }, 0)
    );
  }, 0);
  res.render("orders-report", {
    user: req.session.user,
    totalOrders,
    successfulOrders,
    cancelfulOrders,
    totalRevenue,
  });
});

router.post("/record/:id", isAuth, async (req, res) => {
  const { id } = req.params;
  await Record.create({
    staff_id: req.session.user.id,
    course_id: id,
  });
  res.redirect("/courses");
});

router.post("/record/:id/delete", isAuth, async (req, res) => {
  const { id } = req.params;

  if (req.session.user.role == "admin") {
    await Record.destroy({
      where: { course_id: id },
    });
    return res.redirect("/admin");
  } else {
    await Record.destroy({
      where: { staff_id: req.session.user.id, course_id: id },
    });
    return res.redirect("/courses");
  }
});

router.post("/logout", isAuth, async (req, res) => {
  req.session.destroy(function () {
    res.clearCookie("session");
    res.redirect("/login");
  });
});

router.post("/staffs/:id", isAdmin, async (req, res) => {
  const { id } = req.params;

  const findStaff = await Staff.findOne({
    where: { id: id },
  });

  if (!findStaff) {
    return res.status(409).json({ message: "Пользователь не найден" });
  } else {
    await Staff.destroy({
      where: { id: id },
    });
  }

  res.redirect("/admin");
});

router.get("/admin", isAdmin, async (req, res) => {
  const staffs = await Staff.findAll();
  const courses = await Course.findAll();
  const records = await Record.findAll();
  const materials = await Material.findAll();
  const suppliers = await Supplier.findAll();
  const orders = await Order.findAll();
  const doors = await Door.findAll();
  const orderdoors = await OrderDoor.findAll();

  res.render("admin", {
    staffs,
    courses,
    records,
    materials,
    suppliers,
    orders,
    doors,
    orderdoors,
    user: req.session.user,
  });
});

module.exports = router;
