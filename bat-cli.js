const fs = require("fs");
const zlib = require("zlib");
const argv = require("yargs").argv;
const Web3 = require("web3");
const web3 = new Web3();

web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));

const Bat = web3.eth.contract([{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"newOwner","type":"address"}],"name":"transferDomain","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"domainName","type":"string"},{"name":"fileName","type":"string"},{"name":"compression","type":"uint8"},{"name":"mime","type":"uint8"},{"name":"data","type":"bytes"}],"name":"pushFile","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"collectFunds","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"domainName","type":"string"},{"name":"fileName","type":"string"}],"name":"getFile","outputs":[{"name":"compression","type":"uint8"},{"name":"mime","type":"uint8"},{"name":"data","type":"bytes"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"registerDomain","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[],"name":"shutdown","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_domainPrice","type":"uint256"}],"payable":false,"type":"constructor"}]);

const bat = Bat.at("0x50b24D79FfcDC154C48226c4604e517179488521");

if(argv.pushFile) {
	const data = fs.readFileSync(argv.in);

	console.log(`Read ${JSON.stringify(argv.in)}, ${data.length} bytes.`);

	let str = data.toString();

	if(argv.minify) {
		[
			"\t",
			"  ",
			"    ",
			"\n"
		].forEach(a => str = str.replace(new RegExp(a, "g"), ""));
	}
	
	const compressed = zlib.deflateSync(Buffer.from(str));
	console.log(`${compressed.length} after DEFLATE compression.`);
}
