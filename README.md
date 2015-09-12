# x3dmongo
X3D JSON files loaded into Mongo and displayed on web

Requirements:
* mongodb
* express
* findit
    
To install
```
npm install
```

To load database, unpack a zip from http://www.web3d.org/x3d/content/examples/X3dResources.html#examples or http://x3dgraphics.com/examples/X3dForWebAuthors/ , edit config.js to point to location of unpacked folders (www.web3d.org/x3d/content/examples is good), then

```
npm run load
```

To run web server,

```
npm run start
```

Then go to localhost:3000
