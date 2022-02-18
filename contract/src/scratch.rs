let mut voterData = VoterData::try_from_slice(instruction_data)?;
    msg!("VoterData: {:?}", voterData);
    msg!(
        "process_instruction: {}: {} accounts, data={:?}",
        program_id,
        accounts.len(),
        instruction_data
    );
    // Get the account that holds the vote count
    for i in 0..accounts.len() {
        let account_info = next_account_info(accounts_iter)?;
        let account_data = &account_info.data;
        let account_bal = &account_info.lamports;
        let account_owner = account_info.owner;
        let account_executable = account_info.executable;
        msg!(
            "account {}: data={:#?}, lamports={:?}, owner={}, executable={}",
            i,
            account_data,
            account_bal,
            account_owner,
            account_executable
        );
    }