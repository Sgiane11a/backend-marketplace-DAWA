const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runInit() {
  const connection = await mysql.createConnection({
    host: 'tramway.proxy.rlwy.net',
    port: 37104,
    user: 'root',
    password: 'xhGTaotxXHSrKFCFOijSNWfMcIfDNUoV',
    database: 'railway',
    multipleStatements: true
  });

  console.log('✅ Conectado a Railway MySQL');

  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
  
  console.log('📝 Ejecutando init.sql...');
  await connection.query(sql);
  
  console.log('✅ Base de datos inicializada correctamente!');
  
  await connection.end();
}

runInit().catch(console.error);
