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

actionTypes.move = function(vector, critter, dir){
	dest = this.checkDestination(dir, vector);
	var target = this.grid.get(dest);
 	this.grid.set(dest, critter);
	this.grid.set(vector, target);
	critter.energy -= 0.5;
};

actionTypes.eat = function(vector, critter, dir){
	dest = this.checkDestination(dir, vector);
	var target = this.grid.get(dest);
	this.grid.set(dest, null);
	critter.energy += target.energy;
};

actionTypes.sleep = function(vector, critter){
	critter.energy += Math.ceil(0.5 + Math.random() * 2);
};

actionTypes.grow = function(vector, critter){
	critter.energy += Math.floor(1 + Math.random() * 2);
};

actionTypes.reproduce = function(vector, critter, dir){
	var dest = this.checkDestination(dir, vector);
	var child = elementFromChar(this.legend, critter.originChar);
	this.grid.set(dest, child);
	critter.energy -= 20 + child.energy;
};

actionTypes.die = function(vector, critter){
	this.grid.set(vector, null);
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


//Plant
function Plant(){
	this.energy = Math.floor(3 + Math.random() * 7);
	this.age = 0;
	this.maxAge = Math.floor(120 + Math.random() * 50);
}
//act interface
Plant.prototype.act = function(view){
	if (this.energy < 30 || !(dir = view.find(" ")))
		return {type : "grow"};
	else
		return {type : "reproduce", direction : dir};
};

//Herbivore
function Herbivore(){
	this.energy = Math.floor(15 + Math.random() * 5);
	this.age = 0;
	this.maxAge = Math.floor(35 + Math.random() * 5);
	this.direction = randomElement(directionNames);
}
//act interface
Herbivore.prototype.act = function(view){
	if (this.age == this.maxAge){
		return {type : "die"};
	} else{
		if (this.energy > 60 && (dir = view.find(" ")))
			return {type : "reproduce", direction : dir};
		else if (this.energy > 0.5)
			if (dir = view.find("*"))
				return {type : "eat", direction : dir};
			if (view.look(this.direction) != " "  ||  !this.direction){
				if (dir = view.find(" "))
					this.direction = dir;
				else
					return {type : "sleep"};
			}
			return {type : "move", direction : this.direction};
	}
};

//Carnivore
function Carnivore(){
	this.energy = this, Math.floor(20 + Math.random() * 3);
}
//act interface
Carnivore.prototype.act = function(view){
	//to-do
};

//World
//turn()
//letAct()
//toString()
//checkDestination()
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
			++critter.age;
		}
	}, this)
};

World.prototype.letAct = function(vector, critter){
	var action = critter.act(new View(this, vector));
	if (action && action.type in actionTypes)
		actionTypes[action.type].call(this, vector, critter, action.direction);
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

World.prototype.checkDestination = function(dir, vector){
	if (directions.hasOwnProperty(dir)){
		var dest = vector.plus(directions[dir]);
		if (this.grid.isInside(dest))
			return dest;
	}
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
var plan = ["##########################################",
			"#                                        #",
			"#                              o         #",
			"###############################          #",
			"#              ***************           #",
			"#  ****              ###         o       #",
			"####### *    ********* #                 #",
			"##########################################"];

var world = new World(plan, {"#" : Wall,
							 "o" : Herbivore,
							 "*" : Plant});