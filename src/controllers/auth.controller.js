const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validar campos requeridos
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Username, email y password son requeridos' 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ 
      where: { 
        [require('sequelize').Op.or]: [{ username }, { email }]
      } 
    });

    if (existingUser) {
      return res.status(409).json({ 
        error: 'Usuario o email ya existe' 
      });
    }

    // Obtener el rol (por defecto CUSTOMER)
    const roleName = role || 'CUSTOMER';
    const userRole = await Role.findOne({ where: { name: roleName } });

    if (!userRole) {
      return res.status(400).json({ 
        error: 'Rol inválido' 
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role_id: userRole.id
    });

    // Generar token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        username: newUser.username,
        role: roleName
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: roleName
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error al registrar usuario',
      details: error.message 
    });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar campos requeridos
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username y password son requeridos' 
      });
    }

    // Buscar usuario
    const user = await User.findOne({ 
      where: { username },
      include: [{
        model: Role,
        as: 'role',
        attributes: ['name']
      }]
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Generar token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        role: user.role.name
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role.name
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error al iniciar sesión',
      details: error.message 
    });
  }
};

// Obtener usuario actual
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email'],
      include: [{
        model: Role,
        as: 'role',
        attributes: ['name']
      }]
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ 
      error: 'Error al obtener usuario',
      details: error.message 
    });
  }
};
