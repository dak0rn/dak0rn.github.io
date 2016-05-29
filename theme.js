const head = (title) => `<!DOCTYPE html>
<html lang="en">
    <head>
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
        <div class="page-container">`;

const tail = () => `</div>
    </body>
</html>`;

module.exports = {

    index(posts) {
        return `${head('65535th')}
    <div id="page-content" class="content">
        <h1 id="page-title">65535th</h1>
        <ul id="post-list">
        ${
            posts.map( post => `<li class="post"><a href="${post.uri}">${post.title}</a></li>` ).join('')
        }
        </ul>
    </div>
${tail()}`;
    },

    post(content, meta) {
        return `${head(meta.attributes.title)}
<div id="post-content" class="content">${ content }</div>
${tail()}`;
    }

};