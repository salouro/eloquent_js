function withBoxUnlocked(action){
	box.unlock();
	try{
		action();
	}
	finally{
		box.lock();
	}
}