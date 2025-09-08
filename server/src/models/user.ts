import { DataTypes, Model, Sequelize } from 'sequelize'

export class UserModel extends Model {
  declare id: string
  declare email: string
  declare name: string
  declare password: string
}

export function initUser(sequelize: Sequelize) {
  UserModel.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      name: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, tableName: 'User', timestamps: true },
  )
  return UserModel
}
