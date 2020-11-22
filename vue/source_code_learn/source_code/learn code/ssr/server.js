const App = {
    template: `
        <div>
            <div class="container" v-for="n in 1000">
                <ul>
                    <li>123</li>
                    <li>123</li>
                    <li>123</li>
                    <li v-for="todo in todos">
                        {{ n }} ---> {{todo}}
                    </li>
                </ul>
            </div>
        </div>
    `,
    data(){
        return {
            todos: ['吃饭', '睡觉']
        }
    }
}

const express = require('express')
const app = express()
const vue = require('vue')
const renderer = require('vue-server-renderer')
const vue2Compiler = require('vue-template-compiler')

app.get('/', (req, res) => {
    let vapp = new Vue(App)

    let html = await renderer.renderString(vapp)
    res.send(`<h1>Vue 2 ssr</h1>${html}`)
})

app.listen(9092, () => {
    console.log("9092")
})
