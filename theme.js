const moment = require('moment');
const removeIndexHtml = str => str.replace(/\/index\.html$/i, '/');
const _d = date => moment(date).format('YYYY-MM-DD');

const head = (title, baseUrl, pageTitle) => `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>${ pageTitle ? pageTitle + ' - ' : '' }${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="${baseUrl}/rmwf/webfont.css" />
        <link rel="stylesheet" href="${baseUrl}/lib.css" />
    </head>
    <body><main>`;

const tail = () => `</article></main>
<footer><a href="http://vimgifs.com/" target="_blank">:wq</a></footer>
</body></html>`;

const pageHeader = (files, uri, baseUrl, date, pageTitle) => `<article>
    <nav>
        <div>@see <a href="${baseUrl}/">Home</a> ${ files.filter( file => !! file.meta.static )
            .map( file => `<a href="${removeIndexHtml(file.uri)}">${file.meta.title}</a>` )
            .join('') }</div>
        <div></div>
        <div>@page <a href="${uri}">${uri}</a></div>
        <div>@date ${ _d(date) }</div>
        ${ pageTitle ? `<div>@title ${pageTitle}</div>` : '' }
    </nav><article>`;

module.exports = {

    index(files, config) {

        const leFilets = files.filter( file => ! file.meta.static )
                    .sort( ({meta: {date: dateA}}, {meta: {date: dateB}}) => dateB - dateA)
                   .map( file => `<li><a href="${ removeIndexHtml(file.uri) }">- ${ file.meta.title } (${ _d(file.meta.date) }) </a></li>` )
                   .join('');

        return `${ head(config.title, config.baseUrl) }
                ${ pageHeader(files, '/', config.baseUrl) }
                <ul id="main">${ leFilets }</ul>
        ${tail()}`;
    },

    post(contents, meta, config, file, files) {
        return `${ head(config.title, config.baseUrl, meta.title) }
                ${ pageHeader(files, removeIndexHtml(file.uri), config.baseUrl, meta.date, meta.title) }
                ${ contents }
            </div>
        ${tail()}`;
    },

    page() {
        return this.post.apply(this, arguments);
    }

};
