//Critter
//move()
//eat()
//grow()
//reproduce()
function Critter(energy){
	this.energy = energy;
};
Critter.move = function(vector, dest){console.log("move to somewhere else")};
Critter.eat = function(vector, target){console.log("eat something");};
Critter.grow = function(){console.log("I'm growing stronger")};
Critter.reproduce = function(vector){console.log("I'm fucking")};

//Plant extends Critter
function Plant(){
	Critter.call(this, Math.floor(3 + Math.random() * 4));
}
//inheritance
Plant.prototype = Object.create(Critter);
//act interface
Plant.prototype.act = function(view){
}

//Herbivore extends Critter
function Herbivore(){
	Critter.call(this, Math.floor(15 + Math.random() * 5));
}
//inheritance
Herbivore.prototype = Object.create(Critter);
//act interface
Herbivore.prototype.act = function(view){
}

//Carnivore extends Critter
function Carnivore(){
	Critter.call(this, Math.floor(20 + Math.random() * 3));
}
//inheritance
Carnivore.prototype = Object.create(Critter);
//act interface
Carnivore.prototype.act = function(view){
}

//World
//turn()
//letAct()
function World(plan, legend){
	this.grid = new Grid(plan[0].length, plan.length);
	this.legend = legend;
}
World.