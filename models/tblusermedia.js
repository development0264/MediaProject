/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('tblusermedia', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    iduser: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    filename: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    createdby: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    createddate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Type: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'tblusermedia'
  });
};
