pub mod images;
pub mod query;

use salvo::prelude::*;
use salvo::cors::{self, Cors};
use salvo::hyper::Method;
use salvo::serve_static::StaticDir;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt().init();

    let cors_handler = Cors::new()
        .allow_origin(cors::Any)
        .allow_methods(vec![
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::DELETE,
            Method::OPTIONS,
        ])
        .allow_headers(vec![
            "CONTENT-TYPE",
            "content-type",
            "Access-Control-Request-Method",
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Headers",
            "Access-Control-Max-Age",
            "authorization",
            "Authorization",
        ])
        .into_handler();

    let router = Router::new().hoop(cors_handler)
        .options(handler::empty()).push(Router::with_path("api/v1")
        .push(
            Router::with_path("<**path>")
                .get(
                    StaticDir::new(["data/"])
                    .auto_list(true)
                )
            )
        .push(
            Router::with_path("/upload")
            .post(images::upload)
        ));

    let acceptor = TcpListener::new("0.0.0.0:5800").bind().await;
    Server::new(acceptor).serve(router).await;
}
