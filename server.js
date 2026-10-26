import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'

const app = express()
const port = process.env.PORT || 4242
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

const catalog = {
  'sunshine-citrus': { name: 'Sunshine Citrus', price: 699 },
  'berry-blush': { name: 'Berry Blush', price: 749 },
  'mint-condition': { name: 'Mint Condition', price: 599 },
  'chai-day': { name: 'Chai Day', price: 649 }
}

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.post('/api/create-checkout-session', async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to your .env file.' })
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const { items } = req.body || {}
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Your cart is empty.' })
  }
  try {
    const line_items = items.map(({ id, quantity }) => {
      const product = catalog[id]
      if (!product) throw new Error(`Unknown product: ${id}`)
      const qty = Math.max(1, Math.min(20, Number(quantity) || 1))
      return {
        quantity: qty,
        price_data: {
          currency: 'inr',
          unit_amount: product.price * 100,
          product_data: { name: product.name }
        }
      }
    })
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/?checkout=success`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/?checkout=cancelled`
    })
    res.json({ url: session.url })
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to start checkout.' })
  }
})

app.listen(port, () => console.log(`teacup checkout server running on http://localhost:${port}`))