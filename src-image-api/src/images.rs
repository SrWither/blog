use salvo::{prelude::*, http::form::FilePart};
use std::path::Path;
use uuid::Uuid;
use crate::query::{SimpleResponse, ErrorMessage};

/// Handles copying a file to a destination directory.
///
/// # Arguments
///
/// * `file` - The file to be copied, wrapped in a `FilePart`.
/// * `dest` - The destination directory where the file should be copied.
/// * `filename` - The name of the file.
///
/// # Returns
///
/// Returns a `SimpleResponse` if the file is successfully copied,
/// or an `ErrorMessage` if an error occurs during copying.
fn handle_file_copy(file: &FilePart, dest: String, filename: String) -> Result<SimpleResponse, ErrorMessage> {
    match std::fs::copy(&file.path(), Path::new(&dest)) {
        Ok(_) => Ok(SimpleResponse { message: filename}),
        Err(e) => Err(ErrorMessage { error: e.to_string()}),
    }
}

/// Endpoint handler for file upload.
///
/// This function handles HTTP POST requests to upload a file.
///
/// # Arguments
///
/// * `req` - Mutable reference to the incoming request.
/// * `res` - Mutable reference to the response to be generated.
#[handler]
pub async fn upload(req: &mut Request, res: &mut Response) {
    let file = req.file("file").await;
    if let Some(file) = file {
        let id = Uuid::new_v4();
        let filename = format!("{id}.{}", file.name().unwrap());
        let dest = format!("data/{}", filename);
        match handle_file_copy(file, dest, filename) {
            Ok(msg) => {
                res.status_code(StatusCode::CREATED);
                res.render(Json(msg))
            },
            Err(e) => {
                res.status_code(StatusCode::INTERNAL_SERVER_ERROR);
                res.render(Json(e))
            }
        }
    } else {
        res.status_code(StatusCode::BAD_REQUEST);
        res.render(Json(ErrorMessage{error: String::from("File not found")}));
    };
}
