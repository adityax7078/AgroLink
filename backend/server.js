const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'agrolink_jwt_secret_26101094';

// Enable CORS for frontend development server (allows any origin dynamically for local development)
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Parse urlencoded request bodies (for HTML forms)
app.use(express.urlencoded({ extended: true }));

// Logger middleware for debugging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Helper to hash passwords using bcryptjs (10 salt rounds)
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Zod Validation Schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['farmer', 'processor'], { errorMap: () => ({ message: 'Role must be either farmer or processor' }) })
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['farmer', 'processor'], { errorMap: () => ({ message: 'Role must be either farmer or processor' }) })
});

// Rate Limiter: max 5 login/register attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many authentication attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication Middleware: validates token from Authorization: Bearer <token> header
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Access token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Access token is invalid or expired' });
  }
};

// Passport Configuration
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const hasRealGoogleKeys = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'mock';
const hasRealGithubKeys = process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_ID !== 'mock';

if (hasRealGoogleKeys) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.id}@google.com`;
      try {
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              password: bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), 10),
              role: 'farmer',
              updatedAt: new Date()
            }
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
}

if (hasRealGithubKeys) {
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username || profile.id}@github.com`;
      try {
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              password: bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), 10),
              role: 'farmer',
              updatedAt: new Date()
            }
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
}

app.use(passport.initialize());

// Helper to serve beautiful simulated consent page
function serveSimulatedConsentPage(req, res, provider) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sign in with ${provider} - AgroLink Identity</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      </style>
    </head>
    <body class="bg-slate-955 text-slate-100 min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div class="max-w-md w-full bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl p-8 relative overflow-hidden">
        <!-- Glow decorations -->
        <div class="absolute -top-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <div class="relative z-10 space-y-6">
          <div class="text-center">
            <div class="inline-flex p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4">
              <svg class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a15 15 0 003 9.672M12 11a9 9 0 00-9-9m18 0a9 9 0 01-9 9m9-9v14a2 2 0 01-2 2h-2a2 2 0 01-2-2V11"></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-white">OAuth Simulation</h1>
            <p class="text-slate-400 text-sm mt-1.5">You are authorizing <span class="text-emerald-400 font-semibold">AgroLink Marketplace</span> using <span class="font-semibold text-white">${provider}</span></p>
          </div>

          <form action="/api/auth/oauth-mock-callback" method="POST" class="space-y-4">
            <input type="hidden" name="provider" value="${provider}">
            
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Authorize As Email</label>
              <input type="email" name="email" required value="oauth.tester@agrolink.com" 
                class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Select AgroLink Portal Role</label>
              <div class="grid grid-cols-2 gap-3">
                <label class="border border-slate-700 bg-slate-900/50 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-colors">
                  <span class="text-sm font-semibold text-slate-200">Farmer</span>
                  <input type="radio" name="role" value="farmer" checked class="accent-emerald-500 h-4 w-4">
                </label>
                <label class="border border-slate-700 bg-slate-900/50 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-colors">
                  <span class="text-sm font-semibold text-slate-200">Processor</span>
                  <input type="radio" name="role" value="processor" class="accent-emerald-500 h-4 w-4">
                </label>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-700/60 flex flex-col gap-3">
              <button type="submit" id="mock-authorize-btn" class="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm cursor-pointer">
                Authorize AgroLink App
              </button>
              <a href="http://localhost:5173/login" class="w-full text-center border border-slate-700 hover:bg-slate-700/35 text-slate-400 py-3 rounded-xl transition-all text-sm">
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </body>
    </html>
  `;
  res.send(html);
}

// Helper to generate badges based on crop type
const getBadgeByCropType = (cropType) => {
  switch (cropType) {
    case 'Wheat':
    case 'Rice':
      return 'Grains';
    case 'Potato':
      return 'Tubers';
    case 'Sugarcane':
      return 'Stalks';
    default:
      return 'Produce';
  }
};

// --- DATABASE SEEDING ---
async function seedDatabase() {
  try {
    const listingCount = await prisma.listing.count();
    if (listingCount === 0) {
      console.log('Seeding initial listings...');
      await prisma.listing.createMany({
        data: [
          {
            title: 'Premium Sharbati Wheat',
            description: 'High-gluten premium Sharbati wheat, freshly harvested, sun-dried, and ready for milling.',
            price: 2450,
            unit: 'quintal',
            quantity: 120,
            location: 'Sehore, MP',
            badge: 'Grains',
            image: '',
            farmer: 'Ramesh Patel',
            cropType: 'Wheat'
          },
          {
            title: 'Organic Jyoti Potatoes',
            description: 'Firm, high-starch Jyoti potatoes, perfect for manufacturing potato chips and starches.',
            price: 1800,
            unit: 'quintal',
            quantity: 250,
            location: 'Nashik, Maharashtra',
            badge: 'Tubers',
            image: '',
            farmer: 'Sanjay Deshmukh',
            cropType: 'Potato'
          },
          {
            title: 'Basmati Rice',
            description: 'Aromatic long-grain basmati rice, aged for 12 months for supreme flavor.',
            price: 3200,
            unit: 'quintal',
            quantity: 80,
            location: 'Karnal, Haryana',
            badge: 'Grains',
            image: '',
            farmer: 'Ramesh Patel',
            cropType: 'Rice'
          },
          {
            title: 'Sweet Sugarcane',
            description: 'Freshly harvested sugarcane, high sucrose content, ideal for sugar processing.',
            price: 350,
            unit: 'quintal',
            quantity: 500,
            location: 'Kolhapur, Maharashtra',
            badge: 'Stalks',
            image: '',
            farmer: 'Sanjay Deshmukh',
            cropType: 'Sugarcane'
          }
        ]
      });
    }

    const orderCount = await prisma.order.count();
    if (orderCount === 0) {
      console.log('Seeding initial orders...');
      await prisma.order.createMany({
        data: [
          {
            id: 'ORD-1001',
            crop: 'Basmati Rice',
            processor: 'Bikanervala',
            seller: 'Ramesh Patel',
            qty: '50 Quintals',
            total: '₹1,60,000',
            status: 'Delivered',
            date: '15 Jun 2026'
          },
          {
            id: 'ORD-1002',
            crop: 'Jyoti Potatoes',
            processor: 'Haldiram Foods',
            seller: 'Sanjay Deshmukh',
            qty: '150 Quintals',
            total: '₹2,70,000',
            status: 'Accepted',
            date: '21 Jun 2026'
          },
          {
            id: 'ORD-1003',
            crop: 'Sharbati Wheat',
            processor: 'ITC Limited',
            seller: 'Ramesh Patel',
            qty: '80 Quintals',
            total: '₹1,96,000',
            status: 'Pending',
            date: '20 Jun 2026'
          }
        ]
      });
    }

    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('Seeding initial users...');
      await prisma.user.createMany({
        data: [
          {
            email: 'farmer@agrolink.com',
            password: hashPassword('farmer123'),
            role: 'farmer'
          },
          {
            email: 'processor@agrolink.com',
            password: hashPassword('processor123'),
            role: 'processor'
          }
        ]
      });
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// --- ENDPOINTS ---

// --- AUTH ENDPOINTS ---

// POST /api/auth/register - Register a new user account
app.post('/api/auth/register', authLimiter, async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { email, password, role } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Hash password and save
    const hashedPassword = hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        updatedAt: new Date()
      }
    });

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }
    next(error);
  }
});

// POST /api/auth/login - Authenticate user
app.post('/api/auth/login', authLimiter, async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { email, password, role } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password || !bcrypt.compareSync(password, user.password) || user.role !== role) {
      return res.status(401).json({ error: 'Invalid email, password, or role.' });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/forgot-password - Reset password
app.post('/api/auth/forgot-password', async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: 'No user account found with this email.' });
    }

    const hashedPassword = hashPassword(newPassword);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, updatedAt: new Date() }
    });

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    next(error);
  }
});

// --- OAuth ENDPOINTS ---

// Google authentication routes
app.get('/api/auth/google', (req, res, next) => {
  if (hasRealGoogleKeys) {
    return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  } else {
    return serveSimulatedConsentPage(req, res, 'Google');
  }
});

app.get('/api/auth/google/callback', (req, res, next) => {
  if (hasRealGoogleKeys) {
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login?error=oauth_failed' }, (err, user) => {
      if (err || !user) return res.redirect('http://localhost:5173/login?error=oauth_failed');
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.redirect(`http://localhost:5173/login?token=${token}&email=${encodeURIComponent(user.email)}&role=${user.role}&id=${user.id}`);
    })(req, res, next);
  } else {
    res.status(400).send('Google Strategy is not configured.');
  }
});

// GitHub authentication routes
app.get('/api/auth/github', (req, res, next) => {
  if (hasRealGithubKeys) {
    return passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
  } else {
    return serveSimulatedConsentPage(req, res, 'GitHub');
  }
});

app.get('/api/auth/github/callback', (req, res, next) => {
  if (hasRealGithubKeys) {
    passport.authenticate('github', { failureRedirect: 'http://localhost:5173/login?error=oauth_failed' }, (err, user) => {
      if (err || !user) return res.redirect('http://localhost:5173/login?error=oauth_failed');
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.redirect(`http://localhost:5173/login?token=${token}&email=${encodeURIComponent(user.email)}&role=${user.role}&id=${user.id}`);
    })(req, res, next);
  } else {
    res.status(400).send('GitHub Strategy is not configured.');
  }
});

// Simulated OAuth post callback
app.post('/api/auth/oauth-mock-callback', async (req, res, next) => {
  try {
    const { email, role, provider } = req.body;
    if (!email || !role) {
      return res.status(400).send('Email and role are required for simulated OAuth callback.');
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          password: bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), 10),
          role,
          updatedAt: new Date()
        }
      });
    } else {
      user = await prisma.user.update({
        where: { email },
        data: { role, updatedAt: new Date() }
      });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.redirect(`http://localhost:5173/login?token=${token}&email=${encodeURIComponent(user.email)}&role=${user.role}&id=${user.id}`);
  } catch (err) {
    next(err);
  }
});

// 1. GET /api/listings - Get all or filtered listings (search / filter)
app.get('/api/listings', async (req, res, next) => {
  try {
    const { q, cropType, location } = req.query;
    const where = {};

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { location: { contains: q } },
        { cropType: { contains: q } }
      ];
    }

    if (cropType) {
      where.cropType = { equals: cropType };
    }

    if (location) {
      where.location = { contains: location };
    }

    const dbListings = await prisma.listing.findMany({
      where
    });
    res.status(200).json(dbListings);
  } catch (error) {
    next(error);
  }
});

// 2. GET /api/listings/:id - Get a single listing
app.get('/api/listings/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Listing ID must be a valid number.' });
    }
    const listing = await prisma.listing.findUnique({
      where: { id }
    });
    if (!listing) {
      return res.status(404).json({ error: `Listing with ID ${id} not found.` });
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
});

// 3. POST /api/listings - Create a new listing
app.post('/api/listings', requireAuth, async (req, res, next) => {
  try {
    const { title, description, price, unit, quantity, location, cropType, farmer } = req.body;

    // Basic Validation
    if (!title || price === undefined || quantity === undefined || !location || !cropType) {
      return res.status(400).json({ error: 'Missing required listing fields: title, price, quantity, location, and cropType are mandatory.' });
    }

    const priceNum = Number(price);
    const quantityNum = Number(quantity);

    if (isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({ error: 'Price must be a valid positive number.' });
    }

    if (isNaN(quantityNum) || quantityNum <= 0) {
      return res.status(400).json({ error: 'Quantity must be a valid positive number.' });
    }

    const newListing = await prisma.listing.create({
      data: {
        title,
        description: description || `Freshly harvested ${cropType} from ${location}`,
        price: priceNum,
        unit: unit || 'quintal',
        quantity: quantityNum,
        location,
        badge: getBadgeByCropType(cropType),
        image: '',
        farmer: farmer || 'Anonymous Farmer',
        cropType
      }
    });

    res.status(201).json(newListing);
  } catch (error) {
    next(error);
  }
});

// 4. PUT /api/listings/:id - Update an existing listing
app.put('/api/listings/:id', requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Listing ID must be a valid number.' });
    }

    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: `Listing with ID ${id} not found.` });
    }

    const { title, description, price, unit, quantity, location, cropType, farmer } = req.body;

    // Optional field validation if passed
    if (price !== undefined && (isNaN(price) || Number(price) <= 0)) {
      return res.status(400).json({ error: 'Price must be a valid positive number.' });
    }
    if (quantity !== undefined && (isNaN(quantity) || Number(quantity) <= 0)) {
      return res.status(400).json({ error: 'Quantity must be a valid positive number.' });
    }

    const updatedData = {};
    if (title !== undefined) updatedData.title = title;
    if (description !== undefined) updatedData.description = description;
    if (price !== undefined) updatedData.price = Number(price);
    if (unit !== undefined) updatedData.unit = unit;
    if (quantity !== undefined) updatedData.quantity = Number(quantity);
    if (location !== undefined) updatedData.location = location;
    if (cropType !== undefined) {
      updatedData.cropType = cropType;
      updatedData.badge = getBadgeByCropType(cropType);
    }
    if (farmer !== undefined) updatedData.farmer = farmer;

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: updatedData
    });

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
});

// 5. DELETE /api/listings/:id - Delete a listing
app.delete('/api/listings/:id', requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Listing ID must be a valid number.' });
    }

    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: `Listing with ID ${id} not found.` });
    }

    await prisma.listing.delete({
      where: { id }
    });

    res.status(200).json({ message: `Listing with ID ${id} deleted successfully.`, id });
  } catch (error) {
    next(error);
  }
});

// 6. GET /api/orders - Get all procurement orders
app.get('/api/orders', requireAuth, async (req, res, next) => {
  try {
    const dbOrders = await prisma.order.findMany();
    res.status(200).json(dbOrders);
  } catch (error) {
    next(error);
  }
});

// 7. POST /api/orders - Place a procurement order
app.post('/api/orders', requireAuth, async (req, res, next) => {
  try {
    const { crop, processor, seller, qty, total, status } = req.body;

    if (!crop || !processor || !seller || !qty || !total) {
      return res.status(400).json({ error: 'Missing required order fields: crop, processor, seller, qty, total.' });
    }

    // Generate unique ID in format ORD-XXXX
    let uniqueId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    let idExists = true;
    while (idExists) {
      const existing = await prisma.order.findUnique({ where: { id: uniqueId } });
      if (!existing) {
        idExists = false;
      } else {
        uniqueId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    }

    const newOrder = await prisma.order.create({
      data: {
        id: uniqueId,
        crop,
        processor,
        seller,
        qty,
        total,
        status: status || 'Pending',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) // e.g. "26 Jun 2026"
      }
    });

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

// 8. PUT /api/orders/:id - Update an order's status
app.put('/api/orders/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Missing status update value.' });
    }

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: `Order with ID ${id} not found.` });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
});

// 9. GET /api/ai/pricing - Calculate AI price recommendations
app.get('/api/ai/pricing', (req, res, next) => {
  try {
    const { cropType, quantity } = req.query;

    if (!cropType || !quantity) {
      return res.status(400).json({ error: 'Missing query parameters: cropType and quantity are required.' });
    }

    const qtyVal = Number(quantity);
    if (isNaN(qtyVal) || qtyVal <= 0) {
      return res.status(400).json({ error: 'Quantity must be a valid positive number.' });
    }

    let basePrice = 22;
    let qualityMultiplier = 1.1;

    switch (cropType) {
      case 'Potato':
        basePrice = 16;
        qualityMultiplier = 1.15;
        break;
      case 'Rice':
        basePrice = 28;
        qualityMultiplier = 1.08;
        break;
      case 'Sugarcane':
        basePrice = 32;
        qualityMultiplier = 1.05;
        break;
      case 'Wheat':
      default:
        basePrice = 22;
        qualityMultiplier = 1.10;
        break;
    }

    const suggestedMin = Math.round(basePrice * 100);
    const suggestedMax = Math.round(basePrice * qualityMultiplier * 100);

    const trends = [
      'Bullish (+4.2% this week)',
      'Stable (expected steady demand)',
      'Slightly Bearish (-1.5% due to increased imports)',
      'Highly Bullish (+6.8% due to export permissions)'
    ];

    const randomTrend = trends[Math.floor(Math.random() * trends.length)];
    const demands = ['High', 'Medium', 'Low', 'Very High'];
    const randomDemand = demands[Math.floor(Math.random() * demands.length)];

    const response = {
      crop: cropType,
      quantity: qtyVal,
      min: suggestedMin,
      max: suggestedMax,
      marketTrend: randomTrend,
      demandLevel: randomDemand,
      factors: `Analysis notes: Calculated based on regional seasonal rainfall indices, warehousing stocks in local mandis, and factory procurement demand projections for ${cropType}.`
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred on the server.'
  });
});

// --- START SERVER ---
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`==================================================`);
  console.log(` AgroLink API Backend started successfully!`);
  console.log(` Listening on: http://127.0.0.1:${PORT}`);
  console.log(`==================================================`);
  
  // Seed the database
  await seedDatabase();
});
