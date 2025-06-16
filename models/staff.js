module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define(
    "Staff",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      middleName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
      deletedAt: "deleted_at",
      paranoid: true,
    }
  );
  return Staff;
};
