#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, Map, String, Symbol, Vec,
};

#[derive(Clone)]
#[contracttype]
pub struct Project {
    pub id: u64,
    pub creator: Address,
    pub title: String,
    pub description: String,
    pub funding_goal: i128,
    pub interest_rate: u32, // basis points (e.g., 500 = 5%)
    pub loan_term: u64,     // in seconds
    pub github_url: String,
    pub live_url: String,
    pub scf_status: String,
    pub pool_address: Address,
    pub status: ProjectStatus,
    pub created_at: u64,
    pub total_raised: i128,
}

#[derive(Clone)]
#[contracttype]
pub enum ProjectStatus {
    Draft,
    Active,
    Funded,
    Completed,
    Defaulted,
}

#[derive(Clone)]
#[contracttype]
pub struct PlatformStats {
    pub total_projects: u64,
    pub total_funded: i128,
    pub active_projects: u64,
    pub total_investors: u64,
}

const PROJECTS: Symbol = symbol_short!("PROJECTS");
const PROJECT_COUNT: Symbol = symbol_short!("PROJ_CNT");
const ADMIN: Symbol = symbol_short!("ADMIN");
const STATS: Symbol = symbol_short!("STATS");

#[contract]
pub struct LaunchpadFactory;

#[contractimpl]
impl LaunchpadFactory {
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&PROJECT_COUNT, &0u64);
        
        let initial_stats = PlatformStats {
            total_projects: 0,
            total_funded: 0,
            active_projects: 0,
            total_investors: 0,
        };
        env.storage().instance().set(&STATS, &initial_stats);
    }

    pub fn create_project(
        env: Env,
        creator: Address,
        title: String,
        description: String,
        funding_goal: i128,
        interest_rate: u32,
        loan_term: u64,
        github_url: String,
        live_url: String,
        scf_status: String,
        pool_address: Address,
    ) -> u64 {
        creator.require_auth();

        let project_count: u64 = env.storage().instance().get(&PROJECT_COUNT).unwrap_or(0);
        let project_id = project_count + 1;

        let project = Project {
            id: project_id,
            creator: creator.clone(),
            title,
            description,
            funding_goal,
            interest_rate,
            loan_term,
            github_url,
            live_url,
            scf_status,
            pool_address,
            status: ProjectStatus::Draft,
            created_at: env.ledger().timestamp(),
            total_raised: 0,
        };

        let mut projects: Map<u64, Project> = env
            .storage()
            .persistent()
            .get(&PROJECTS)
            .unwrap_or(Map::new(&env));
        
        projects.set(project_id, project);
        env.storage().persistent().set(&PROJECTS, &projects);
        env.storage().instance().set(&PROJECT_COUNT, &project_id);

        // Update stats
        let mut stats: PlatformStats = env.storage().instance().get(&STATS).unwrap();
        stats.total_projects += 1;
        env.storage().instance().set(&STATS, &stats);

        project_id
    }

    pub fn get_project(env: Env, project_id: u64) -> Option<Project> {
        let projects: Map<u64, Project> = env
            .storage()
            .persistent()
            .get(&PROJECTS)
            .unwrap_or(Map::new(&env));
        
        projects.get(project_id)
    }

    pub fn get_all_projects(env: Env) -> Vec<Project> {
        let projects: Map<u64, Project> = env
            .storage()
            .persistent()
            .get(&PROJECTS)
            .unwrap_or(Map::new(&env));
        
        let mut result = Vec::new(&env);
        let project_count: u64 = env.storage().instance().get(&PROJECT_COUNT).unwrap_or(0);
        
        for i in 1..=project_count {
            if let Some(project) = projects.get(i) {
                result.push_back(project);
            }
        }
        
        result
    }

    pub fn update_project_status(env: Env, project_id: u64, status: ProjectStatus) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();

        let mut projects: Map<u64, Project> = env
            .storage()
            .persistent()
            .get(&PROJECTS)
            .unwrap_or(Map::new(&env));
        
        if let Some(mut project) = projects.get(project_id) {
            project.status = status;
            projects.set(project_id, project);
            env.storage().persistent().set(&PROJECTS, &projects);
        }
    }

    pub fn update_project_funding(env: Env, project_id: u64, amount: i128) {
        let mut projects: Map<u64, Project> = env
            .storage()
            .persistent()
            .get(&PROJECTS)
            .unwrap_or(Map::new(&env));
        
        if let Some(mut project) = projects.get(project_id) {
            project.total_raised += amount;
            projects.set(project_id, project);
            env.storage().persistent().set(&PROJECTS, &projects);

            // Update platform stats
            let mut stats: PlatformStats = env.storage().instance().get(&STATS).unwrap();
            stats.total_funded += amount;
            env.storage().instance().set(&STATS, &stats);
        }
    }

    pub fn get_platform_stats(env: Env) -> PlatformStats {
        env.storage().instance().get(&STATS).unwrap()
    }
}
