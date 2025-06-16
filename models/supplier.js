module.exports = (sequelize, DataTypes) => {
    const Supplier = sequelize.define('Supplier', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
    },
        { timestamps: true, createdAt: 'created_at', updatedAt: false, deletedAt: 'deleted_at', paranoid: true });
    return Supplier;
};