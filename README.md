# KU Key Generate (Backend)

This repository is a key generate server backend part of my senior project.

## Installation
```
git clone https://github.com/melpst/ku-keygenerate-backend.git
npm install
```

## Getting Started
Before you could run this project, you must config file `/credentials/mongolab.js` for using mlab first.
```
module.exports = {
	'url' : 'mongodb://<dbusername>:<dbpassword>@<dburl>'
}
```
Then, you can run this project by this command.
```
node app.js
```
After run this, you will see `listen in port 3000`


License
----

MIT
