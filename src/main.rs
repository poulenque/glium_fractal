#[macro_use]
extern crate glium;
extern crate time;
// extern crate image;


mod file_to_string;
use file_to_string::*;

mod fragonly;

fn main() {
	use glium::{DisplayBuild, Surface};
	let display = glium::glutin::WindowBuilder::new()
						.with_vsync()
						.with_transparency(true)
						.with_depth_buffer(24)
						.build_glium().unwrap();

	let frag_src = &file_to_string("glsl/frag.frag".to_string()).unwrap();
	let frag = fragonly::FragOnly::new(&display,frag_src);

	// set time variables
	let time_start = time::PreciseTime::now();
	let mut t : f32;
	let mut time_start_loop = time::PreciseTime::now();

	// set input variables
	let mut mousex : i32 = 0;
	let mut mousey : i32 = 0;

	let mut scrollx : f32 = 0.;
	let mut scrolly : f32 = 0.;
	let mut ctrlscrollx : f32 = 0.;
	let mut ctrlscrolly : f32 = 0.;
	let mut shiftscrollx : f32 = 0.;
	let mut shiftscrolly : f32 = 0.;
	let mut altscrollx : f32 = 0.;
	let mut altscrolly : f32 = 0.;

	let mut lctr = false;
	let mut lalt = false;
	let mut lshift = false;

	let mut pressure : f32 = 0. ;
	let mut zoom : f32 ;

	let mut color_mode: i32 = 5 ;
	let mut fractal_mode: i32 = 6 ;

	println!("+-----------------------------------------------+");
	println!("| everything is controlled by scrolling !       |");
	println!("| scroll = move                                 |");
	println!("| ctrl+scroll = zoom                            |");
	println!("| alt+scroll = transform the figure             |");
	println!("| shift+scroll = change the divergance criteria |");
	println!("| F10 = quit                                    |");
	println!("| 0-9 and q,w,e,r = change coloring             |");
	println!("| p,o,l,i,k,u,j,m = change fractal              |");
	println!("+-----------------------------------------------+");
 	loop {
		zoom = f32::exp(-0.1*ctrlscrolly);
		// absolute time
		t = 0.001 * time_start.to(time::PreciseTime::now()).num_milliseconds() as f64 as f32;

		// time variation
		let dt = 0.001 * time_start_loop.to(time::PreciseTime::now()).num_milliseconds() as f64 as f32;
		time_start_loop = time::PreciseTime::now();

		// prepare targets
		let mut target= display.draw();
		target.clear_color_and_depth((0.0, 0.0, 0.0, 0.0), 1.0);
		let (frame_width, frame_height) = target.get_dimensions();

		let uniforms = uniform! {
			t:t,
			dt:dt,
			mousex:mousex,
			mousey:mousey,
			scrollx:-scrollx,
			scrolly: scrolly,
			ctrlscrollx:-ctrlscrollx,
			ctrlscrolly: ctrlscrolly,
			shiftscrollx:-shiftscrollx,
			shiftscrolly: shiftscrolly,
			altscrollx:-altscrollx,
			altscrolly: altscrolly,
			frame_w:frame_width as i32,
			frame_h:frame_height as i32,
			pressure:pressure,
			zoom:zoom,
			color_mode:color_mode,
			fractal_mode:fractal_mode,
		};

		let _unused = frag.draw_frag(&mut target,&uniforms);

		target.finish().unwrap();

		// poll events
		for ev in display.poll_events() {
			match ev {
				glium::glutin::Event::Closed => return,
				glium::glutin::Event::MouseMoved(x,y) => {mousex=x;mousey=frame_height as i32 -y},
				glium::glutin::Event::MouseWheel(scroll,_) =>
					{
						if lctr {
							match scroll {
								glium::glutin::MouseScrollDelta::LineDelta(u, v) =>{ctrlscrollx +=u ;ctrlscrolly+=v;},
								glium::glutin::MouseScrollDelta::PixelDelta(u,v) =>{ctrlscrollx +=u ;ctrlscrolly+=v;},
							}
						} else if lalt {
							match scroll {
								glium::glutin::MouseScrollDelta::LineDelta(u, v) =>{altscrollx +=zoom*u ;altscrolly+=zoom*v;},
								glium::glutin::MouseScrollDelta::PixelDelta(u,v) =>{altscrollx +=zoom*u ;altscrolly+=zoom*v;},
							}
						} else if lshift {
							match scroll {
								glium::glutin::MouseScrollDelta::LineDelta(u, v) =>{shiftscrollx +=u ;shiftscrolly+=v;},
								glium::glutin::MouseScrollDelta::PixelDelta(u,v) =>{shiftscrollx +=u ;shiftscrolly+=v;},
							}
						} else {
							match scroll {
								glium::glutin::MouseScrollDelta::LineDelta(u, v) =>{scrollx +=zoom*u ;scrolly+=zoom*v;},
								glium::glutin::MouseScrollDelta::PixelDelta(u,v) =>{scrollx +=zoom*u ;scrolly+=zoom*v;},
							}
						}
					},
				glium::glutin::Event::KeyboardInput(s,_,e) => {
					let state =  match s {
					    glium::glutin::ElementState::Pressed => true,
					    glium::glutin::ElementState::Released => false,
					};
					match e {
						None => (),
						Some(t) => match t {
							glium::glutin::VirtualKeyCode::LControl => lctr = state,
							glium::glutin::VirtualKeyCode::LAlt => lalt = state,
							glium::glutin::VirtualKeyCode::LShift => lshift = state,
							glium::glutin::VirtualKeyCode::Key0 => 	{color_mode = 0;	println!("color mode : {}",color_mode)},
							glium::glutin::VirtualKeyCode::Key1 => 	{color_mode = 1;	println!("color mode : {}",color_mode)},
							glium::glutin::VirtualKeyCode::Key2 => 	{color_mode = 2;	println!("color mode : {}",color_mode)},
							glium::glutin::VirtualKeyCode::Key3 => 	{color_mode = 3;	println!("color mode : {}",color_mode)},
							glium::glutin::VirtualKeyCode::Key4 => 	{color_mode = 4;	println!("color mode : {}",color_mode)},
							glium::glutin::VirtualKeyCode::Key5 => 	{color_mode = 5;	println!("color mode : {}",color_mode)},
							glium::glutin::VirtualKeyCode::Key6 => 	{color_mode = 6;	println!("color mode : {}",color_mode)},
							glium::glutin::VirtualKeyCode::Key7 => 	{color_mode = 7;	println!("color mode : {}",color_mode)},
							glium::glutin::VirtualKeyCode::Key8 => 	{color_mode = 8;	println!("color mode : {}",color_mode)},
							glium::glutin::VirtualKeyCode::Key9 => 	{color_mode = 9;	println!("color mode : {}",color_mode)},
							glium::glutin::VirtualKeyCode::Q => 	{color_mode = 10;	println!("color mode : {}",color_mode)},
							glium::glutin::VirtualKeyCode::W => 	{color_mode = 11;	println!("color mode : {}",color_mode)},
							glium::glutin::VirtualKeyCode::E => 	{color_mode = 12;	println!("color mode : {}",color_mode)},
							glium::glutin::VirtualKeyCode::R => 	{color_mode = 13;	println!("color mode : {}",color_mode)},

							glium::glutin::VirtualKeyCode::P => {fractal_mode =0; println!("fractal no {}", fractal_mode);},
							glium::glutin::VirtualKeyCode::O => {fractal_mode =1; println!("fractal no {}", fractal_mode);},
							glium::glutin::VirtualKeyCode::L => {fractal_mode =2; println!("fractal no {}", fractal_mode);},
							glium::glutin::VirtualKeyCode::I => {fractal_mode =3; println!("fractal no {}", fractal_mode);},
							glium::glutin::VirtualKeyCode::K => {fractal_mode =4; println!("fractal no {}", fractal_mode);},
							glium::glutin::VirtualKeyCode::U => {fractal_mode =5; println!("fractal no {}", fractal_mode);},
							glium::glutin::VirtualKeyCode::J => {fractal_mode =6; println!("fractal no {}", fractal_mode);},
							glium::glutin::VirtualKeyCode::M => {fractal_mode =7; println!("fractal no {}", fractal_mode);},
							glium::glutin::VirtualKeyCode::F10 => return,
							_ => {},
						},
					}

				}
				glium::glutin::Event::TouchpadPressure(p, _) => {pressure=p;},

				//TODO
				// glium::glutin::Event::Touch(t)=>{},

				_ => ()
			}
		}
	}
}

