extern crate glium;

#[derive(Copy, Clone)]
struct Vertex {
	position: [f32; 4],
}
implement_vertex!(Vertex, position);

pub struct FragOnly {
	vertex_buffer: glium::vertex::VertexBuffer<Vertex>,
	index_buffer: glium::index::IndexBuffer<u16>,
	program: glium::program::Program,
}

const VERTEX_SHADER_SRC:&'static str = r#"#version 140
in vec4 position;
void main(){
	gl_Position = position;
}
"#;

impl FragOnly {
	#[allow(dead_code)]
	pub fn draw_frag<S,U> (&self,
						target: &mut S,
						uniforms: &U
						) -> Result<(), glium::DrawError>
						where
						S: glium::Surface,
						U: glium::uniforms::Uniforms,
						{
		target.draw(&self.vertex_buffer, &self.index_buffer, &self.program, uniforms, &glium::DrawParameters {dithering:true,.. Default::default()})
	}
	#[allow(dead_code)]
	pub fn new<'a> (facade: &'a glium::backend::glutin_backend::GlutinFacade, fragment_shader_src:&String) -> Self {
		let vb = {
			
			glium::VertexBuffer::new(facade,
				&[
					Vertex { position: [-1., -1., 0., 1.] },
					Vertex { position: [ 1., -1., 0., 1.] },
					Vertex { position: [ 1.,  1., 0., 1.] },
					Vertex { position: [-1.,  1., 0., 1.] },
				]
			).unwrap()
		};
		let ib = glium::IndexBuffer::new(facade, glium::index::PrimitiveType::TrianglesList,&[0u16, 1, 2, 0, 2, 3]).unwrap();
		FragOnly{
			vertex_buffer:	vb,
			index_buffer: 	ib,
			program:		glium::Program::from_source(
								facade,
								VERTEX_SHADER_SRC,
								fragment_shader_src,
								None).unwrap(),
		}
	}
}