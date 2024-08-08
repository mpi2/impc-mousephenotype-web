const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare()
.then(() => {
    createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            const { pathname, query} = parsedUrl;
            const host = req.headers.host;
            console.log({ host, pathname });
            res.setHeader('X-IMPC-TEST', "true");
            if (host.includes('nginx.mousephenotype-dev.org')) {
                const modifiedPathName = pathname.replace("/data/", "");
                console.log({ modifiedPathName });
                await app.render(req, res, modifiedPathName, query);
                res.setHeader('X-PATH', JSON.stringify({ host, pathname, modifiedPathName }));
            } else {
                await handle(req, res, parsedUrl);
            }

        } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('internal server error')
        }
    })
        .once('error', (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`Ready on http://${hostname}:${port}`);
        })
});