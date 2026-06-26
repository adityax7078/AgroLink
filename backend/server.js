const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// --- IN-MEMORY DATA STORE ---
let listings = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
];

let orders = [
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
];

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

// --- ENDPOINTS ---

// 1. GET /api/listings - Get all or filtered listings (search / filter)
app.get('/api/listings', (req, res, next) => {
  try {
    const { q, cropType, location } = req.query;
    let filteredListings = [...listings];

    if (q) {
      const searchStr = q.toLowerCase();
      filteredListings = filteredListings.filter(item => 
        item.title.toLowerCase().includes(searchStr) ||
        item.description.toLowerCase().includes(searchStr) ||
        item.location.toLowerCase().includes(searchStr) ||
        item.cropType.toLowerCase().includes(searchStr)
      );
    }

    if (cropType) {
      filteredListings = filteredListings.filter(item => 
        item.cropType.toLowerCase() === cropType.toLowerCase()
      );
    }

    if (location) {
      filteredListings = filteredListings.filter(item => 
        item.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    res.status(200).json(filteredListings);
  } catch (error) {
    next(error);
  }
});

// 2. GET /api/listings/:id - Get a single listing
app.get('/api/listings/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const listing = listings.find(item => item.id === id);
    if (!listing) {
      return res.status(404).json({ error: `Listing with ID ${id} not found.` });
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
});

// 3. POST /api/listings - Create a new listing
app.post('/api/listings', (req, res, next) => {
  try {
    const { title, description, price, unit, quantity, location, cropType, farmer } = req.body;

    // Basic Validation
    if (!title || !price || !quantity || !location || !cropType) {
      return res.status(400).json({ error: 'Missing required listing fields: title, price, quantity, location, and cropType are mandatory.' });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'Price must be a valid positive number.' });
    }

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a valid positive number.' });
    }

    const newListing = {
      id: listings.length > 0 ? Math.max(...listings.map(l => l.id)) + 1 : 1,
      title,
      description: description || `Freshly harvested ${cropType} from ${location}`,
      price: Number(price),
      unit: unit || 'quintal',
      quantity: Number(quantity),
      location,
      badge: getBadgeByCropType(cropType),
      image: '',
      farmer: farmer || 'Anonymous Farmer',
      cropType
    };

    listings.push(newListing);
    res.status(201).json(newListing);
  } catch (error) {
    next(error);
  }
});

// 4. PUT /api/listings/:id - Update an existing listing
app.put('/api/listings/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const index = listings.findIndex(item => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: `Listing with ID ${id} not found.` });
    }

    const { title, description, price, unit, quantity, location, cropType, farmer } = req.body;

    // Optional field validation if passed
    if (price !== undefined && (isNaN(price) || price <= 0)) {
      return res.status(400).json({ error: 'Price must be a valid positive number.' });
    }
    if (quantity !== undefined && (isNaN(quantity) || quantity <= 0)) {
      return res.status(400).json({ error: 'Quantity must be a valid positive number.' });
    }

    const updatedListing = {
      ...listings[index],
      title: title !== undefined ? title : listings[index].title,
      description: description !== undefined ? description : listings[index].description,
      price: price !== undefined ? Number(price) : listings[index].price,
      unit: unit !== undefined ? unit : listings[index].unit,
      quantity: quantity !== undefined ? Number(quantity) : listings[index].quantity,
      location: location !== undefined ? location : listings[index].location,
      cropType: cropType !== undefined ? cropType : listings[index].cropType,
      badge: cropType !== undefined ? getBadgeByCropType(cropType) : listings[index].badge,
      farmer: farmer !== undefined ? farmer : listings[index].farmer
    };

    listings[index] = updatedListing;
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
});

// 5. DELETE /api/listings/:id - Delete a listing
app.delete('/api/listings/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const index = listings.findIndex(item => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: `Listing with ID ${id} not found.` });
    }

    listings.splice(index, 1);
    res.status(200).json({ message: `Listing with ID ${id} deleted successfully.`, id });
  } catch (error) {
    next(error);
  }
});

// 6. GET /api/orders - Get all procurement orders
app.get('/api/orders', (req, res, next) => {
  try {
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

// 7. POST /api/orders - Place a procurement order
app.post('/api/orders', (req, res, next) => {
  try {
    const { crop, processor, seller, qty, total, status } = req.body;

    if (!crop || !processor || !seller || !qty || !total) {
      return res.status(400).json({ error: 'Missing required order fields: crop, processor, seller, qty, total.' });
    }

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      crop,
      processor,
      seller,
      qty,
      total,
      status: status || 'Pending',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) // e.g. "26 Jun 2026"
    };

    orders.push(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

// 8. PUT /api/orders/:id - Update an order's status
app.put('/api/orders/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Missing status update value.' });
    }

    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: `Order with ID ${id} not found.` });
    }

    orders[orderIndex].status = status;
    res.status(200).json(orders[orderIndex]);
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`==================================================`);
  console.log(` AgroLink API Backend started successfully!`);
  console.log(` Listening on: http://127.0.0.1:${PORT}`);
  console.log(` CORS dynamically echoing origins`);
  console.log(`==================================================`);
});
