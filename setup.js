import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as borsh from "borsh";
let connection;
let defaultWallet;
let programWallet;
let programId;
export async function getConnection() {
  connection = new Connection("http://127.0.0.1:8899", "confirmed");
  //For checking whether the connection is successfully made
  console.log(connection.getSlot());
}
export async function getDefaultWallet() {
  defaultWallet = Keypair.fromSecretKey(
    Uint8Array.from([
      173, 212, 194, 66, 241, 46, 249, 59, 115, 78, 97, 188, 226, 86, 130, 221,
      21, 129, 183, 137, 226, 117, 148, 90, 198, 243, 82, 29, 61, 155, 115, 92,
      248, 98, 190, 139, 6, 18, 87, 4, 190, 82, 2, 126, 32, 250, 51, 170, 61,
      252, 41, 102, 48, 9, 76, 79, 39, 60, 228, 15, 90, 153, 193, 135,
    ])
  );
}
export async function getProgramId() {
  programWallet = Keypair.fromSecretKey(
    Uint8Array.from([
      25, 150, 223, 234, 168, 5, 79, 211, 66, 248, 120, 169, 175, 2, 236, 237,
      24, 150, 136, 45, 241, 212, 80, 232, 108, 69, 20, 200, 210, 42, 42, 96,
      127, 217, 168, 146, 172, 96, 141, 199, 37, 211, 212, 41, 222, 101, 173,
      150, 224, 152, 172, 31, 212, 143, 28, 64, 120, 203, 165, 240, 232, 182,
      103, 108,
    ])
  );
  programId = programWallet.publicKey;
}
class VoterData {
  publicKey = "";
  vote = 0;
  constructor(fields) {
    console.log(fields);
    if (fields) {
      this.publicKey = fields.publickey;
      this.vote = fields.vote;
    }
  }
}
class StringStruct {
  data = "";
  constructor(fields) {
    console.log(fields);
    if (fields) {
      this.data = fields.data;
    }
  }
}
const StringStructSchema = new Map([
  [
    StringStruct,
    {
      kind: "struct",
      fields: [
        ["data", "String"],
      ],
    },
  ],
]);
const VoterSchema = new Map([
  [
    VoterData,
    {
      kind: "struct",
      fields: [
        ["publicKey", "String"],
        ["vote", "u8"],
      ],
    },
  ],
]);

export async function invokeProgram() {
  console.log("Saying hello to", programId);
  const v = new VoterData({
    publickey: defaultWallet.publicKey.toString(),
    vote: 3,
  });
  console.log("VoterData = ", v);
  const ser = borsh.serialize(VoterSchema, v);
  console.log("ser = ", ser);
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: defaultWallet.publicKey, isSigner: false, isWritable: true },
    ],
    programId,
    data: Buffer.from(borsh.serialize(VoterSchema, v)),
  });
  let sig = await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [defaultWallet]
  );
  console.log("confirmation sig:", sig);
}
export async function getKeyForBallot() {
    return Keypair.generate();
}
export async function createBallot(ballotName) {
  console.log("Craeting ballot using ", programId, " name ", ballotName);
  const strucData = new StringStruct({data: ballotName});
  const ser = borsh.serialize(StringStructSchema, strucData);
  
  const data = [1, ...ser]; //1 = create ballot
  console.log("Data  = ", data);
  const ballotKey = await getKeyForBallot();

  console.log("Ballot Ptivate Key = ", ballotKey.secretKey.toString());
  console.log('Caller =', defaultWallet.publicKey.toString());
  console.log('ballotKey =', ballotKey.publicKey.toString());
 // const sysProg = new PublicKey.from("11111111111111111111111111111111");
  console.log('SystemProgram.progId =', SystemProgram.programId.toString());
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: defaultWallet.publicKey, isSigner: false, isWritable: true },
      { pubkey: ballotKey.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isWritable: false },
    ],
    programId,
    data: Buffer.from(data),
  });
  let sig = await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [defaultWallet, ballotKey]
  );
  console.log("confirmation sig:", sig);
}
