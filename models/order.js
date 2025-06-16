module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Staffs',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: false,
    },
  },
    { timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at', paranoid: true });
  return Order;
};