/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('tblcontactus', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createddate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdby: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'tblcontactus'
  });
};
