import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

// Настройки подключения с запасными параметрами
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    console.log('✅ MongoDB подключена')
  } catch (error) {
    console.error('❌ Ошибка подключения:', error.message)
    // Попробуем использовать локальную БД если облачная не работает
    console.log('🔄 Пробую подключиться к локальной MongoDB...')
    try {
      await mongoose.connect('mongodb://localhost:27017/karakol')
      console.log('✅ Локальная MongoDB подключена')
    } catch (localError) {
      console.error('❌ Локальная MongoDB не найдена. Установи MongoDB или проверь подключение к интернету')
    }
  }
}

connectDB()

// Схема товара
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },
  category: { type: String },
  createdAt: { type: Date, default: Date.now }
})

const Product = mongoose.model('Product', productSchema)

// API маршруты
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    res.json([]) // Возвращаем пустой массив при ошибке
  }
})

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Товар удален' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`)
})
