import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowRight, Check, ChevronDown, Coffee, Heart, Leaf, Menu, Minus, Plus, ShoppingBag, Sparkles, X } from 'lucide-react'
import { products } from './data'

const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

function App() {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [notice, setNotice] = useState('')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const count = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 79
  const total = subtotal + shipping

  const addToCart = product => {
    setCart(current => {
      const found = current.find(item => item.id === product.id)
      return found
        ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }]
    })
    setNotice(`${product.name} added to your bag`)
    setCartOpen(true)
    window.setTimeout(() => setNotice(''), 2500)
  }

  const changeQuantity = (id, delta) => setCart(current =>
    current.map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0)
  )

  const checkout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4242'}/api/create-checkout-session`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.map(({ id, quantity }) => ({ id, quantity })) })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Checkout could not start.')
      window.location.href = data.url
    } catch (error) {
      setNotice(error.message.includes('fetch') ? 'Checkout server is not running. Follow the README to enable Stripe.' : error.message)
      window.setTimeout(() => setNotice(''), 4500)
    }
  }

  const checkoutStatus = new URLSearchParams(window.location.search).get('checkout')

  return (
    <div className="site-shell">
      <div className="announcement"><Sparkles size={14} /> A little joy in every cup <span className="announcement-dot">✳</span> Free shipping on orders over ₹999</div>
      <header className="header">
        <button className="icon-button mobile-toggle" aria-label="Open menu" onClick={() => setMobileMenu(!mobileMenu)}><Menu /></button>
        <a href="#home" className="wordmark" aria-label="teacup home">tea<span>cup</span><i>.</i></a>
        <nav className={mobileMenu ? 'nav nav-open' : 'nav'}>
          <a href="#shop" onClick={() => setMobileMenu(false)}>Shop tea</a>
          <a href="#story" onClick={() => setMobileMenu(false)}>Our story</a>
          <a href="#ritual" onClick={() => setMobileMenu(false)}>Tea rituals</a>
        </nav>
        <div className="header-actions">
          <a className="header-link" href="#shop">Find your blend <ArrowDownRight size={15}/></a>
          <button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Open shopping bag, ${count} items`}><ShoppingBag size={19}/><span>Bag</span><b>{count}</b></button>
        </div>
      </header>

      {checkoutStatus && <div className={`status-banner ${checkoutStatus === 'success' ? 'success' : ''}`}><Check size={17}/>{checkoutStatus === 'success' ? 'Checkout complete! Thanks for bringing teacup home.' : 'Checkout cancelled — your bag is still here.'}<button onClick={() => { history.replaceState({}, '', '/'); }}>Dismiss</button></div>}

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line"/> GOOD MOOD. GREAT BREW.</div>
            <h1>Make room for<br/>a little <em>joy.</em></h1>
            <p className="hero-description">Big flavour, feel-good ingredients, and tiny moments that make your day. Your new favourite cup starts here.</p>
            <div className="hero-buttons"><a className="button button-dark" href="#shop">Shop the blends <ArrowRight size={17}/></a><a href="#story" className="text-link">Get to know us <span>↗</span></a></div>
            <div className="hero-proof"><div className="avatar-stack"><span>☻</span><span>☺</span><span>✿</span></div><div><strong>4.9/5 happy sippers</strong><small>Made for your everyday ritual</small></div></div>
            <span className="hero-doodle doodle-one">✳</span>
          </div>
          <div className="hero-art">
            <div className="hero-circle"></div>
            <div className="hero-label label-top">YOUR DAILY<br/>HAPPY PLACE <span>↘</span></div>
            <img className="hero-image" src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=90" alt="A fresh cup of tea on a sunlit table"/>
            <div className="hero-sticker"><span>BREW</span><strong>GOOD</strong><span>THINGS ☻</span></div>
            <div className="hero-caption"><Leaf size={16}/><span>Real leaves. Real good vibes.</span></div>
            <span className="hero-spark">✳</span>
          </div>
          <div className="hero-bottom-note">A BETTER KIND OF BREAK <span>SCROLL TO SIP ↓</span></div>
        </section>

        <section className="ticker" aria-label="Our values"><div className="ticker-track">{Array.from({length: 2}).map((_, i) => <span key={i}>GOOD LEAVES <b>✳</b> BIG LITTLE MOMENTS <b>✳</b> BREW YOUR OWN HAPPY <b>✳</b> SIPS WITH PERSONALITY <b>✳</b></span>)}</div></section>

        <section className="shop-section section-pad" id="shop">
          <div className="section-heading">
            <div><div className="eyebrow"><span className="eyebrow-line"/> THE GOOD STUFF</div><h2>Meet your new<br className="desktop-break"/> <em>cup of happy.</em></h2></div>
            <div className="heading-side"><p>Little-batch blends with big main-character energy. Find the one that feels like you.</p><a href="#all-blends" className="text-link">Explore all blends <ArrowRight size={16}/></a></div>
          </div>
          <div className="product-grid" id="all-blends">
            {products.map((product, index) => <article className={`product-card product-${product.color}`} key={product.id}>
              <div className="product-photo-wrap">
                <img src={product.image} alt={product.name} className="product-photo" loading="lazy"/>
                <span className="product-tag">{product.tag}</span>
                <button className="heart-button" aria-label={`Save ${product.name}`} onClick={e => e.currentTarget.classList.toggle('hearted')}><Heart size={18}/></button>
                <button className="quick-add" onClick={() => addToCart(product)}><Plus size={17}/> Quick add</button>
              </div>
              <div className="product-info"><div><h3>{product.name}</h3><p>{product.type}</p></div><strong>{money(product.price)}</strong></div>
              <p className="product-notes">{product.notes}</p>
            </article>)}
          </div>
          <div className="shop-bottom"><span>✳ Thoughtfully sourced. Happily sipped.</span><button className="button button-outline" onClick={() => setNotice('You’re looking at the full teacup collection!')}>That’s the whole collection <ArrowRight size={16}/></button></div>
        </section>

        <section className="manifesto" id="story">
          <div className="manifesto-image"><img src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=1100&q=85" alt="Tea being poured into a glass"/><div className="image-note">SLOW DOWN.<br/>SIP SOMETHING GOOD.</div></div>
          <div className="manifesto-copy"><div className="eyebrow"><span className="eyebrow-line"/> A NOTE FROM US</div><h2>Life’s a lot.<br/>Your tea shouldn’t <em>be.</em></h2><p>We believe the best things don’t need to be complicated. Just lovely leaves, playful blends, and a few minutes that are entirely yours.</p><p>So we made teacup: tea with a little more personality, for the big days, the slow days, and every day in between.</p><a className="button button-dark" href="#ritual">The teacup feeling <ArrowRight size={17}/></a><span className="manifesto-flower">✿</span></div>
        </section>

        <section className="ritual-section section-pad" id="ritual">
          <div className="ritual-title"><div className="eyebrow"><span className="eyebrow-line"/> YOUR MOMENT, YOUR WAY</div><h2>Make a ritual<br/>out of <em>anything.</em></h2></div>
          <div className="ritual-cards">
            <article className="ritual-card ritual-pink"><div className="ritual-number">01 / RESET</div><div className="ritual-illustration">☼</div><h3>The 3pm reset</h3><p>Close the tabs. Put the kettle on. Come back to yourself.</p><span>BEST WITH: MINT CONDITION</span></article>
            <article className="ritual-card ritual-yellow"><div className="ritual-number">02 / CONNECT</div><div className="ritual-illustration">♡</div><h3>One more cup?</h3><p>Some conversations deserve a refill. This is your sign.</p><span>BEST WITH: BERRY BLUSH</span></article>
            <article className="ritual-card ritual-green"><div className="ritual-number">03 / BEGIN</div><div className="ritual-illustration">✳</div><h3>A fresh start</h3><p>New day, new page, same favourite mug. You’ve got this.</p><span>BEST WITH: SUNSHINE CITRUS</span></article>
          </div>
        </section>

        <section className="quote-band"><span className="quote-mark">“</span><blockquote>My new little daily ritual. The flavours are so bright, and the packaging makes me smile before the kettle even boils.</blockquote><div className="quote-credit">— RIYA S. <span>★★★★★</span></div><div className="quote-deco">✳</div></section>

        <section className="newsletter section-pad">
          <div className="newsletter-art"><span>GOOD<br/>THINGS<br/><em>BREWING</em></span><div className="newsletter-sun">✳</div></div>
          <div className="newsletter-copy"><div className="eyebrow"><span className="eyebrow-line"/> THE HAPPY MAIL CLUB</div><h2>A little joy<br/>in your <em>inbox.</em></h2><p>New blends, tiny rituals, and the occasional very good deal. No spam, just steeped-in-goodness stuff.</p>
            {subscribed ? <div className="subscribe-success"><Check size={18}/> You’re on the list. Keep an eye on your inbox!</div> : <form className="newsletter-form" onSubmit={e => { e.preventDefault(); if (email.includes('@')) setSubscribed(true) }}><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" required aria-label="Email address"/><button type="submit" aria-label="Subscribe"><ArrowRight size={19}/></button></form>}
            <small>By subscribing, you agree to receive teacup updates. Unsubscribe anytime.</small>
          </div>
        </section>
      </main>

      <footer className="footer"><div className="footer-top"><a href="#home" className="wordmark footer-mark">tea<span>cup</span><i>.</i></a><p>Make room for a little joy.<br/>One cup at a time.</p><div className="footer-links"><a href="#shop">Shop tea</a><a href="#story">Our story</a><a href="mailto:hello@teacup.example">Contact</a><a href="#ritual">Tea rituals</a></div><a href="#home" className="back-top">BACK TO TOP ↑</a></div><div className="footer-bottom"><span>© 2025 teacup. Made for good days.</span><span>GOOD TEA. GOOD MOOD. <b>✳</b></span><span>Instagram ↗ &nbsp; Pinterest ↗</span></div></footer>

      {notice && <div className="toast" role="status">{notice}</div>}

      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
        <aside className="cart-drawer" onClick={e => e.stopPropagation()} aria-label="Shopping bag">
          <div className="drawer-header"><div><span className="eyebrow">YOUR HAPPY BAG</span><h2>Your bag <span>({count})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X/></button></div>
          {cart.length === 0 ? <div className="empty-cart"><div className="empty-cup">☕</div><h3>Your bag is taking a tea break.</h3><p>Let’s find a blend that makes your day.</p><button className="button button-dark" onClick={() => { setCartOpen(false); document.getElementById('shop').scrollIntoView({behavior:'smooth'}) }}>Find your blend <ArrowRight size={16}/></button></div> :
            <><div className="cart-items">{cart.map(item => <div className="cart-item" key={item.id}><img src={item.image} alt=""/><div className="cart-item-info"><h3>{item.name}</h3><p>{money(item.price)}</p><div className="quantity-control"><button onClick={() => changeQuantity(item.id, -1)} aria-label="Decrease quantity"><Minus size={13}/></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label="Increase quantity"><Plus size={13}/></button></div></div><strong>{money(item.price * item.quantity)}</strong></div>)}</div>
            <div className="cart-summary"><div className="shipping-note">{subtotal >= 999 ? '✳ You unlocked free shipping!' : `Add ${money(999 - subtotal)} for free shipping`}</div><div className="summary-row"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : money(shipping)}</span></div><div className="summary-row total-row"><strong>Total</strong><strong>{money(total)}</strong></div><p className="tax-note">Taxes included where applicable.</p><button className="button button-dark checkout-button" onClick={checkout}>Continue to secure checkout <ArrowRight size={17}/></button><div className="secure-note">♡ A little joy, packed with care</div></div></>}
        </aside>
      </div>}
    </div>
  )
}

export default App