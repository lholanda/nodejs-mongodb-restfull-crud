/**
 * 
 * Arquivo: produto.js
 * Descrição: Resposavel pelo tratamento pela classe 'Produto'
 * Author: Luiz Holanda
 * Data de Criação: 08/11/2019
 * 
 */
 /*
Produto 
*---------------------
    id : int
    nome: String
    preco: Number
    descricao: String
*---------------------
*/

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ProdutoSchema = new Schema({
    nome: String,
    preco: Number,
    descricao: String
});

module.exports = mongoose.model('Produto', ProdutoSchema);