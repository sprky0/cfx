require.config({
	paths : {
		'jquery' : 'vendor/jquery'
	}
});

define("main",['jquery'],function($){

	var div = 20;
	var containerWidth = $(window).width();
	var containerHeight = $(window).height();
	var height = parseInt(containerHeight / div);
	var width = parseInt(containerWidth / div);
	var loopCount = 0;
	var fx = {
		average_n : 1,
		average_ne : 0,
		average_e : 0,
		average_se : 0,
		average_s : 0,
		average_sw : 0,
		average_w : 0,
		average_nw : 0
	};

	var $canvas = $("<canvas>")
		.attr({width:width,height:height})
		// .css({width : containerWidth + "px",height : containerHeight + "px"})
		.appendTo("body");
	var canvas = $canvas.get(0);
	var context = canvas.getContext("2d");
	var pixels = {};
	var pixeldata; //  = context.getImageData(0,0,width,height);
	var palette = [];

	function getRandomColor() {
		return palette[Math.floor(Math.random() * palette.length)];
	}

	function getPixel(x,y) {
		if (!pixels[x+"_"+y])
			return false;
		return pixels[x+"_"+y];
	}

	function setPixel(x,y,r,g,b) {
		pixels[x+"_"+y] = {
			r : r,
			g : g,
			b : b,
			a : 255,
			x : x,
			y : y
		};
	}

	function averagePixels(p1,p2) {
		if (p1 && p2 && Math.random() < .4) {
			var r = (p1.r + p2.r) / 2;
			var g = (p1.g + p2.g) / 2;
			var b = (p1.b + p2.b) / 2;
			setPixel(p1.x,p1.y,r,g,b);
			setPixel(p2.x,p2.y,r,g,b);
		}
	}

	function loop() {

		loopCount++;

		if (loopCount > 60) {
			chaos();
			loopCount = 0;
		}

		for(var y = 0; y < height; y++) {
			for(var x = 0; x < width; x++) {
				var pixel = getPixel(x,y);

				var r = pixel.r;// * .95;
				var g = pixel.g;// * .95;
				var b = pixel.b;// * .95;
				var a = 255;

				if (fx.average_n) {
					var n = getPixel(x,y-1);
					averagePixels(n,pixel);
				}

				if (fx.average_e > 0) {
					var e = getPixel(x+1,y);
					averagePixels(e,pixel);
				}

				if (fx.average_s > 0) {
					var s = getPixel(x,y+1);
					averagePixels(s,pixel);
				}

				if (fx.average_w > 0) {
					var w = getPixel(x-1,y);
					averagePixels(w,pixel);
				}

				if (fx.average_nw > 0) {
					var nw = getPixel(x-1,y-1);
					averagePixels(nw,pixel);
				}

				if (fx.average_ne > 0) {
					var ne = getPixel(x+1,y-1);
					averagePixels(ne,pixel);
				}

				if (fx.average_se > 0) {
					var se = getPixel(x+1,y+1);
					averagePixels(se,pixel);
				}

				if (fx.average_sw > 0) {
					var sw = getPixel(x-1,y+1);
					averagePixels(sw,pixel);
				}

				setPixel(x,y,r,g,b);

				var offset = (width * y + x) * 4;
				pixeldata.data[offset + 0] = r;
				pixeldata.data[offset + 1] = g;
				pixeldata.data[offset + 2] = b;
				pixeldata.data[offset + 3] = a;
			}
		}

		context.putImageData(pixeldata,0,0);

	}

	function chaos() {

		fx.average_n = Math.random() > .3 ? 0 : 1;
		fx.average_ne = Math.random() > .3 ? 0 : 1;
		fx.average_e = Math.random() > .3 ? 0 : 1;
		fx.average_se = Math.random() > .3 ? 0 : 1;
		fx.average_s = Math.random() > .3 ? 0 : 1;
		fx.average_sw = Math.random() > .3 ? 0 : 1;
		fx.average_w = Math.random() > .3 ? 0 : 1;
		fx.average_nw = Math.random() > .3? 0 : 1;

		fillEdges();

	}

	function cleanSlate() {

		context.fillStyle = "rgb(0, 0, 0)";
		context.fillRect (0, 0, width, height);

		pixeldata = context.getImageData(0,0,width,height);

		palette = [];

		for(var i = 0; i < 4; i++) {
			palette.push({
				r : Math.random() * 255,
				g : Math.random() * 255,
				b : Math.random() * 255
			});
		}

		for(var x = 0; x < width; x++) {
			for(var y = 0; y < height; y++) {
				var base = {
					r : 0,//Math.floor( Math.random() * 255),
					g : 0,//Math.floor( Math.random() * 255),
					b : 0,//Math.floor( Math.random() * 255),
					a : 255,
					x : x,
					y : y
				};
				pixels[x+"_"+y] = base;
			}
		}
	}

	function fillEdges() {

		for(var x = 0; x < width; x++) {
			var y = 0;
			var color = getRandomColor();
			var base = {
				r : color.r,
				g : color.g,
				b : color.b,
				a : 255,
				x : x,
				y : y
			};
			pixels[x+"_"+y] = base;
			var y = height - 1;
			var color = getRandomColor();
			var base = {
				r : color.r,
				g : color.g,
				b : color.b,
				a : 255,
				x : x,
				y : y
			};
			pixels[x+"_"+y] = base;
		}
		for(var y = 0; y < height; y++) {
			var x = 0;
			var color = getRandomColor();
			var base = {
				r : color.r,
				g : color.g,
				b : color.b,
				a : 255,
				x : x,
				y : y
			};
			pixels[x+"_"+y] = base;
			var x = width - 1;
			var color = getRandomColor();
			var base = {
				r : color.r,
				g : color.g,
				b : color.b,
				a : 255,
				x : x,
				y : y
			};
			pixels[x+"_"+y] = base;
		}

	}

	$(function(){

		cleanSlate();
		loop();

		setInterval(loop, 1000 / 60);

		/*
		$(document)
			.on("mousemove",function(e){
				var x = parseInt(e.clientX / div);
				var y = parseInt(e.clientY / div);
				if (x < width && y < height && x>= 0 && y >= 0) {
					setPixel(
						x,
						y,
						Math.floor( Math.random() * 255),
						Math.floor( Math.random() * 255),
						Math.floor( Math.random() * 255),
						255
					);
				}
			});
			*/

		$(document).on("click", function() {
			fillEdges();
		});


	});

});
