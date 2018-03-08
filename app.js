const express = require('express');
const app = express();

const indexRoutes = require('./routes/index');

const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use('/', indexRoutes);

app.listen(PORT, process.env.IP, function() {
    console.log(`Voting App server started on port ${PORT}`);
});