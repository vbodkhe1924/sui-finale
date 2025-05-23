module suisplit::expense_splitter {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::event;
    use sui::table::{Self, Table};
    use std::string::{Self, String};
    use std::vector;

    // Error codes
    const ENotAdmin: u64 = 0;
    const EUserAlreadyExists: u64 = 1;
    const EUserNotFound: u64 = 2;
    #[allow(unused_const)]
    const EInsufficientBalance: u64 = 3;
    #[allow(unused_const)]
    const ENotAuthorized: u64 = 4;
    const EExpenseNotFound: u64 = 5;

    // Group expense manager object that keeps track of all expenses and balances
    struct ExpenseGroup has key {
        id: UID,
        admin: address,
        name: String,
        members: vector<address>,
        balances: Table<address, Balance<SUI>>,
        expenses: vector<Expense>,
        next_expense_id: u64,
    }

    // Expense struct to track each expense
    struct Expense has store {
        id: u64,
        description: String,
        amount: u64,
        payer: address,
        participants: vector<address>,
        timestamp: u64,
        settled: bool,
    }

    // Events
    struct GroupCreated has copy, drop {
        id: ID,
        admin: address,
        name: String,
    }

    struct MemberAdded has copy, drop {
        group_id: ID,
        member: address,
    }

    struct ExpenseCreated has copy, drop {
        group_id: ID,
        expense_id: u64,
        payer: address,
        amount: u64,
        description: String,
    }

    struct DebtSettled has copy, drop {
        group_id: ID,
        from: address,
        to: address,
        amount: u64,
    }

    // === Functions ===

    // Create a new expense group
    public entry fun create_group(name: vector<u8>, ctx: &mut TxContext) {
        let group = ExpenseGroup {
            id: object::new(ctx),
            admin: tx_context::sender(ctx),
            name: string::utf8(name),
            members: vector::empty(),
            balances: table::new(ctx),
            expenses: vector::empty(),
            next_expense_id: 0,
        };

        // Add the creator as the first member
        let sender = tx_context::sender(ctx);
        vector::push_back(&mut group.members, sender);
        table::add(&mut group.balances, sender, balance::zero<SUI>());

        event::emit(GroupCreated {
            id: object::uid_to_inner(&group.id),
            admin: sender,
            name: string::utf8(name),
        });

        transfer::share_object(group);
    }

    // Add a member to the group
    public entry fun add_member(group: &mut ExpenseGroup, member: address, ctx: &TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(sender == group.admin, ENotAdmin);
        assert!(!vector::contains(&group.members, &member), EUserAlreadyExists);

        vector::push_back(&mut group.members, member);
        table::add(&mut group.balances, member, balance::zero<SUI>());

        event::emit(MemberAdded {
            group_id: object::uid_to_inner(&group.id),
            member,
        });
    }

    // Create a new expense - equal split among participants
    public entry fun create_expense(
        group: &mut ExpenseGroup,
        description: vector<u8>,
        amount: u64,
        participants: vector<address>,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(vector::contains(&group.members, &sender), EUserNotFound);

        // Create the expense
        let expense_id = group.next_expense_id;
        let expense_description = string::utf8(description);
        
        let expense = Expense {
            id: expense_id,
            description: expense_description,
            amount,
            payer: sender,
            participants,
            timestamp: tx_context::epoch(ctx),
            settled: false,
        };

        // Increment the expense ID counter
        group.next_expense_id = group.next_expense_id + 1;

        // Calculate equal split
        let participant_count = vector::length(&participants);
        assert!(participant_count > 0, EUserNotFound);
        let _share_amount = amount / (participant_count as u64);

        // Update balances - payer is owed money by others
        let i = 0;
        while (i < participant_count) {
            let participant = *vector::borrow(&participants, i);
            if (participant != sender) {
                // Participant owes the payer
                if (table::contains(&group.balances, participant)) {
                    let participant_balance = table::borrow_mut(&mut group.balances, participant);
                    balance::join(participant_balance, balance::zero<SUI>());
                    // In a real implementation, we would add to the payer's balance and subtract from the participant's
                };
            };
            i = i + 1;
        };

        // Store the expense
        vector::push_back(&mut group.expenses, expense);

        // Emit expense created event
        event::emit(ExpenseCreated {
            group_id: object::uid_to_inner(&group.id),
            expense_id,
            payer: sender,
            amount,
            description: string::utf8(description),
        });
    }

    // Settle a debt by paying another member
    public entry fun settle_debt(
        group: &mut ExpenseGroup,
        to: address,
        payment: Coin<SUI>,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(vector::contains(&group.members, &sender), EUserNotFound);
        assert!(vector::contains(&group.members, &to), EUserNotFound);

        let amount = coin::value(&payment);
        
        // Transfer the payment to the recipient
        transfer::public_transfer(payment, to);

        // Update balances
        // In a production app, we would add a proper debt tracking mechanism
        
        event::emit(DebtSettled {
            group_id: object::uid_to_inner(&group.id),
            from: sender,
            to,
            amount,
        });
    }

    // Get expense details
    public fun get_expense_details(
        group: &ExpenseGroup,
        expense_id: u64
    ): (String, u64, address, vector<address>) {
        let i = 0;
        let expenses_length = vector::length(&group.expenses);
        
        while (i < expenses_length) {
            let expense = vector::borrow(&group.expenses, i);
            if (expense.id == expense_id) {
                return (
                    expense.description,
                    expense.amount,
                    expense.payer,
                    expense.participants
                )
            };
            i = i + 1;
        };
        
        abort EExpenseNotFound
    }

    // Check if a user is a member of the group
    public fun is_member(group: &ExpenseGroup, user: address): bool {
        vector::contains(&group.members, &user)
    }

    // Get all expenses
    public fun get_all_expenses(group: &ExpenseGroup): &vector<Expense> {
        &group.expenses
    }
} 