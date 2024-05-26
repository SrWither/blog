DEFINE SCOPE OAuth2
    SESSION 3d

    SIGNUP (
      INSERT INTO Users
      (email, sub, provider)
      VALUES
      ($email, crypto::argon2::generate($sub), $provider)
    )

    SIGNIN (
      SELECT * FROM Users WHERE
      email = $email
      AND crypto::argon2::compare(sub, $sub)
    )
;