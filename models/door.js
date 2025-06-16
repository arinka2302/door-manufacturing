module.exports = (sequelize, DataTypes) => {
    const Door = sequelize.define('Door', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            unique: false,
        },
        material_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        width: {
            type: DataTypes.FLOAT,
            allowNull: false,
            unique: false,
        },
        height: {
            type: DataTypes.FLOAT,
            allowNull: false,
            unique: false,
        },
        thickness: {
            type: DataTypes.FLOAT,
            allowNull: false,
            unique: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            unique: false,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
        },
        guarantee: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
        }
    },
        { timestamps: true, createdAt: 'created_at', updatedAt: false, paranoid: false });
    return Door;
};