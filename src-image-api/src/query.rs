use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct SimpleResponse {
    pub message: String
}


#[derive(Serialize, Deserialize, Debug)]
pub struct ErrorMessage {
    pub error: String
}
