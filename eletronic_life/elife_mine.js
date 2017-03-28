function Vector(x, y){
	this.x = x;
	this.y = y;
}

Vector.prototype.plus = function(vector){
	return new Vector(this.x + vector.x, this.y + vector.y);
};

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
	//to-do
};

//Herbivore extends Critter
function Herbivore(){
	Critter.call(this, Math.floor(15 + Math.random() * 5));
}
//inheritance
Herbivore.prototype = Object.create(Critter);
//act interface
Herbivore.prototype.act = function(view){
	//to-do
};

//Carnivore extends Critter
function Carnivore(){
	Critter.call(this, Math.floor(20 + Math.random() * 3));
}
//inheritance
Carnivore.prototype = Object.create(Critter);
//act interface
Carnivore.prototype.act = function(view){
	//to-do
};

//World
//turn()
//letAct()
function World(plan, legend){
  	var grid = new Grid(plan[0].length, plan.length)
	this.grid = grid;
	this.legend = legend;
	plan.forEach(function (line, y){
		for (var x = 0; x < line.length; x++){
			grid.set(new Vector(x, y), line[x]);
		}
	})
}

World.prototype.turn = function(){
	//to-do
};
World.prototype.letAct = function(){
	//to-do
};
World.prototype.toString = function(){
	var result = "";
	for (var y = 0; y < this.grid.height; y++){
		for (var x = 0; x < this.grid.width; x++)
			result += this.grid.get(new Vector(x, y));
		result += "\n";
	}
  return result;
};

//Grid
function Grid(width, height){
	this.space = [];
	this.width = width;
	this.height = height;
}

Grid.prototype.isInside = function(vector){
	return vector.x >= 0 && vector.x < this.width
			&& vector.y >= 0 && vector.y < this.height;
};

Grid.prototype.get = function(vector){
	return this.space[vector.x + vector.y * this.width];
};

Grid.prototype.set = function(vector, value){
	this.space[vector.x + vector.y * this.width] = value;
};

//Directions

var directions = {
	"n"  : new Vector(0, -1),
	"ne" : new Vector(1, -1),
	"e"  : new Vector(1, 0),
	"se" : new Vector(1, 1),
	"s"  : new Vector(0, 1),
	"sw" : new Vector(-1, 1),
	"w"  : new Vector(-1, 0),
	"nw" : new Vector(-1, -1)
};

var directionNames = "n ne e se s sw w nw".split(" ");

var plan = ["####",
			"#  #",
			"#  #",
			"####",];

var world = new World(plan, {"#" : Wall});
console.log(world.toString());