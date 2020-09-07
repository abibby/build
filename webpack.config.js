//@ts-check

const { build } = require('./dist')
const { join } = require('path')

module.exports = build({
    entry: join(__dirname, 'test/src/app.ts'),
    html: join(__dirname, 'test/src/index.html'),
    moduleBase: join(__dirname, 'test'),
    dist: join(__dirname, 'test/dist'),
    publicPath: '/',
})
