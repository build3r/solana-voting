use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};
use borsh::{BorshDeserialize, BorshSerialize, BorshSchema};
use std::mem;

/* 
Here is the plan
There will 3 account who will satand for election ,
They will submit the proposal with their name

the structure will have 
    public address of the account
    name of the account
    the amount of votes it got initially 0
    did it win the election

I will create the proposals manually the voting will be done by the contract

The user will select the proposal and vote for it the transaction will be signed and payed by the user
Once he votes a bool value voted will added to user account so that he can't vote again.
*/
#[derive(Clone, Debug, Default, PartialEq, BorshDeserialize, BorshSerialize, BorshSchema)]
pub struct Voter {
    pub vote_for: u8, // index of thr propsal the account is vooting for
    pub voted: bool,
    pub delagate: String, //If the account has delegated its vote

}
#[derive(Clone, Debug, Default, PartialEq, BorshDeserialize, BorshSerialize, BorshSchema)]
pub struct Proposal {
    pub id : u8,
    pub name : String,
    pub voteCount : u32,
}
#[derive(Clone, Debug, Default, BorshDeserialize, BorshSerialize, BorshSchema)]
pub struct Ballot {
    pub name: String,
    pub chairPerson : String,
    pub proposals: Vec<Proposal>,
    pub voters: HashMap<String, Voter>, //user public address of the voter to get if he has already voted
}

//This starts the elections
// Ballot -> n Proposals(hardcoded) -> n Voters
//Chair person = who started the ballot
fn create_ballot(name : &String, chairPersonKey: &String) -> bool {
    //Save proposal to Program chain
    let all_proposals = (0..3).map(|i| Proposal {
        id: i as u8,
        name: format!("Propsal {}", i).to_string(),
        voteCount: 0,
    }).collect();
    let mut ballot = Ballot {
        name: name.to_string(),
        chairPerson: chairPersonKey.to_string(),
        proposals: all_proposals,
        voters: HashMap::new(),
    };
    msg!!("Ballot created {:#?}", ballot);
    true
}

entrypoint!(process_instruction);
//This starts the elections
// Ballot -> n Proposals(hardcoded) -> n Voters
//Chair person = who started the ballot
fn create_ballot(name : &String, chairPersonKey: Pubkey) -> bool {
    //Save proposal to Program chain
    let all_proposals = (0..3).map(|i| Proposal {
        name: format("Propsal {}", i).to_string(),
        voteCount: 0,
    }).collect();
    let mut ballot = Ballot {
        name: name.to_string(),
        chairPerson: chairPersonKey,
        proposals: all_proposals,
        voters: HashMap::new(),
    };
    msg!("Ballot created {:#?}", ballot);
    true
}

fn process_instruction(
    program_id: &Pubkey,      // Public key of program account
    accounts: &[AccountInfo], // data accounts
    instruction_data: &[u8],  // 0 = create proposal, 1 = vote
) -> ProgramResult {
    msg!("Rust program entrypoint");
    
    // Iterating accounts is safer then indexing
    let accounts_iter = &mut accounts.iter();
    let (tag, rest) = input.split_first().ok_or(-1)?;
    ok(
        match tag {

        }
    )
    

    Ok(())
}

/* // tests
#[cfg(test)]
mod test {
    use super::*;
    use solana_program::clock::Epoch;

    #[test]
    fn test_sanity() {
        // mock program id

        let program_id = Pubkey::default();

        // mock accounts array...

        let key = Pubkey::default(); // anything
        let mut lamports = 0;

        let mut data = vec![0; 2 * mem::size_of::<u32>()];
        LittleEndian::write_u32(&mut data[0..4], 0); // set storage to zero
        LittleEndian::write_u32(&mut data[4..8], 0);

        let owner = Pubkey::default();

        let account = AccountInfo::new(
            &key,             // account pubkey
            false,            // is_signer
            true,             // is_writable
            &mut lamports,    // balance in lamports
            &mut data,        // storage
            &owner,           // owner pubkey
            false,            // is_executable
            Epoch::default(), // rent_epoch
        );

        let mut instruction_data: Vec<u8> = vec![0];

        let accounts = vec![account];

        assert_eq!(LittleEndian::read_u32(&accounts[0].data.borrow()[0..4]), 0);
        assert_eq!(LittleEndian::read_u32(&accounts[0].data.borrow()[4..8]), 0);

        // vote for candidate 1

        instruction_data[0] = 1;
        process_instruction(&program_id, &accounts, &instruction_data).unwrap();
        assert_eq!(LittleEndian::read_u32(&accounts[0].data.borrow()[0..4]), 1);
        assert_eq!(LittleEndian::read_u32(&accounts[0].data.borrow()[4..8]), 0);

        // vote for candidate 2

        instruction_data[0] = 2;
        process_instruction(&program_id, &accounts, &instruction_data).unwrap();
        assert_eq!(LittleEndian::read_u32(&accounts[0].data.borrow()[0..4]), 1);
        assert_eq!(LittleEndian::read_u32(&accounts[0].data.borrow()[4..8]), 1);
    }
}
 */