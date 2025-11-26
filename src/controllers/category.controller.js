const Category = require('../models/Category');
const Product = require('../models/Product');

// Obtener todas las categorías
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'description'],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      message: 'Categorías obtenidas correctamente',
      data: categories
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      data: null
    });
  }
};

// Obtener categoría por ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: {
        model: Product,
        as: 'products',
        attributes: ['id', 'nombre', 'precio', 'descripcion', 'image_url']
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Categoría obtenida correctamente',
      data: category
    });
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categoría',
      data: null
    });
  }
};

// Crear categoría (solo ADMIN)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es requerido',
        data: null
      });
    }

    const category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      message: 'Categoría creada correctamente',
      data: category
    });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    
    // Error de nombre duplicado
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre',
        data: null
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear categoría',
      data: null
    });
  }
};

// Actualizar categoría (solo ADMIN)
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
        data: null
      });
    }

    await category.update({ name, description });

    res.json({
      success: true,
      message: 'Categoría actualizada correctamente',
      data: category
    });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre',
        data: null
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar categoría',
      data: null
    });
  }
};

// Eliminar categoría (solo ADMIN)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
        data: null
      });
    }

    // Verificar si hay productos asociados
    const productCount = await Product.count({
      where: { category_id: req.params.id }
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la categoría porque tiene ${productCount} producto(s) asociado(s)`,
        data: null
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: 'Categoría eliminada correctamente',
      data: null
    });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar categoría',
      data: null
    });
  }
};
