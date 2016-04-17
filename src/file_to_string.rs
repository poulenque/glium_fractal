use std::path::Path;
use std::fs::File;
use std::io::Read;
use std::io;

pub fn file_to_string(path:String) -> io::Result<String> {
	let path = Path::new(&path);
	let mut file = match File::open(&path) {
		Ok(f)=>f,
		Err(why)=> return Err(why),
	};
	let mut s = String::new();
	let _unused_var = file.read_to_string(&mut s);
	Ok(s)
}
