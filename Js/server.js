const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;


const pool = new Pool({
  user: 'postgres',  
  host: 'localhost',
  database: 'SA', 
  password: 'postgres', 
  port: 5432, 
});


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão com o banco bem-sucedida:', res.rows[0]);
  }
});


app.use(cors());
app.use(bodyParser.json());


app.post('/api/usuarios', async (req, res) => {
  const { email, nomeCompleto, senha, dataNascimento } = req.body;

  console.log('Recebendo dados:', req.body); 

  if (!email || !nomeCompleto || !senha || !dataNascimento) {
    console.log('Campos ausentes!');
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const query = `
      INSERT INTO usuarios (email, nome_completo, senha, data_nascimento)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [email, nomeCompleto, senha, dataNascimento];
    console.log('Executando query com valores:', values); 

    const result = await pool.query(query, values);

    console.log('Usuário criado:', result.rows[0]); 
    res.status(201).json({ message: 'Conta criada com sucesso!', user: result.rows[0] });
  } catch (err) {
    console.error('Erro ao criar usuário:', err); 
    res.status(500).json({ error: 'Erro ao criar conta!' });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
