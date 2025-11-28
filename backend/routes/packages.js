const express = require('express');
const Package = require('../models/Package');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all packages with filtering, sorting and pagination
// @route   GET /api/packages
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Search functionality
    let searchQuery = {};
    if (req.query.search) {
      searchQuery = {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
          { 'categories': { $regex: req.query.search, $options: 'i' } }
        ]
      };
    }

    // Category filter
    if (req.query.category) {
      queryObj.categories = { $in: [req.query.category] };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.price = {};
      if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
    }

    // Duration filter
    if (req.query.duration) {
      queryObj['duration.days'] = Number(req.query.duration);
    }

    // Only active packages
    queryObj.isActive = true;

    let query = Package.find({ ...queryObj, ...searchQuery });

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Package.countDocuments({ ...queryObj, ...searchQuery });

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const packages = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: packages.length,
      pagination,
      total,
      data: packages
    });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching packages'
    });
  }
});

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id)
      .populate('createdBy', 'name email phone');

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching package'
    });
  }
});

// @desc    Create new package
// @route   POST /api/packages
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const package = await Package.create(req.body);

    res.status(201).json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating package'
    });
  }
});

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    let package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    package = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating package'
    });
  }
});

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    await Package.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting package'
    });
  }
});

// @desc    Get package categories
// @route   GET /api/packages/categories/list
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Package.distinct('categories');
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching categories'
    });
  }
});

module.exports = router;