const chai = require('chai');
const chaiHttp = require('chai-http');

const router = require('../recipesRouter');

const should = chai.should();

chai.use(chaiHttp);

describe('Recipes', function() {
    it('should should list recipes on GET', function() {
        return chai.request(app)
            .get('/recipes')
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.at.least(1);

                const expectedKeys = ['name', 'id', 'ingredients'];
                res.body.forEach(function(item){
                    item.should.be.a('object');
                    item.should.include.keys(expectedKeys);
                });
            });
    });

});

it('should add a recipe on POST', function(){
    const newRecipe = {name: 'cookies', ingredients: 'butter, sugar, eggs, flour'};
    return chai.request(app)
        .post('/recipes')
        .send(newRecipe)
        .then(function(res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys('id', 'name', 'ingredients');
            res.body.id.should.not.be.null;
            res.body.should.be.deep.equal(Object.assign(newItem, {id: res.body.id}));
        });

});

it('should update recipes on PUT', function(){
    const updateData = {
        name: 'foo',
        checked: true
    };
    return chai.request(app)
        .get('.recipes')
        .then(function(res) {
            updateData.id = res.body[0].id;
            return chai.request(app)
                .put('/recipes/${updateData.id}')
                .send(updateData)
        })
        .then(function(res) {
            res.should.have.status(204);
        });
});

it('should delete recipes on DELETE', function() {
    return chai.request(app)
    .get('/recipes')
    .then(function(res) {
        return chai.request(app)
            .delete('/recipes/${res.body[0].id}');
    })
    .then(function(res) {
        res.should.have.status(204);
    });
});