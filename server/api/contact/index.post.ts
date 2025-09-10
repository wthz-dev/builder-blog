import { prisma } from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const { name, email, message } = await readBody(event)

    if (!name || !email || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, email and message are required'
      })
    }

    // Save contact message to database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        message
      }
    })

    return { success: true, id: contact.id }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Contact form error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to submit contact form'
    })
  }
})
