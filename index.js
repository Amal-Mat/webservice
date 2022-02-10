const express = require('express');
const router = require('./routes/router.js');

const app = express();

app.use("/",router);

const port = process.env.PORT || 3000;
/* app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
}); */

/* if(!module.parent){
    app.listen(3000);
} */

module.exports = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});;
