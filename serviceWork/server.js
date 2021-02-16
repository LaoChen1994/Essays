const express = require('express')
const path = require('path')
const nunjucks = require('nunjucks')

const app = new express()

app.set('view engine','njk'); 
app.set('views',path.resolve(__dirname,'./views'));

nunjucks.configure('views',{autoescape:true,express:app});
app.use('/static', express.static(path.resolve(__dirname, './static')))

app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/static/query', (req, res) => {
    console.log('123')
    res.send({
        list: [1, 2, 3], 
        status: true,
        msg: 'success'
    })
})

app.listen(3000, () => {
    console.log('server is on 3000')
})