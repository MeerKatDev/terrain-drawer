terrain-drawer
============

A js toolkit to draw maps from textures to be used with Three.js. 

Example of usage:

```javascript
  var basic_schema = { // this is the format for the map
            zones: [
                new MAP.Zone('water', [
                    new MAP.Rectangle(200,200,512,400),
                    new MAP.Rectangle(700,0,1024,314)
                ]),
                new MAP.Zone('grass', [
                    new MAP.Rectangle(200,0,700,200),
                    new MAP.Rectangle(200,400,700,628)
                ]),
                new MAP.Zone('earth', [
                    new MAP.Rectangle( 0,0,200,628),
                    new MAP.Rectangle(512,200,700,428),
                    new MAP.Rectangle(512,314,1024,628)
                ])
            ],
            materials: {
                'grass': new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('textures/tex32-grass.jpg') }),
                'earth': new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('textures/tex32-earth.jpg') }),
                'water': new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('textures/tex32-water.jpg') })
            }
        };

        MAP.drawMap({
            scene: scene, // THREE.Scene
            width: 1024, // ..of the map
            height: 628, // ..of the map
            tile_size: 32, // 16 or 32 preferably
            schema: basic_schema,
            default_terrain: 'water'
        });
```

terrain.js is the version in CommonJS as a module for Require.js

Dependencies:
Three.js r58

component of the Magellano rts project
