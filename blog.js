//
// Static Blog Engine
//
const fs = require('fs-promise');
const path = require('path');
const glob = require('glob-promise');
const frontMatter = require('front-matter');
const marked = require('marked');
const moment = require('moment');
const theme = require('./theme');
const mkdir = require('mkdirp');
const pyg = require('pygmentize-bundled');

const createDirectory = dir => new Promise( (res, rej) => {
    mkdir(dir, err => {
        if( err )
            rej(err);
        else
            res(dir);
    });
});

marked.setOptions({
    highlight(code, lang, cb) {
        pyg({ lang, format: 'html' }, code, (err, res) => cb(err, res.toString()));
    }
})

const parse = md => {
    return new Promise( (res, rej) => {
        marked(md, (err, content) => err ? rej(err) : res(content) );
    });
};

// readFile
// readdir
const globOpt = {
    ignore: ['node_modules/**/*.md']
};

const now = () => moment().format('YYYY-MM-DD');

glob('_contents/**/*.md', globOpt)
    .then( files => files.map( rel => ({ path: rel }) ) )
    .then( files => Promise.all( files.map( def => fs.readFile(def.path).then( body => ({ body, path: def.path }) ) ) ) )
    .then( files => files.map( file => { file.body = file.body.toString(); return file; }))
    .then( files => files.map( file => Object.assign({}, file, { out: 'index.html' }) ) )
    .then( files => files.map( file => Object.assign({}, file, { dir: file.path.replace(/_contents\/(.*)\.md$/, '$1') }) ) )
    .then( files => files.map( file => Object.assign({}, file, frontMatter(file.body) ) ) )
    // .then( files => files.map( file => Object.assign({}, file, { body: marked(file.body) } )))
    .then( files => Promise.all( files.map(file => parse(file.body).then( md => Object.assign(file, {body: md})) )))
    .then( files => files.map( file => file.attributes.date ? file : Object.assign({ date: now() }, file) ) )
    .then( files => Promise.all(files.map( file => createDirectory( file.dir ).then( () => file, () => file ) )))
    .then( files => {
        // Write the index file
        const stats = files.map( file => Object.assign({}, file.attributes, { uri: file.dir, date: file.date }) );

        return fs.writeFile('./index.html', theme.index(stats) )
                .then( () => files );
    })
    .then( files => Promise.all( files.map( file => {
            return fs.writeFile( path.resolve(__dirname, file.dir, file.out), theme.post(file.body, file) );
        })))
    .then( () => console.log('Blogged.') )
    // .then( w => console.log(w) )
    .catch( err => console.error(err) );