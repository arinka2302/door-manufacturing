module.exports = (sequelize, DataTypes) => {
    const OrderDoor = sequelize.define('OrderDoor', {
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        door_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
        },
    },
        { timestamps: false });
    return OrderDoor;
};