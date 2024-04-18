export type FirebaseUser = {
    iss: string
    aud: string
    auth_time: number
    user_id: string
    sub: string
    iat: number
    exp: number
    email: string
    email_verified: boolean
    firebase: Firebase
    uid: string
  }
  
  export type Firebase = {
    identities: Identities
    sign_in_provider: string
  }
  
  export type Identities = {
    email: string[]
  }
  
