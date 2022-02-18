import {
    getConnection,
    getDefaultWallet,
    getProgramId,
    invokeProgram,
    createBallot
  } from './setup.js';
  import * as borsh from "borsh";
  async function main() {
    console.log("Let's Invoke to a Solana program...");
  
    // Establish connection to the cluster
    await getConnection();
  
    // Determine who pays for the fees
    await getDefaultWallet();
  
    // Check if the program has been deployed
    await getProgramId();
  
    // Say hello to an account
    //await invokeProgram();
    await createBallot("Presidential Election 2022");
  
    // Find out how many times that account has been greeted
    //await reportGreetings();
  
    console.log('Success');
  } 
  
  main().then(
    () => process.exit(),
    err => {
      console.error(err);
      process.exit(-1);
    },
  );

/* 
  const ser = borsh.serialize(StringStructSchema , data);
  const sdata = [1, ...ser]; //1 = create ballot
  console.log("Ser Data  = ", sdata);
  const ds = borsh.deserialize(StringStructSchema, StringStruct, ser);
  console.log("Deser Data  = ", ds); */