    
    /**
     * It converts a number between two ranges of numbers
     *
     * @function   mapRange
     * @param from range of origin, e.g. [0,1024]
     * @param to   range of destination, e.g. [0,1024]
     * @param s    number to convert
     * @return     number converted
     */
    var mapRange = function(from, to, s) {
      return to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
    };
    
    /**
     * Coordinate of a tile.
     *
     * @class Coordinate
     * @constructor
     * @param x coordinate of the horizontal plane
     * @param y coordinate of the vertical plane
     *
     */
    var Coordinate = function(x,y){
      this.x = x || 0;
      this.y = y || 0;
    };

    /**
     * Pair of coordinate describing a Rectangular area of tiles.
     *
     * @class Rectangle
     * @constructor
     * @param a_x,a_y x,y coordinate of the left superior boundary point of this zone
     * @param b_x,b_y x,y coordinate of the right inferior boundary point of this zone
     */
    var Rectangle = function(a_x,a_y,b_x,b_y){
      this.a = new Coordinate( mapRange([0, 1024], [-1024, 1024], a_x), mapRange([0, 628], [-628, 628], a_y ))  || new Coordinate();
      this.b = new Coordinate( mapRange([0, 1024], [-1024, 1024], b_x), mapRange([0, 628], [-628, 628], b_y ))  || new Coordinate();
    };

    /**
     * Boundary of a rectangle.
     *
     * @class Boundary
     * @constructor
     * @param rect rectangle in form of boundary
     */
    var Boundary = function( rect ) {
      this.x = {min:rect.a.x,max:rect.b.x};
      this.y = {min:rect.a.y,max:rect.b.y};
      this.inside_here = function(pnt) {
        if( this.x.min <= pnt.x && this.x.max >= pnt.x && this.y.min <= pnt.y && this.y.max >= pnt.y ) {
          return true;
        }else{
          return false;
        }
      };
    };
    /**
     * Contains the description of the map
     *
     * @class Zone
     * @constructor
     */
    var Zone = function(type, rectangles) {
        this.type = type;
        this.rectangles = rectangles;
        this.boundaries = function() {
        var b = [];
        for (var r in this.rectangles) {
            b.push( new Boundary(this.rectangles[r]) );
        }
        return b;
        };
    };

    /**
     * Map of the area
     *
     * @function drawMap
     * @constructor
     * @param options.width
     * @param options.height
     * @param options.tile_size
     * @param options.scene  <required>
     */
    var drawMap = function(options) {
      var options = options || {};
      var width = options.width || 1024;
      var height = options.height || 628;
      var tile_size = options.tile_size || 32;
      var schema = options.schema || {};
      var scene = options.scene;
      var default_terrain = options.default_terrain || {};

      var zone_dictionary = [];
      var coordinates = [];
      var zone,type;

      var whichTile = function(coordinate){
        var mat = default_terrain;
        for(var s in schema.zones) {
          zone = schema.zones[s];
          var boundaries = zone.boundaries();
          for(var b in boundaries) {

            if(boundaries[b].inside_here(coordinate)) {
              return schema.materials[zone.type];
            }
          }
        }
        return schema.materials[default_terrain];
      };

      var points = new Array();
      var map = new THREE.Geometry();
      for( var i = -width/tile_size; i < width/tile_size; i++) {
          // if(i==-width/tile_size+1) break;
          for( var j = -height/tile_size; j < height/tile_size; j++) {
              square = new THREE.PlaneGeometry(tile_size,tile_size);
              tile = new THREE.Mesh(square);

              tile.leftSelectable = false;
              tile.movable = false;
              tile.rightSelectable = true;
              tile.overdraw = true;
              tile.position.x = i*tile_size+tile_size/2;
              tile.position.z = j*tile_size+tile_size/2;
              tile.material = whichTile(new Coordinate(i*tile_size+tile_size/2,j*tile_size+tile_size/2));
              tile.rotation.x = -Math.PI/2;

              points.push( { x: tile.position.x , z: tile.position.z } );
              scene.add(tile);
          }
      }
    };