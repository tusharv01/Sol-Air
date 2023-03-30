import {
  Account,
  clusterApiUrl,
  Connection,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';


// Create connection
function createConnection(url = clusterApiUrl('devnet')) {
  return new Connection(url);
}

const connection = createConnection();


// Generate account
import * as bip39 from 'bip39';
import nacl from 'tweetnacl';

function generateAccount(mnemonic) {
  const seed = bip39.mnemonicToSeedSync(mnemonic); // prefer async mnemonicToSeed
  const keyPair = nacl.sign.keyPair.fromSeed(seed.slice(0, 32));
  return new Account(keyPair.secretKey);
}

const mnemonic = bip39.generateMnemonic();
console.log('Your password:', mnemonic);

const account = generateAccount(mnemonic);
console.log('Account:', account);

// Get balance
function getBalance(connection, publicKey) {
  return connection.getBalance(publicKey);
}

const balance = getBalance(connection, account.publicKey);
console.log('Balance:', balance);

// Airdrop request
// lamports is 0.000000001 of SOL
function requestAirdrop(connection, publicKey, lamports = 1000000) {
  return connection.requestAirdrop(publicKey, lamports);
}

requestAirdrop(connection, account.publicKey);

// Send transaction
async function sendTransaction(connection, recipientPublicKey, recipientAmount, payer) {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: new PublicKey(recipientPublicKey),
      lamports: recipientAmount,
    }),
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);

  return signature;
}

// sendTransaction(connection, someaccount.publicKey, 1000, account);

// Get history
// https://solana-labs.github.io/solana-web3.js/class/src/connection.js~Connection.html#instance-method-getConfirmedSignaturesForAddress
function getHistory(connection, publicKey, options = { limit: 20 }) {
  return connection.getConfirmedSignaturesForAddress2(publicKey, options);
}

const history = getHistory(connection, account.publicKey);
console.log('Signatures:', history);

// exporting from a bs58 private key to an Uint8Array
// == from phantom private key to solana cli id.json key file
// npm install bs58 @solana/web3.js

const web3 = require("@solana/web3.js");
const bs58 = require('bs58');
let secretKey = bs58.decode("[base58 private key here]");
console.log(`[${web3.Keypair.fromSecretKey(secretKey).secretKey}]`);

// exporting back from Uint8Array to bs58 private key
// == from solana cli id.json key file to phantom private key

const bs58 = require('bs58');
privkey = new Uint8Array([111, 43, 24, ...]); // content of id.json here
console.log(bs58.encode(privkey));