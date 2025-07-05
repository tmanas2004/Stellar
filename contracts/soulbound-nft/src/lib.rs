#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, Map, String, Symbol, Vec,
};

#[derive(Clone)]
#[contracttype]
pub struct NFTMetadata {
    pub token_id: u64,
    pub owner: Address,
    pub name: String,
    pub description: String,
    pub image_url: String,
    pub attributes: String, // JSON string of attributes
    pub achievement_type: AchievementType,
    pub minted_at: u64,
    pub is_soulbound: bool,
}

#[derive(Clone)]
#[contracttype]
pub enum AchievementType {
    Welcome,
    Creator,
    InvestorBronze,  // < 1000 XLM invested
    InvestorSilver,  // 1000-10000 XLM invested
    InvestorGold,    // > 10000 XLM invested
    ProjectFunded,
    EarlySupporter,
}

const NFTS: Symbol = symbol_short!("NFTS");
const TOKEN_COUNT: Symbol = symbol_short!("TOK_CNT");
const USER_NFTS: Symbol = symbol_short!("USER_NFT");
const ADMIN: Symbol = symbol_short!("ADMIN");

#[contract]
pub struct SoulboundNFT;

#[contractimpl]
impl SoulboundNFT {
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&TOKEN_COUNT, &0u64);
    }

    pub fn mint_achievement_nft(
        env: Env,
        to: Address,
        name: String,
        description: String,
        image_url: String,
        attributes: String,
        achievement_type: AchievementType,
    ) -> u64 {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();

        let token_count: u64 = env.storage().instance().get(&TOKEN_COUNT).unwrap_or(0);
        let token_id = token_count + 1;

        let nft = NFTMetadata {
            token_id,
            owner: to.clone(),
            name,
            description,
            image_url,
            attributes,
            achievement_type,
            minted_at: env.ledger().timestamp(),
            is_soulbound: true,
        };

        // Store NFT metadata
        let mut nfts: Map<u64, NFTMetadata> = env
            .storage()
            .persistent()
            .get(&NFTS)
            .unwrap_or(Map::new(&env));
        nfts.set(token_id, nft);
        env.storage().persistent().set(&NFTS, &nfts);

        // Update user's NFT list
        let mut user_nfts: Map<Address, Vec<u64>> = env
            .storage()
            .persistent()
            .get(&USER_NFTS)
            .unwrap_or(Map::new(&env));
        
        let mut user_tokens = user_nfts.get(to.clone()).unwrap_or(Vec::new(&env));
        user_tokens.push_back(token_id);
        user_nfts.set(to, user_tokens);
        env.storage().persistent().set(&USER_NFTS, &user_nfts);

        env.storage().instance().set(&TOKEN_COUNT, &token_id);

        token_id
    }

    pub fn get_nft(env: Env, token_id: u64) -> Option<NFTMetadata> {
        let nfts: Map<u64, NFTMetadata> = env
            .storage()
            .persistent()
            .get(&NFTS)
            .unwrap_or(Map::new(&env));
        
        nfts.get(token_id)
    }

    pub fn get_user_nfts(env: Env, user: Address) -> Vec<NFTMetadata> {
        let user_nfts: Map<Address, Vec<u64>> = env
            .storage()
            .persistent()
            .get(&USER_NFTS)
            .unwrap_or(Map::new(&env));
        
        let nfts: Map<u64, NFTMetadata> = env
            .storage()
            .persistent()
            .get(&NFTS)
            .unwrap_or(Map::new(&env));

        let mut result = Vec::new(&env);
        
        if let Some(token_ids) = user_nfts.get(user) {
            for i in 0..token_ids.len() {
                if let Some(token_id) = token_ids.get(i) {
                    if let Some(nft) = nfts.get(token_id) {
                        result.push_back(nft);
                    }
                }
            }
        }
        
        result
    }

    pub fn has_achievement(env: Env, user: Address, achievement_type: AchievementType) -> bool {
        let user_nfts = Self::get_user_nfts(env, user);
        
        for i in 0..user_nfts.len() {
            if let Some(nft) = user_nfts.get(i) {
                match (&nft.achievement_type, &achievement_type) {
                    (AchievementType::Welcome, AchievementType::Welcome) => return true,
                    (AchievementType::Creator, AchievementType::Creator) => return true,
                    (AchievementType::InvestorBronze, AchievementType::InvestorBronze) => return true,
                    (AchievementType::InvestorSilver, AchievementType::InvestorSilver) => return true,
                    (AchievementType::InvestorGold, AchievementType::InvestorGold) => return true,
                    (AchievementType::ProjectFunded, AchievementType::ProjectFunded) => return true,
                    (AchievementType::EarlySupporter, AchievementType::EarlySupporter) => return true,
                    _ => continue,
                }
            }
        }
        
        false
    }

    pub fn get_total_supply(env: Env) -> u64 {
        env.storage().instance().get(&TOKEN_COUNT).unwrap_or(0)
    }

    // Soulbound NFTs cannot be transferred
    pub fn transfer(_env: Env, _from: Address, _to: Address, _token_id: u64) -> bool {
        false // Always return false for soulbound tokens
    }
}
