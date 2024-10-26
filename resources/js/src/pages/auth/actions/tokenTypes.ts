
export type OauthTokenInputType = {
    grant_type: 'authorization_code'
    client_id: string
    redirect_uri: string
    code_verifier: string
    code: string
  }
  export type OauthTokenResponseType = {
    token_type: string
    expires_in: number
    refresh_token: string
    access_token: string
  }
  
  export type userResponseType = {
    id: string
    name: string
    email: string
  }