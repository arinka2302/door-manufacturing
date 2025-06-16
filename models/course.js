module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            unique: false,
        }
    },
        { timestamps: true, createdAt: 'created_at', updatedAt: false, paranoid: false });
    return Course;
};