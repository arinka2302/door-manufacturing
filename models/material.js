module.exports = (sequelize, DataTypes) => {
    const Material = sequelize.define('Material', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        supplier_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.FLOAT,
            allowNull: false,
            unique: false,
        },
        unit_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            unique: false,
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        }
    },
        { timestamps: true, createdAt: 'created_at', updatedAt: false, paranoid: false });
    return Material;
};