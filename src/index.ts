import { privateToAddress } from 'ethereumjs-util';
import randombytes from 'randombytes';

export const generate = (prefix: string, log: boolean) => {
	const logFn = log ? console.log : () => { };
	prefix = prefix.replace(/^0x/, '');
	if (prefix.length / 2 > 10 || !/^[0-9a-fA-F]+$/.test(prefix)) {
		throw new Error('Prefix must be hex & at most 10 characters');
	}
	let sk: Buffer = Buffer.alloc(32), addr: Buffer = Buffer.alloc(20), count = 0;
	logFn('Generating...');
	while (true) {
		sk = randombytes(32);
		addr = privateToAddress(sk);
		if (addr.toString('hex').startsWith(prefix)) break;
		if (++count % 100000 === 0) logFn(`${count} addresses tried...`);
	}
	
	logFn(`Private key: ${sk.toString('hex')}`);
	logFn(`Address: ${addr.toString('hex')}`);
	return {
		privateKey: sk.toString('hex'),
		address: addr.toString('hex'),
	}
}

// main function for cli
const main = () => {
	const prefix = process.argv[2];

	const { privateKey, address } = generate(prefix, true);
	
}
if (require.main === module) {
	main();
}
