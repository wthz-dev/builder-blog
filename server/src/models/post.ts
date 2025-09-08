import { DataTypes, Model, Sequelize } from 'sequelize'

export class PostModel extends Model {
  declare id: string
  declare slug: string
  declare title: string
  declare excerpt: string
  declare content: string
  declare authorId: string
  declare publishedAt: Date
}

export function initPost(sequelize: Sequelize) {
  PostModel.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      title: { type: DataTypes.STRING, allowNull: false },
      excerpt: { type: DataTypes.TEXT, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      authorId: { type: DataTypes.STRING, allowNull: false },
      publishedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'Post', timestamps: true },
  )
  return PostModel
}
