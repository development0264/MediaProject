/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('tblshare', {
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
    idmedia: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    idtouser: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createdby: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    createdate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idinvited: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    isread: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'tblshare'
  });
};
