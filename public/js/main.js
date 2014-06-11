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
	
	var $canvas = $("<canvas>")
		.attr({width:width,height:height})
		// .css({width : containerWidth + "px",height : containerHeight + "px"})
		.appendTo("body");
	var canvas = $canvas.get(0);	
	var context = canvas.getContext("2d");
	var pixels = {};
	var pixeldata; //  = context.getImageData(0,0,width,height);

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

		for(var y = 0; y < height; y++) {
			for(var x = 0; x < width; x++) {
				var pixel = getPixel(x,y);

				var r = pixel.r;// * .95;
				var g = pixel.g;// * .95;
				var b = pixel.b;// * .95;
				var a = 255;

				var n = getPixel(x,y-1);
				var e = getPixel(x+1,y);
				var s = getPixel(x,y+1);
				var w = getPixel(x-1,y);

				averagePixels(n,pixel);
				averagePixels(e,pixel);
				averagePixels(s,pixel);
				averagePixels(w,pixel);

				/*
				var nw = getPixel(x-1,y-1);
				var ne = getPixel(x+1,y-1);
				var se = getPixel(x+1,y+1);
				var sw = getPixel(x-1,y+1);

				averagePixels(nw,pixel);
				averagePixels(ne,pixel);
				averagePixels(se,pixel);
				averagePixels(sw,pixel);
				*/


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

	function cleanSlate() {

		context.fillStyle = "rgb(0, 0, 0)";
		context.fillRect (0, 0, width, height);

		pixeldata = context.getImageData(0,0,width,height);

		for(var x = 0; x < width; x++) {
			for(var y = 0; y < height; y++) {
				var base = {
					r : Math.floor( Math.random() * 255),
					g : Math.floor( Math.random() * 255),
					b : Math.floor( Math.random() * 255),
					a : 255,
					x : x,
					y : y
				};
				pixels[x+"_"+y] = base;
			}
		}
	}

	$(function(){
	
		cleanSlate();
		loop();

		setInterval(loop, 1000 / 60);

		$(document)
			.on("mousemove",function(e){
				var x = parseInt(e.clientX / div);
				var y = parseInt(e.clientY / div);
				if (x < width && y < height && x>= 0 && y >= 0) {
					setPixel(x,y,
						Math.floor( Math.random() * 255),
						Math.floor( Math.random() * 255),
						Math.floor( Math.random() * 255),
						255);
				}
			});
		
	});

});