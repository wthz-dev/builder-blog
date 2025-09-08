import { Sequelize } from 'sequelize'
import { initUser } from './user'
import { initPost } from './post'
import { initComment } from './comment'
import { initTag } from './tag'
import { initCategory } from './category'

export const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: 'postgres',
  logging: false,
})

export const User = initUser(sequelize)
export const Post = initPost(sequelize)
export const Comment = initComment(sequelize)
export const Tag = initTag(sequelize)
export const Category = initCategory(sequelize)

// Associations
User.hasMany(Post, { foreignKey: 'authorId' })
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' })

User.hasMany(Comment, { foreignKey: 'authorId' })
Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' })

Post.hasMany(Comment, { foreignKey: 'postId' })
Comment.belongsTo(Post, { foreignKey: 'postId' })

export const PostTag = sequelize.define('PostTag', {}, { tableName: 'PostTag' })
export const PostCategory = sequelize.define('PostCategory', {}, { tableName: 'PostCategory' })

Post.belongsToMany(Tag, { through: PostTag })
Tag.belongsToMany(Post, { through: PostTag })

Post.belongsToMany(Category, { through: PostCategory })
Category.belongsToMany(Post, { through: PostCategory })
