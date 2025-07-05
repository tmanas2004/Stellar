#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, Map, Symbol,
};

#[derive(Clone)]
#[contracttype]
pub struct Investment {
    pub investor: Address,
    pub amount: i128,
    pub timestamp: u64,
    pub interest_earned: i128,
    pub is_withdrawn: bool,
}

#[derive(Clone)]
#[contracttype]
pub struct PoolInfo {
    pub project_id: u64,
    pub creator: Address,
    pub funding_goal: i128,
    pub interest_rate: u32,
    pub loan_term: u64,
    pub total_invested: i128,
    pub is_funded: bool,
    pub maturity_date: u64,
}

const POOL_INFO: Symbol = symbol_short!("POOL_INFO");
const INVESTMENTS: Symbol = symbol_short!("INVESTS");
const INVESTOR_COUNT: Symbol = symbol_short!("INV_CNT");

#[contract]
pub struct LendingPool;

#[contractimpl]
impl LendingPool {
    pub fn initialize(
        env: Env,
        project_id: u64,
        creator: Address,
        funding_goal: i128,
        interest_rate: u32,
        loan_term: u64,
    ) {
        creator.require_auth();

        let pool_info = PoolInfo {
            project_id,
            creator,
            funding_goal,
            interest_rate,
            loan_term,
            total_invested: 0,
            is_funded: false,
            maturity_date: env.ledger().timestamp() + loan_term,
        };

        env.storage().instance().set(&POOL_INFO, &pool_info);
        env.storage().instance().set(&INVESTOR_COUNT, &0u64);
    }

    pub fn invest(env: Env, investor: Address, amount: i128) -> bool {
        investor.require_auth();

        let mut pool_info: PoolInfo = env.storage().instance().get(&POOL_INFO).unwrap();
        
        // Check if pool is still accepting investments
        if pool_info.is_funded || pool_info.total_invested + amount > pool_info.funding_goal {
            return false;
        }

        // Create investment record
        let investment = Investment {
            investor: investor.clone(),
            amount,
            timestamp: env.ledger().timestamp(),
            interest_earned: 0,
            is_withdrawn: false,
        };

        let mut investments: Map<Address, Investment> = env
            .storage()
            .persistent()
            .get(&INVESTMENTS)
            .unwrap_or(Map::new(&env));

        // Update existing investment or create new one
        if let Some(mut existing) = investments.get(investor.clone()) {
            existing.amount += amount;
            investments.set(investor.clone(), existing);
        } else {
            investments.set(investor.clone(), investment);
            let investor_count: u64 = env.storage().instance().get(&INVESTOR_COUNT).unwrap_or(0);
            env.storage().instance().set(&INVESTOR_COUNT, &(investor_count + 1));
        }

        env.storage().persistent().set(&INVESTMENTS, &investments);

        // Update pool info
        pool_info.total_invested += amount;
        if pool_info.total_invested >= pool_info.funding_goal {
            pool_info.is_funded = true;
        }
        env.storage().instance().set(&POOL_INFO, &pool_info);

        true
    }

    pub fn calculate_returns(env: Env, investor: Address) -> i128 {
        let pool_info: PoolInfo = env.storage().instance().get(&POOL_INFO).unwrap();
        let investments: Map<Address, Investment> = env
            .storage()
            .persistent()
            .get(&INVESTMENTS)
            .unwrap_or(Map::new(&env));

        if let Some(investment) = investments.get(investor) {
            if env.ledger().timestamp() >= pool_info.maturity_date {
                // Calculate interest: principal * rate * time / 10000 (basis points)
                let interest = (investment.amount * pool_info.interest_rate as i128) / 10000;
                return investment.amount + interest;
            }
        }
        0
    }

    pub fn withdraw(env: Env, investor: Address) -> i128 {
        investor.require_auth();

        let pool_info: PoolInfo = env.storage().instance().get(&POOL_INFO).unwrap();
        
        // Check if maturity date has passed
        if env.ledger().timestamp() < pool_info.maturity_date {
            return 0;
        }

        let mut investments: Map<Address, Investment> = env
            .storage()
            .persistent()
            .get(&INVESTMENTS)
            .unwrap_or(Map::new(&env));

        if let Some(mut investment) = investments.get(investor.clone()) {
            if !investment.is_withdrawn {
                let returns = Self::calculate_returns(env.clone(), investor.clone());
                investment.is_withdrawn = true;
                investment.interest_earned = returns - investment.amount;
                investments.set(investor, investment);
                env.storage().persistent().set(&INVESTMENTS, &investments);
                return returns;
            }
        }
        0
    }

    pub fn get_pool_info(env: Env) -> PoolInfo {
        env.storage().instance().get(&POOL_INFO).unwrap()
    }

    pub fn get_investment(env: Env, investor: Address) -> Option<Investment> {
        let investments: Map<Address, Investment> = env
            .storage()
            .persistent()
            .get(&INVESTMENTS)
            .unwrap_or(Map::new(&env));
        
        investments.get(investor)
    }

    pub fn get_apy(env: Env) -> u32 {
        let pool_info: PoolInfo = env.storage().instance().get(&POOL_INFO).unwrap();
        pool_info.interest_rate
    }
}
