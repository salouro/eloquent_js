var plan = ["############################",
            "#      #    #      o      ##",
            "#                          #",
            "#          #####           #",
            "##         #   #    ##     #",
            "###           ##     #     #",
            "#           ###      #     #",
            "#   ####                   #",
            "#   ##       o             #",
            "# o  #         o       ### #",
            "#    #                     #",
            "############################"];
/*for (var line in plan)
  console.log(plan[line]);*/

function toString(arr){
  var result = "";
	for (var line in arr)
      result += arr[line] + "\n";
  return result
}

function Vector(x, y){
	this.x = x;
  	this.y = y;
}

Vector.prototype.plus = function(vec){
	return new Vector(this.x + vec.x, this.y + vec.y);
}

function Grid(width, height){
	this.space = new Array(width * height);
  	this.width = width;
  	this.height = height;
}

Grid.prototype.isInside = function(vector){
  return vector.x >= 0 && vector.x < this.width &&
         vector.y >= 0 && vector.y < this.height;
};

Grid.prototype.get = function(vector){
  return this.space[vector.x + (vector.y * this.width)];
};

Grid.prototype.set = function(vector, content){
  this.space[vector.x + (vector.y * this.width)] = content;
};

var directions = {
  "n":  new Vector( 0, -1),
  "ne": new Vector( 1, -1),
  "e":  new Vector( 1,  0),
  "se": new Vector( 1,  1),
  "s":  new Vector( 0,  1),
  "sw": new Vector(-1,  1),
  "w":  new Vector(-1,  0),
  "nw": new Vector(-1, -1)
};

function randomElement(array){
  return array[Math.floor(Math.random() * array.length)];
}

var directionNames = "n ne e se s sw w nw".split(" ");

function BouncingCritter(){
  this.direction = randomElement(directionNames);
};

BouncingCritter.prototype.act = function(view){
  if(view.look(this.direction) != " ")
    this.direction = view.find(" ") || "s";
  return {type : "move", direction : this.direction};
}

function elementFromChar(legend, ch){
  if (ch == " ")
    return null
  var element = new legend[ch]();
  element.originChar = ch;
  return element;
}

function charFromElement(element){
  if (element == null)
    return " ";
  else
    return element.originChar;
}

function World(map, legend){
  var grid = new Grid(map[0].length, map.length);
  this.grid = grid;
  this.legend = legend;
  map.forEach(function(line, y){
    for (var x = 0; x < line.length; x++)
      grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
  })
}

World.prototype.toString = function(){
  var output = "";
  for (var y = 0; y < this.grid.height; y++){
    for (var x = 0; x < this.grid.width; x++){
      var element = grid.get(new Vector(x, y));
      output += charFromElement(element);
    }

  }
  return output;
}

function Wall(){}

Grid.prototype.forEach = function(f, context){
  for (var y = 0; y < this.height; y++){
    for (var x = 0; x < this.width; x++){
      var value = this.space[x + y * this.width];
      if (value != null)
        f.call(context, value, new Vector(x, y));
    }
  }
};

World.prototype.turn = function() {
  var acted = [];
  this.grid.forEach(function(critter, vector){
    if (critter.act && acted.indexOf(critter == -1)){
      acted.push(critter);
      this.letAct(critter, vector);
    }
  }, this);
};

World.prototype.checkDestination = function(action, vector){
  if(directions.hasOwnProperty(action.direction)){
    var dest = vector.plus(directions[action.direction]);
    if(this.grid.isInside(dest))
      return dest;
  }
};

World.prototype.letAct = function(critter, vector){
  var action = critter.act(new View(this, vector));
  if (action && action.type == "move"){
    var dest = this.checkDestination(action, vector);
    if (dest && this.grid.get(dest) == null){
      this.grid.set(vector, null);
      this.grid.set(dest, null);
    }
  }
};

function View(world, vector){
  this.world = world;
  this.vector = vector;
}

View.prototype.look = function(dir){
  var target = this.vector.plus(directions[dir]);
  if (this.world.isInside(target))
    return charFromElement(this.world.grid.get(target));
  else
    return "#";
};

View.prototype.findAll = function(chr){
  var found = [];
  for (var dir in directions){
    if (this.look(dir) == ch)
      found.push(dir);
  }
  return found;
};

View.prototype.find = function(chr){
  var found = this.foundAll(chr);
  if (found.length == 0) return null;
  return randomElement(found);
};

for (var i = 0; i < 8; i++){
  world.turn();
  console.log(world.toString());
}
//animateWorld(valley);
