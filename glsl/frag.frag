#version 140

uniform float t;
uniform int mousex;
uniform int mousey;
uniform float scrollx;
uniform float scrolly;
uniform float ctrlscrollx;
uniform float ctrlscrolly;
uniform float shiftscrollx;
uniform float shiftscrolly;
uniform float altscrollx;
uniform float altscrolly;
uniform int frame_w;
uniform int frame_h;
uniform float pressure;
uniform int touchx;
uniform int touchy;

out vec4 color;

void testing_1(){
	float x = .1*gl_FragCoord.x;
	float y = .1*gl_FragCoord.y;

	float cursor_dist = length(gl_FragCoord.xy-vec2(mousex + 50*scrollx, mousey + 50*scrolly));

	x = 1*x+3*t;
	y = 1*y-3*t;

	x = .5 + .5*cos(x + 0.1*cursor_dist);
	y = .5 + .5*cos(y + 0.1*cursor_dist);

	int n = 0;
	while (n<5){
		n++;
		float zx = x;
		float re_square = (x * x - y * y);
		float im_square = 2 * x * y;

		x = sin(re_square  + 0.05*(.1+abs(ctrlscrollx))*(re_square*cos(0.01*altscrolly) - im_square*sin(0.01*altscrollx))  );
		y = sin(im_square  + 0.05*(.1+abs(ctrlscrolly))*(im_square*cos(0.01*altscrolly) + re_square*sin(0.01*altscrollx))   );

	}






	color=vec4(x*y,-x*y,0,1);

	if ( 1.*gl_FragCoord.x/frame_w <.5){
		color *= 1.*gl_FragCoord.x/frame_w;	
	} 
	if ( 1.*gl_FragCoord.y/frame_h <.5){
		color *= 1.*gl_FragCoord.y/frame_h;
	} 
	color*=1-pressure;
}











uniform float zoom;
uniform int color_mode;
uniform int fractal_mode;


//to define to use doubles
// #define DOUBLE_MODE

// will not stop after divergence
// #define CALCULATE_ALL_STEPS

// #define N_MAX 500
// #define N_MAX 100
// #define N_MAX 8

int divergence_radius=4;


//==============
//==============
//NICE PRESETS :
// #define DOUBLE_MODE
// #define FRACTAL_MODE_6
// #define COLOR_MODE_11
// #define CALCULATE_ALL_STEPS
// #define N_MAX 12
//==============
//==============

#ifdef DOUBLE_MODE
	#define NUMBER double
	double dcos(in double d){
		// while(d>pi_2){
		// 	d=d-pi;
		// }while(d<-pi_2){
		// 	d=d+pi;
		// }
		// double d_c = d*d;

		// return  1 - d_c/2. + d_c*d_c/24.;
		// return  1 - d_c/2. + d_c*d_c/24.;
		return cos( float(d) );
	}

	double dsin(in double d){
		// return dcos(d-pi_2);
		// return d;
		return sin( float(d) );
	}

	double datan(in double d){
		// return d;
		return atan( float(d) );
	}
	#define cos(x) dcos(x)
	#define sin(x) dsin(x)
	#define atan(x) datan(x)
#else
	#define NUMBER float
#endif

NUMBER pi = 3.1415926535897932384626433832795028841971693993751058209;
NUMBER pi_2 = pi*.5;

void fractal () {
	float time1 = 0.01*altscrollx;
	float time2 = 0.01*altscrolly;

	float n_max = 100 + shiftscrolly;

	int n = 0;
	vec2 o;

	// o.xy = gl_FragCoord.xy/vec2(frame_w,frame_h) - 0.5*vec2(1,1);
	o.xy = gl_FragCoord.xy/frame_h - vec2(.5*frame_w/frame_h,.5);

	o.x = o.x*zoom + 0.03*scrollx;
	o.y = o.y*zoom + 0.03*scrolly;


	NUMBER z0_x=0;
	NUMBER z0_y=0;
	NUMBER z_x=z0_x;
	NUMBER z_y=z0_y;

	// z0_x=o.x;
	// z0_y=o.y;


	// z0_x= z_x+cos(time1)*cos (0.1*time1)
	// z0_y= z_y+cos(time1)*sin(0.1*time1)

	// z_x = z_x + cos(time1 * 0.1) * cos(0.1 * time1);
	// z_y = z_y + cos(time1 * 0.1) * sin(0.1 * time1);


	#ifdef CALCULATE_ALL_STEPS
		while (n < N_MAX)
	#else
		while ((z_x * z_x) + (z_y * z_y) < divergence_radius*divergence_radius && n < n_max)
	#endif
		{

		NUMBER zx = z_x;
		NUMBER re_square = (zx * zx - z_y * z_y);
		NUMBER im_square = 2 * zx * z_y;
		switch (fractal_mode) {
			case 0:
				z_x = re_square  + 2*(re_square*cos(time1) - im_square*sin(-time2))   + o.x;
				z_y = im_square  + 2*(im_square*cos(time2) + re_square*sin(time1))   + o.y;
			break;
			case 1:
				z_x = (zx*zx*zx) -3*zx*z_y*z_y   +   2*(re_square*cos(time1) - im_square*sin(time1))     + o.x;
				z_y = 3*zx*zx*z_y -z_y*z_y*z_y   +   2*(im_square*cos(time1) + re_square*sin(time1))     + o.y;
			break;
			case 2:
				z_x = (zx*zx*zx) -3*zx*z_y*z_y   +   (im_square*cos(time1) - re_square*sin(time2))     + o.x;
				z_y = 3*zx*zx*z_y -z_y*z_y*z_y   +   (im_square*cos(time2) + im_square*sin(time1))     + o.y;
			break;
			case 3:
				z_x = (zx*zx*zx) -3*zx*z_y*z_y   +   2*(re_square*cos(1.618*time2) - im_square*sin(time1))     + o.x;
				z_y = 3*zx*zx*z_y -z_y*z_y*z_y   +   2*(im_square*cos(1.618*time2) + re_square*sin(time1))     + o.y;
			break;
			case 4:
				z_x = (zx*zx*zx) -3*zx*z_y*z_y   +   2*(re_square*cos(1.618*time1) - im_square*sin(time1))  +   2*( zx*cos(1.414*time2) - z_y*sin(time2))     + o.x;
				z_y = 3*zx*zx*z_y -z_y*z_y*z_y   +   2*(im_square*cos(1.618*time1) + re_square*sin(time1))  +   2*(z_y*cos(1.414*time2) + zx *sin(time2))     + o.y;
			break;
			case 5:
				NUMBER num1=cos(1.414*time1*.01);
				NUMBER num2=sin(time1*.01);
				z_x = (zx*zx*zx) -3*zx*z_y*z_y   +  1.2*( zx*num1 - z_y*num2)     + o.x;
				z_y = 3*zx*zx*z_y -z_y*z_y*z_y   +  1.2*(z_y*num1 + zx *num2)     + o.y;
			break;
			case 6:
				z_x = ((zx*zx*zx) -3*zx*z_y*z_y   +  1.2*( zx*cos(time2) - z_y*sin(time1))     + o.x);
				z_y = (3*zx*zx*z_y -z_y*z_y*z_y   +  1.2*(z_y*cos(time2) + zx *sin(time1))     + o.y);
			break;
			case 7:
				z_x = ((zx*zx*zx) -3*zx*z_y*z_y  + sin((exp(time1)-1)*im_square)   + o.x);
				z_y = (3*zx*zx*z_y -z_y*z_y*z_y  + sin((exp(time2)-1)*re_square)   + o.y);
			break;
		}


		#ifdef CALCULATE_ALL_STEPS
			// if((z_x * z_x) + (z_y * z_y) < 4)
				n = n + 1;
		#else
			n = n + 1;
		#endif
	}
	if (n>=n_max) {
		n=0;
	}
	// NUMBER c = 0.05 * n;
	// NUMBER r = n%2;
	// NUMBER b = n%4/4.;
	// NUMBER r=0;

	NUMBER r;
	NUMBER g;
	NUMBER b;

	NUMBER col1;
	NUMBER col2;
	NUMBER norm;
	col1=(z_x+1.5)/4.;
	col2=(z_y+1.5)/4.;
	norm = sqrt(z_y*z_y + z_x*z_x)/8.;
	int modulo_value=5;

	// works fine
	NUMBER theta = 2*atan((norm - z_x) / z_y) ;
	// NUMBER theta = 2*atan(float((norm - z_x) / z_y)) ;
	// wtf
	// NUMBER theta = 2 * atan (z_y / (norm + z_x));

	switch (color_mode) {
		case 0:
			r=col1;
			g=col2;
			b=col2;
		break;
		case 1:
			r=norm;
			g=norm;
			b=norm;
		break;
		case 2:
			r=(n%modulo_value)/(modulo_value-1.);
			g=norm;
			b=norm;
		break;
		case 3:
			r=(n%modulo_value-modulo_value/2.)/(modulo_value-1.);
			g=norm;
			b=norm;
		break;
		case 4:
			if(n<50){
				r=n/50.;
				g=0;
				b=norm;
			}else{
				r=1;
				g=(n-50)/50.;
				b=norm;
			}
		break;
		case 5:
			if(n<n_max/3.){
				r=float(n)/n_max*3.;
				g=0;
				b=0;
			}else if (n<n_max*2./3.){
				r=1;
				g=(n-n_max/3.)/n_max*3.;
				b=0;
			}else{
				r=1;
				g=1;
				b=(n-n_max*2./3.)/n_max*3.;
			}
		break;
		case 6:
			r=theta;
			g=norm;
			b=norm;
		break;
		case 7:
			if(n<33){
				r=theta/4/3.14+n/33./2.;
				g=0;
				b=0;
			}else if (n<66){
				r=theta/4/3.14+1/2.;
				g=(n-33)/33.;
				b=0;
			}else{
				r=theta/4/3.14+1/2.;
				g=1;
				b=(n-66)/33.;
			}
		break;
		case 8:
			theta = 0;

			if(n<n_max/3.){
				r=theta/4/3.14+float(n)/n_max*3./2.;
				g=0;
				b=0;
			}else if (n<n_max*2./3.){
				r=1;
				g=theta/4/3.14 +(n-n_max/3.)/n_max*3./2.;
				b=0;
			}else{
				r=1;
				g=1;
				b=theta/4/3.14 + (n-n_max*2./3.)/n_max*3./2.;
			}
		break;
		case 9:
			r=n%2;
			g=n%4/3.;
			b=norm;
		break;
		case 10:
			r=cos(t+2*cos(0*t)*col1+2*norm)*col1*norm - sin(t+1.5*cos(0*t)*col1+2*norm)*col2*norm;
			g=cos(t+2*cos(0*t)*col2+2*norm)*col2*norm + sin(t+1.5*cos(0*t)*col2+2*norm)*col1*norm;
			b=norm;
		break;
		case 11:
			r=z_x/4.;
			g=z_y/4.;
			b=norm;
		break;
		case 12:
			r=((n+int(t*10))%10)/9.;
			g=((n+int(t*10))%10)/9.;
			b=norm;
		break;
		case 13:
			// r=.5+.5*cos(2*pi*  ((n+int(time2*10))%10) /9.);
			// g=.5+.5*cos(2*pi*  ((n+int(time2*10))%10) /9.);
			r=.5+.5*cos(2*pi*(n+t*5)/9.);
			g=.5+.5*cos(2*pi*(n+t*5)/9.);
			b=norm;
		break;
	}

	color = vec4 (r, g, b, 1.0);



}






void main(){
	fractal();
	// testing_1();
}
