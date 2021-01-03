// server.js
const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, 'public');
const port = process.env.PORT || 8080;

// Run the app by serving the static files in the public directory
app.use(express.static(publicPath)); 
// Make sure your index.html file is served, in case the user requests a resource currently not in the public folder
app.get('/*', (req, res) => {
   res.sendFile(path.join(publicPath, 'index.html'));
});
// Start the app by listening on the default Heroku port
// app.listen(port);
app.listen(port);

