require("dotenv").config();
const { Sequelize, DataTypes, Op } = require("sequelize");
const bcrypt = require("bcrypt");

const sequelize = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
);

const staff = require("./staff");
const door = require("./door");
const orderdoor = require("./order_door");
const order = require("./order");
const record = require("./record");
const course = require("./course");
const supplier = require("./supplier");
const material = require("./material");

const Staff = staff(sequelize, DataTypes);
const Door = door(sequelize, DataTypes);
const OrderDoor = orderdoor(sequelize, DataTypes);
const Order = order(sequelize, DataTypes);
const Record = record(sequelize, DataTypes);
const Course = course(sequelize, DataTypes);
const Supplier = supplier(sequelize, DataTypes);
const Material = material(sequelize, DataTypes);

Staff.beforeCreate(async (s) => {
  s.password = await bcrypt.hash(s.password, 12);
});

const associateModels = () => {
  Staff.hasMany(Order, {
    foreignKey: "staff_id",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  Order.belongsTo(Staff, { foreignKey: "staff_id" });

  Order.hasMany(OrderDoor, {
    foreignKey: "order_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  OrderDoor.belongsTo(Order, { foreignKey: "order_id" });

  Door.hasMany(OrderDoor, {
    foreignKey: "door_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  OrderDoor.belongsTo(Door, { foreignKey: "door_id" });

  Order.belongsToMany(Door, { through: OrderDoor, foreignKey: "order_id" });
  Door.belongsToMany(Order, { through: OrderDoor, foreignKey: "door_id" });

  Material.hasMany(Door, {
    foreignKey: "material_id",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  Door.belongsTo(Material, { foreignKey: "material_id" });

  Supplier.hasMany(Material, {
    foreignKey: "supplier_id",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  Material.belongsTo(Supplier, { foreignKey: "supplier_id" });

  Course.hasMany(Record, {
    foreignKey: "course_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Record.belongsTo(Course, { foreignKey: "course_id" });

  Staff.hasMany(Record, {
    foreignKey: "staff_id",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  Record.belongsTo(Staff, { foreignKey: "staff_id" });
};

associateModels();

module.exports = {
  sequelize,
  bcrypt,
  Op,
  Staff,
  Door,
  OrderDoor,
  Order,
  Record,
  Course,
  Supplier,
  Material,
};
