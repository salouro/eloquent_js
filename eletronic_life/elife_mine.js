//Utilities

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

function randomElement(array){
	return array[Math.floor(Math.random() * array.length)];
}

function elementFromChar(legend, ch){
	if (ch == " ") 
		return null;
	var element = new legend[ch]();
	element.originChar = ch;
	return element;
}

function charFromElement(legend, element){
	if (element == null)
		return " ";
	return element.originChar;
}

//action
var actionTypes = Object.create(null);

actionTypes.move = function(vector, dest, critter){
	dest = vector.plus(dest);
	var target = this.grid.get(dest);
  	console.log(vector);
 	console.log(dest);
  	console.log(target);
 	this.grid.set(dest, critter);
	this.grid.set(vector, target);
};
//Vector

function Vector(x, y){
	this.x = x;
	this.y = y;
}

Vector.prototype.plus = function(vector){
	return new Vector(this.x + vector.x, this.y + vector.y);
};

//Wall
function Wall(){ }

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
	if (dir = view.find(" "))
		return {type : "move", direction : dir};
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
			grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
		}
	})
}

World.prototype.turn = function(){
	var acted = [];
	this.grid.forEach(function(critter, vector){
		if (critter.act && acted.indexOf(critter) == -1){
			acted.push(critter);
			this.letAct(vector, critter);
		}
	}, this)
};
World.prototype.letAct = function(vector, critter){
	var action = critter.act(new View(this, vector));
	if (action.type in actionTypes)
		actionTypes[action.type].call(this, vector, directions[action.direction], critter);
};
World.prototype.toString = function(){
	var result = "";
	for (var y = 0; y < this.grid.height; y++){
		for (var x = 0; x < this.grid.width; x++)
			result += charFromElement(this.legend, this.grid.get(new Vector(x, y)));
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
Grid.prototype.forEach = function(f, context){
	for (var y = 0; y < this.height; y++){
		for (var x = 0; x < this.width; x++){
			var value = this.space[x + y * this.width];
			if (value != null)
				f.call(context, value, new Vector(x, y));
		}
	}
};

//View
function View(world, vector){
	this.world = world;
	this.vector = vector;
}

View.prototype.look = function(dir){
	var target = this.vector.plus(directions[dir]);
	if (this.world.grid.isInside(target)){
      	return charFromElement(this.legend, this.world.grid.get(target));
    }
	else
		return "#";
};

View.prototype.findAll = function(ch){
	var found = [];
	for (var dir in directions){
		if (this.look(dir) == ch)
			found.push(dir);
	}
	return found;
};

View.prototype.find = function(ch){
	var found = this.findAll(ch);
	return randomElement(found);
};

//start
var plan = ["####",
			"#  #",
			"# o#",
			"####",];

var world = new World(plan, {"#" : Wall, 
							 "o" : Herbivore});
for (var i = 0; i < 10; i++){
  	world.turn();
  	console.log(world.toString());
}