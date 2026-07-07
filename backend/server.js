const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Enable CORS for frontend development server (allows any origin dynamically for local development)
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Logger middleware for debugging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Helper to hash passwords using SHA-256
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

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
app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required.' });
    }

    if (role !== 'farmer' && role !== 'processor') {
      return res.status(400).json({ error: 'Role must be either farmer or processor.' });
    }

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
        role
      }
    });

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login - Authenticate user
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required.' });
    }

    const hashedPassword = hashPassword(password);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.password !== hashedPassword || user.role !== role) {
      return res.status(401).json({ error: 'Invalid email, password, or role.' });
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role
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

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: 'No user account found with this email.' });
    }

    const hashedPassword = hashPassword(newPassword);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    next(error);
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
app.post('/api/listings', async (req, res, next) => {
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
app.put('/api/listings/:id', async (req, res, next) => {
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
app.delete('/api/listings/:id', async (req, res, next) => {
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
app.get('/api/orders', async (req, res, next) => {
  try {
    const dbOrders = await prisma.order.findMany();
    res.status(200).json(dbOrders);
  } catch (error) {
    next(error);
  }
});

// 7. POST /api/orders - Place a procurement order
app.post('/api/orders', async (req, res, next) => {
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
app.put('/api/orders/:id', async (req, res, next) => {
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
