import Fastify from "fastify";
import proxy from "@fastify/http-proxy";
import fastifyStatic from "@fastify/static";
import * as path from "path";
import * as fs from "fs";
import { createConnectTransport } from "@connectrpc/connect-node";
import { getClientForLoginService } from "@kernelminds/scailo-sdk";

const upstreamAPI = process.env.upstreamAPI || "";
const port = parseInt(process.env.port || "0");
const username = process.env.username || "";
const password = process.env.password || "";

if (upstreamAPI == undefined || upstreamAPI == null || upstreamAPI == "") {
    console.log("upstreamAPI not set");
    process.exit(1);
}

if (port == undefined || port == null || port == 0) {
    console.log("port not set");
    process.exit(1);
}

if (username == undefined || username == null || username == "") {
    console.log("username not set");
    process.exit(1);
}

if (password == undefined || password == null || password == "") {
    console.log("password not set");
    process.exit(1);
}

const transport = getTransport(upstreamAPI);
const server = Fastify({ logger: true, trustProxy: true });
const loginClient = getClientForLoginService(transport);

let authToken = "";
let production = false;

export function getTransport(apiEndPoint: string) {
    return createConnectTransport({
        baseUrl: apiEndPoint, httpVersion: "1.1", useBinaryFormat: false, interceptors: [
            // appendAuthToken
        ]
    });
}



async function loginToAPI() {
    loginClient.loginAsEmployeePrimary({ username: username, plainTextPassword: password }).then(response => {
        authToken = response.authToken;
        console.log("Logged in with auth token: " + authToken);
    });

    setTimeout(() => {
        loginToAPI();
    }, 3600 * 1000);
}

// ------------------------------------------------------------------------------------------
// Register static routes here
server.register(require('fastify-favicon'), { path: './resources/dist/img', name: 'favicon.ico', maxAge: 3600 })
// Setup static handler for web/
server.register(fastifyStatic, {
    root: path.join(process.cwd(), 'resources', 'dist'),
    prefix: './resources/dist', // optional: default '/'
    decorateReply: false,
    constraints: {} // optional: default {}
});

let indexPage = fs.readFileSync(path.join(process.cwd(), 'index.html'), { encoding: 'utf-8' });
server.get("/", async (request, reply) => {
    if (!production) {
        indexPage = fs.readFileSync(path.join(process.cwd(), 'index.html'), { encoding: 'utf-8' });
    }
    reply.header("Content-Type", "text/html");
    reply.send(replaceBundleCaches(indexPage));
});

function replaceBundleCaches(page: string) {
    const version = new Date().toISOString();
    page = page.replace(`<link rel="preload" as="script" href="./resources/dist/js/bundle.src.min.js">`, `<link rel="preload" as="script" href="./resources/dist/js/bundle.src.min.js?v=${version}">`)
    page = page.replace(`<script src="./resources/dist/js/bundle.src.min.js"></script>`, `<script src="./resources/dist/js/bundle.src.min.js?v=${version}"></script>`)
    page = page.replace(`<link rel="stylesheet" href="./resources/dist/css/bundle.css">`, `<link rel="stylesheet" href="./resources/dist/css/bundle.css?v=${version}">`)
    return page
}

// ------------------------------------------------------------------------------------------

server.post("/csrf", async (request, reply) => {
    try {
        // Create a new request to /csrf endpoint
        let res = await fetch(upstreamAPI + "/csrf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Request-ID": crypto.randomUUID(),
                "auth_token": authToken
            },
            body: JSON.stringify(request.body)
        });
        let data = await res.json();
        reply.send(data);
    } catch (e) {
        reply.code(500).send(e);
    }
});

// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
// Register the proxy here
server.register(proxy, {
    upstream: upstreamAPI,
    // prefix: '/Scailo',
    httpMethods: ["POST"],
    preValidation: async (request, reply) => {
        try {
            request.headers['X-Request-ID'] = crypto.randomUUID();
            request.headers['auth_token'] = authToken
            request.headers['is_proxied'] = "true";
        } catch (e) {
            reply.code(500).send(e);
        }
    },
    replyOptions: {
        onResponse(request, reply, res) {
            reply.header("X-Response-ID", crypto.randomUUID());
            reply.send(res);
        },
    }
})

server.setNotFoundHandler((request, reply) => {
    reply.redirect("/");
})
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
console.log(`Listening on port ${port} with Production: ${production}`);
loginToAPI();
server.listen({ port: port, host: '0.0.0.0' });
