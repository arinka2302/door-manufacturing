module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define('Record', {
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Staffs',
        key: 'id',
      },
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Courses',
        key: 'id',
      },
    },
  },
    { timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at', paranoid: true });
  return Record;
};