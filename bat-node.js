const path = require("path");
const http = require("http");
const Web3 = require("web3");
const web3 = new Web3();

web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));

const Bat = web3.eth.contract([{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"newOwner","type":"address"}],"name":"transferDomain","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"domainName","type":"string"},{"name":"fileName","type":"string"},{"name":"compression","type":"uint8"},{"name":"mime","type":"uint8"},{"name":"data","type":"bytes"}],"name":"pushFile","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"collectFunds","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"domainName","type":"string"},{"name":"fileName","type":"string"}],"name":"getFile","outputs":[{"name":"compression","type":"uint8"},{"name":"mime","type":"uint8"},{"name":"data","type":"bytes"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"registerDomain","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[],"name":"shutdown","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_domainPrice","type":"uint256"}],"payable":false,"type":"constructor"}]);

const bat = Bat.at("0x50b24D79FfcDC154C48226c4604e517179488521");

const server = http.createServer((req, res) => {
	const split = req.url.split("/");
	const domain = split[1];
	const file = split.slice(2).join("/");

	try {
		process.stdout.write(`GET ${JSON.stringify(domain)} => ${JSON.stringify(file)}... `);

		if(domain.trim() == "" || domain.split(".").length > 1) {
			res.writeHead(404);
			res.end();
			process.stdout.write("not allowed\n");
			return;
		}

		const data = Buffer.from(bat.getFile(domain, file)[2].slice(2), "hex").toString();
		res.writeHead(200);
		res.end(data);

		process.stdout.write("success\n");
	} catch(err) {
		res.writeHead(404);
		process.stdout.write("fail\n");
	}
});

server.listen(8202);
