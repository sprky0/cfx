define('windrose',['jquery'],function($){

	function windrose(container, options) {

		var containerWidth = $(container).width();
		var containerHeight = $(container).height();
		var callbacks = {update : false};

		var c_edges = {
			n  : [containerWidth / 2,0],
			ne : [containerWidth, 0],
			e  : [containerWidth, containerHeight / 2],
			se : [containerWidth, containerHeight],
			s  : [containerWidth / 2, containerHeight],
			sw : [0, containerHeight],
			w  : [0, containerHeight / 2],
			nw : [0,0]
		};

		var rose = {
			n  : 0,
			ne : 0,
			e  : 0,
			se : 0,
			s  : 0,
			sw : 0,
			w  : 0,
			nw : 0
		};

		var vector = {
			angle : 0,
			magnitude : 0
		};

		var c_middle = [containerWidth / 2, containerHeight / 2];

		var c_base_distances = (function(){
			var c_dist = {};
			for (var i in c_edges) {
				c_dist[i] = getDistance(c_edges[i][0], c_edges[i][1], c_middle[0], c_middle[1]);
			}
			return c_dist;
		})();

		function getSquare(n) {
			return n * n;
		}

		function getDistance(x1,y1,x2,y2) {
			return Math.sqrt( Math.abs( getSquare(x2 - x1) - getSquare( y2 - y1) ) );
		}

		function getAngle(x1,y1,x2,y2) {
			var rad = Math.atan2(x2-x1, y1-y2);
			var deg = radiansToDegrees(rad);
			if (deg < 0) {
				deg += 360;
			}
			return deg;
		}

		function radiansToDegrees(radians) {
			return (radians * 180) / Math.PI;
		}

		function bind(event,callback) {
			callbacks[event] = callback;
		}

		function unbind(event) {
			callbacks[event] = false;
		}

		function dispatch(event,metadata) {
			if (callbacks.update) {
				callbacks.update(metadata);
			}
		}

		function updateFromPoint(x,y) {
			for(var i in c_edges) {
				var distance = 1 - (getDistance(c_edges[i][0],c_edges[i][1],x,y) / c_base_distances[i]);
				rose[i] = distance;
			}
			var meta = {
				rose : rose,
				angle : getAngle(c_middle[0],c_middle[1],x,y),
				magnitude : getDistance(c_middle[0],c_middle[1],x,y)
			};
			dispatch("update", meta);
			return meta;
		}

		$(container).on("mousemove", function(e) {
			var x = e.clientX;
			var y = e.clientY;
			updateFromPoint(x,y);
		});

		return {
			on : bind,
			off : unbind
		}

	}

	return windrose;

});
