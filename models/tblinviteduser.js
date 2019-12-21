/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('tblinviteduser', {
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
    email: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    isaccept: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'tblinviteduser'
  });
};
