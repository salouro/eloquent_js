function MultiplicatorUnitFailure() {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.5)
    return a * b;
  else
    throw new MultiplicatorUnitFailure();
}

//recursive - my solution
function retry(x, y){
	try{
		return primitiveMultiply(x,y);
	} catch (error){
		if (e instanceof MultiplicatorUnitFailure)
			return retry(x, y);
	}
}

//book solution
function reliableMultiply(a, b) {
  for (;;) {
    try {
      return primitiveMultiply(a, b);
    } catch (e) {
      if (!(e instanceof MultiplicatorUnitFailure))
        throw e;
    }
  }
}
