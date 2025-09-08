import { DataTypes, Model, Sequelize } from 'sequelize'

export class CommentModel extends Model {
  declare id: string
  declare content: string
  declare authorId: string
  declare postId: string
}

export function initComment(sequelize: Sequelize) {
  CommentModel.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      content: { type: DataTypes.TEXT, allowNull: false },
      authorId: { type: DataTypes.STRING, allowNull: false },
      postId: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, tableName: 'Comment', timestamps: true },
  )
  return CommentModel
}
