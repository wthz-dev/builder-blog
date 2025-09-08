import { DataTypes, Model, Sequelize } from 'sequelize'

export class CategoryModel extends Model {
  declare id: string
  declare name: string
}

export function initCategory(sequelize: Sequelize) {
  CategoryModel.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    { sequelize, tableName: 'Category', timestamps: true },
  )
  return CategoryModel
}
