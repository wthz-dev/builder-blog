import { DataTypes, Model, Sequelize } from 'sequelize'

export class TagModel extends Model {
  declare id: string
  declare name: string
}

export function initTag(sequelize: Sequelize) {
  TagModel.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    { sequelize, tableName: 'Tag', timestamps: true },
  )
  return TagModel
}
