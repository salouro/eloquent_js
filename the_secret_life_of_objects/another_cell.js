function StretchCell(inner, width, height){
	this.inner = inner;
  	this.width = width;
  	this.height = height;
}

StretchCell.prototype.minWidth = function(){
	return this.inner.minWidth() < this.width ? this.width : this.inner.minWidth();
};

StretchCell.prototype.minHeight = function(){
	return this.inner.minHeight() < this.height ? this.height : this.inner.minHeight();
}

StretchCell.prototype.draw = function(w, h){
 	return this.inner.draw(w, h); 
}