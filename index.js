import {
    getConnection,
    getDefaultWallet,
    getProgramId,
    invokeProgram
  } from './setup.js';
  
  async function main() {
    console.log("Let's Invoke to a Solana program...");
  
    // Establish connection to the cluster
    await getConnection();
  
    // Determine who pays for the fees
    await getDefaultWallet();
  
    // Check if the program has been deployed
    await getProgramId();
  
    // Say hello to an account
    await invokeProgram();
  
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