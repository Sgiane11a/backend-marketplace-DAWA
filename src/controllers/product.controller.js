const Product = require('../models/Product');
const Category = require('../models/Category'); 

exports.getAllProducts = async (req, res) => {
  try {
    const { category_id } = req.query;
    
    const whereClause = category_id ? { category_id } : {};
    
    const products = await Product.findAll({
      where: whereClause,
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }
    });
    
    res.json({
      success: true,
      message: 'Productos obtenidos correctamente',
      data: products
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      data: null
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Producto obtenido correctamente',
      data: product
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      data: null
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { nombre, precio, descripcion, image_url, category_id } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y precio son requeridos',
        data: null
      });
    }

    if (precio <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser mayor a 0',
        data: null
      });
    }

    const product = await Product.create({ 
      nombre, 
      precio, 
      descripcion, 
      image_url, 
      category_id 
    });

    // Cargar la categoría después de crear
    await product.reload({
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }
    });

    res.status(201).json({
      success: true,
      message: 'Producto creado correctamente',
      data: product
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      data: null
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { nombre, precio, descripcion, image_url, category_id } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
        data: null
      });
    }

    if (precio && precio <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser mayor a 0',
        data: null
      });
    }

    await product.update({ 
      nombre, 
      precio, 
      descripcion, 
      image_url, 
      category_id 
    });

    // Recargar con la categoría
    await product.reload({
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'description']
      }
    });

    res.json({
      success: true,
      message: 'Producto actualizado correctamente',
      data: product
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
      data: null
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
        data: null
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Producto eliminado correctamente',
      data: null
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      data: null
    });
  }
};