require.config({
	paths : {
		'jquery' : 'vendor/jquery'
	}
});

define("main",['jquery','windrose'],function($,windrose){

	var div = 20;
	var containerWidth = $(window).width();
	var containerHeight = $(window).height();
	var height = parseInt(containerHeight / div);
	var width = parseInt(containerWidth / div);
	var loopCount = 0;
	var fx = {
		average : {
			n : 1,
			ne : 0,
			e : 0,
			se : 0,
			s : 0,
			sw : 0,
			w : 0,
			nw : 0
		}
	};

	var $canvas = $("<canvas>")
		.attr({width:width,height:height})
		.appendTo("body");
	var canvas = $canvas.get(0);
	var context = canvas.getContext("2d");
	var pixels = {};
	var pixeldata;
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

	function inverseAveragePixels(p1,p2,weight) {
		return averagePixels(p1,p2,1-weight);
	}

	function averagePixels(p1,p2,weight) {
		if (p1 && p2) {

			var p1_weight = weight || .8;
			var p2_weight = 1 - p1_weight;

			var r1 = p1.r * p1_weight + p2.r * p2_weight;
			var g1 = p1.g * p1_weight + p2.g * p2_weight;
			var b1 = p1.b * p1_weight + p2.b * p2_weight;

			var r2 = p1.r * p2_weight + p2.r * p1_weight;
			var g2 = p1.g * p2_weight + p2.g * p1_weight;
			var b2 = p1.b * p2_weight + p2.b * p1_weight;

			setPixel(p1.x,p1.y,r1,g1,b1);
			setPixel(p2.x,p2.y,r2,g2,b2);

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

				var r = pixel.r;
				var g = pixel.g;
				var b = pixel.b;
				var a = 255;

				if (fx.average.n) {
					var n = getPixel(x,y-1);
					inverseAveragePixels(n,pixel,fx.average.n);
				}

				if (fx.average.e > 0) {
					var e = getPixel(x+1,y);
					inverseAveragePixels(e,pixel,fx.average.e);
				}

				if (fx.average.s > 0) {
					var s = getPixel(x,y+1);
					inverseAveragePixels(s,pixel,fx.average.s);
				}

				if (fx.average.w > 0) {
					var w = getPixel(x-1,y);
					inverseAveragePixels(w,pixel,fx.average.w);
				}

				if (fx.average.nw > 0) {
					var nw = getPixel(x-1,y-1);
					inverseAveragePixels(nw,pixel,fx.average.nw);
				}

				if (fx.average.ne > 0) {
					var ne = getPixel(x+1,y-1);
					inverseAveragePixels(ne,pixel,fx.average.ne);
				}

				if (fx.average.se > 0) {
					var se = getPixel(x+1,y+1);
					inverseAveragePixels(se,pixel,fx.average.se);
				}

				if (fx.average.sw > 0) {
					var sw = getPixel(x-1,y+1);
					inverseAveragePixels(sw,pixel,fx.average.sw);
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

		// put some crap in so we have image data to work with
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
					r : 0,
					g : 0,
					b : 0,
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

		$(document).on("click", function() {
			fillEdges();
		});

		var w = windrose(document);
		w.on("update",function(meta){
			for(var i in fx.average) {
				if (meta.rose[i]) {
					fx.average[i] = meta.rose[i] > 0.1 ? meta.rose[i] : 0;
				}
			}
		});

	});

});
