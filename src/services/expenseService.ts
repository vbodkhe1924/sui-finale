import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '@mysten/sui.js/client';
import { Expense } from '../types';
import { SuiTransactionBlockResponse } from '@mysten/sui.js/client';

// Initialize Sui client
const suiClient = new SuiClient({ url: 'https://fullnode.testnet.sui.io' });

// Package configuration
const PACKAGE_ID = '0x5ecfe35245a833bdf3e11c7dce072e41a34d7b29dc2f0890fa89806922644586';
const MODULE_NAME = 'expense_splitter';

interface GroupCreatedEvent {
  id: string;
  name: string;
  admin: string;
}

interface RawExpense {
  type: string;
  fields: {
    id?: string;
    amount: string | number;
    description: string;
    merchant?: string;
    category?: string;
    date?: string;
    participants: string[];
  };
}

export const expenseService = {
  async getExpenseGroup() {
    try {
      // Query for the most recent group creation transaction
      const { data: txs } = await suiClient.queryTransactionBlocks({
        filter: {
          MoveFunction: {
            package: PACKAGE_ID,
            module: MODULE_NAME,
            function: 'create_group'
          }
        },
        options: {
          showEffects: true,
          showEvents: true,
        },
        limit: 1,
        order: 'descending'
      });

      if (!txs || txs.length === 0) {
        return null;
      }

      // Get the group ID from the event
      const latestTx = txs[0];
      const groupCreatedEvent = latestTx.events?.find(event => 
        event.type === `${PACKAGE_ID}::${MODULE_NAME}::GroupCreated`
      );

      if (groupCreatedEvent?.parsedJson) {
        const eventData = groupCreatedEvent.parsedJson as GroupCreatedEvent;
        return eventData.id;
      }

      return null;
    } catch (error) {
      console.error('Error getting expense group:', error);
      throw error;
    }
  },

  createInitGroupTransaction() {
    const tx = new TransactionBlock();
    console.log('Creating init group transaction with target:', `${PACKAGE_ID}::${MODULE_NAME}::create_group`);
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::create_group`,
      arguments: [
        tx.pure("Default Group"),
      ],
    });
    return tx;
  },

  async getCreatedObjectId(txResponse: SuiTransactionBlockResponse): Promise<string | null> {
    try {
      console.log('Transaction response:', JSON.stringify(txResponse, null, 2));
      console.log('Transaction status:', txResponse.effects?.status?.status);
      
      // Look for the created ExpenseGroup in objectChanges
      const expenseGroup = txResponse.objectChanges?.find(change => 
        change.type === 'created' && 
        change.objectType === `${PACKAGE_ID}::${MODULE_NAME}::ExpenseGroup`
      );

      console.log('Found ExpenseGroup:', expenseGroup);

      if (expenseGroup && 'objectId' in expenseGroup) {
        const objectId = expenseGroup.objectId;
        console.log('Found ExpenseGroup ID:', objectId);
        
        // Verify the object exists
        const { data } = await suiClient.getObject({
          id: objectId,
          options: {
            showType: true,
          }
        });
        
        console.log('Object data:', data);
        console.log('Object type:', data?.type);
        
        if (data && data.type?.includes(`${PACKAGE_ID}::${MODULE_NAME}::ExpenseGroup`)) {
          console.log('Successfully verified ExpenseGroup object');
          return objectId;
        } else {
          console.log('Object is not an ExpenseGroup');
        }
      } else {
        console.log('No ExpenseGroup object found in transaction response');
      }
      return null;
    } catch (error) {
      console.error('Error getting created object:', error);
      return null;
    }
  },

  async getParticipantBalances(groupId: string): Promise<Array<{ address: string; balance: number; expenses: Expense[] }>> {
    try {
      console.log('Getting participant balances for group:', groupId);

      // Get the expense group object
      const { data } = await suiClient.getObject({
        id: groupId,
        options: {
          showContent: true,
          showType: true,
        }
      });

      // Extract content from the object
      const content = data?.content as any;
      if (!content?.fields) {
        console.log('No content fields found in group object');
        return [];
      }

      console.log('Group content:', JSON.stringify(content, null, 2));

      // Get raw expenses
      const rawExpenses = content.fields.expenses || [];
      console.log('Found raw expenses:', rawExpenses);

      // Convert raw expenses to Expense objects
      const expenseDetails = rawExpenses.map((rawExpense: RawExpense) => {
        try {
          // Validate the expense object
          if (!rawExpense || !rawExpense.fields || !rawExpense.type?.includes(`${PACKAGE_ID}::${MODULE_NAME}::Expense`)) {
            console.error('Invalid expense format:', rawExpense);
            return null;
          }

          const { fields } = rawExpense;

          // Validate required fields
          if (!fields.amount || !fields.description || !Array.isArray(fields.participants)) {
            console.error('Missing required fields in expense:', fields);
            return null;
          }

          const expense: Expense = {
            id: fields.id || rawExpense.type,
            amount: Number(fields.amount) / 1e9,
            description: String(fields.description),
            merchant: String(fields.merchant || ''),
            category: String(fields.category || ''),
            date: String(fields.date || new Date().toISOString()),
            participants: fields.participants,
            payer: fields.payer,
            settled: fields.settled || false,
          };

          return expense;
        } catch (error) {
          console.error('Error processing expense:', error);
          return null;
        }
      });

      // Filter out null expenses
      const validExpenses = expenseDetails.filter((expense: unknown): expense is Expense => expense !== null);
      console.log('Valid expenses:', validExpenses);

      // Collect all unique participants
      const uniqueParticipants = new Set<string>();
      validExpenses.forEach((expense: Expense) => {
        expense.participants.forEach((participant: string) => {
          uniqueParticipants.add(participant);
        });
        if (expense.payer) {
          uniqueParticipants.add(expense.payer);
        }
      });

      console.log('Unique participants:', Array.from(uniqueParticipants));

      // Calculate balances for each participant
      const result = Array.from(uniqueParticipants).map(address => {
        // Get all expenses this participant is involved in
        const participantExpenses = validExpenses.filter((expense: Expense) => 
          expense.participants.includes(address) || expense.payer === address
        );

        // Calculate balance
        let balance = 0;
        participantExpenses.forEach(expense => {
          if (expense.payer === address) {
            // If they paid, they get credit for the expense amount divided by number of participants
            balance += expense.amount * ((expense.participants.length - 1) / expense.participants.length);
          } else {
            // If they're just a participant, they owe their share
            balance -= expense.amount / expense.participants.length;
          }
        });

        console.log(`Calculated balance for ${address}:`, balance);

        return {
          address,
          balance,
          expenses: participantExpenses,
        };
      });

      console.log('Final result:', result);
      return result;
    } catch (error) {
      console.error('Error getting participant balances:', error);
      throw error;
    }
  },

  createExpenseTransaction(expense: Omit<Expense, 'id'>, groupId: string) {
    const tx = new TransactionBlock();
    const amountInMist = Math.floor(expense.amount * 1e9);
    
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::create_expense`,
      arguments: [
        tx.object(groupId),
        tx.pure(expense.description),
        tx.pure(amountInMist),
        tx.pure(expense.participants),
      ],
    });
    return tx;
  },

  createSettleExpenseTransaction(participantId: string, amount: number) {
    const tx = new TransactionBlock();
    const amountInMist = Math.floor(amount * 1e9); // Convert to MIST
    
    // Create a coin for settlement
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(amountInMist)]);
    
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::settle_expense`,
      arguments: [
        tx.object(participantId), // The participant's address
        coin, // The coin object for settlement
      ],
    });
    return tx;
  },

  createAddParticipantTransaction(expenseId: string, participantAddress: string) {
    const tx = new TransactionBlock();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::add_participant`,
      arguments: [
        tx.pure(expenseId),
        tx.pure(participantAddress),
      ],
    });
    return tx;
  },

  async getExpenses(walletAddress: string) {
    try {
      const { data: objects } = await suiClient.getOwnedObjects({
        owner: walletAddress,
        filter: {
          StructType: `${PACKAGE_ID}::${MODULE_NAME}::Expense`
        },
        options: {
          showContent: true,
          showType: true,
        }
      });

      return objects.map(obj => {
        const content = obj.data?.content as any;
        return {
          id: obj.data?.objectId || '',
          amount: Number(content?.fields?.amount || 0) / 1e9,
          description: content?.fields?.description || '',
          merchant: content?.fields?.merchant || '',
          category: content?.fields?.category || '',
          date: content?.fields?.date || '',
          participants: content?.fields?.participants || [],
        };
      });
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },
}; 