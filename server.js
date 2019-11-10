/**
 * 
 * Arquivo: server.js
 * Descrição: Levantar o servidor nodejs 
 * Author: Luiz Holanda
 * Data de Criação: 07/11/2019
 * 
 */

// Configurar o Setup da App:
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Produto  = require('./app/models/produto')
// para funcionar com a versao 4.xx para frente - habilitar Promise
mongoose.Promise = global.Promise;  

/*
mongoose.connect('mongodb://lholanda:zaxila01@cluster0-bopon.mongodb.net/test?retryWrites=true&w=majority', 
                 { useMongoClient: true });
*/

//Maneira Local : MongoDB
mongoose.connect('mongodb://localhost:27017/node-crud-api', { useMongoClient: true } );

//Configuração da variável app para usar o 'bodyParser()':
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Definindo a porta onde será executada a nossa api:
var port = process.env.port || 8000;

//---------------------------------------
// Rotas da API
//---------------------------------------
//Criando uma instância das Rotas via Express:
var router = express.Router();

// a middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
    console.log('Time:', Date());
    console.log("A requisição foi respondida pelo App !!!");
    next(); // pula para a proxima rota
  });

// Rota de exemplo:
router.get('/', function( req, res ){
    console.log(res.statusCode);
    res.json({message: "Bem-vindo(a) a nossa loja !!!"})
});

// API´s
/* **************************************************************** */
/* Rotas que terminarem com '/produtos' (servir: GET ALL & POST)    */
/* **************************************************************** */
router.route('/produtos')

/* API procurar todos */
/*-----------------------------------------------------------------------------------------
 1 - Metodo : Incluir novo registro (acessar em : POST http://localhost:8000/api/produtos) 
 *-----------------------------------------------------------------------------------------*/
.post(  function( req, res ){
    var produto = new Produto();
    // aqui vamos setar os campos do produto (via request)
    produto.nome      = req.body.nome;
    produto.preco     = req.body.preco;  
    produto.descricao = req.body.descricao;

    console.log(res.statusCode);
    // salvar no banco
    produto.save(function(error) {
      if(error)
         res.send("Erro ao salvar "+ error);
      res.json({ message: "Produto : "+produto.nome + " cadastrado com sucesso !!!"});          
    });

}) 

/* API procurar todos */
/*-----------------------------------------------------------------------------------------
 2 - Metodo : Procurar todos (acessar em : GET http://localhost:8000/api/produtos) 
 *-----------------------------------------------------------------------------------------*/
.get(  function( req, res ){
  // Primeiro - achar todos os produto
  Produto.find(function(error, produtos) {
    if(error)
       res.send("Erro ao ler todos os produtos "+ error);
    res.json(produtos);          
  });

})    

/* ************************************************************************************* */
/* Rotas que terminarem com '/produtos/:produto_id' (servir: GET , PUT e DELETE : id)    */
/* ************************************************************************************* */
router.route('/produtos/:produto_id')
/* API procurar por Id*/
/*----------------------------------------------------------------------------------------------
 3 - Metodo : Atualizar por id (acessar em : PUT http://localhost:8000/api/produtos/:produto_id) 
 *----------------------------------------------------------------------------------------------*/
.get(  function( req, res ){

  // Primeiro - procurar e achar o produto
  Produto.findById( req.params.produto_id, function(error, produto) {
    if(error)
       res.send("Id do produto não encontrado !!! "+ error);

    res.json(produto);          
  });

})   

/* API de atualizar (PUT) */
/*----------------------------------------------------------------------------------------------
 4 - Metodo : Atualizar por id (acessar em : PUT http://localhost:8000/api/produtos/:produto_id) 
 *----------------------------------------------------------------------------------------------*/
.put(  function( req, res ){
  // Primeiro - procurar e achar o produto atraves do Id
  Produto.findById( req.params.produto_id, function(error, produto) {
    if(error)
      res.send("Id do produto não encontrado !!! "+ error);
    // Segundo - preencher os campos do produto encontrado
    produto.nome      = req.body.nome;
    produto.preco     = req.body.preco;  
    produto.descricao = req.body.descricao;

    // Terceiro - Salvar as propriedades - com save()
    produto.save(function(error) {
    if(error)
      res.send("Erro ao atualizar o produto !!! "+ error);

      res.json({ message: "Produto atualizado com sucesso !!!"});          
    });      
  });

}) 

/* API de atualizar (DELETE) */
/*----------------------------------------------------------------------------------------------
 5 - Metodo : Atualizar por id (acessar em : PUT http://localhost:8000/api/produtos/:produto_id) 
 *----------------------------------------------------------------------------------------------*/
.delete( function( req, res) {
  Produto.remove({ _id: req.params.produto_id }, 
    function ( error ) {
      if(error)
        res.send("Id do produto não encontrado !!! "+ error);     
      
        res.json({ message: "Produto excluido com sucesso !!!"}); 
    }
  );
});

// Observacao : O remove procura e depois remove se encontrar, se nao encontrar retorna erro.

// Definindo um padrão das rotas prefixadas: '/api':
app.use('/api', router);

// Iniciando a Aplicação (servidor):
app.listen(port);
console.log("Iniciando a app na porta " + port);
console.log(Produto.modelName);


