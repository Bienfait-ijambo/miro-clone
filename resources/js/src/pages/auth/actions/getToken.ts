import { getUserData, setUserData } from "../../../helper/auth"
import { makeHttpReq, makeHttpReq2 } from "../../../helper/makeHttpReq"
import { OauthTokenInputType, OauthTokenResponseType, userResponseType } from "./tokenTypes"

export async function getAccessTokenAndRefreshToken(codeVerifier:string) {
    const userData = getUserData()
  
    try {
      const input: OauthTokenInputType = {
        grant_type: 'authorization_code',
        client_id : '9d53c7f5-6abe-4f17-8f76-96b31815d822',
        redirect_uri : 'http://127.0.0.1:8000/app/callback',
        code_verifier: codeVerifier,
        code: userData?.authorizationCode as string
      }


      const [token, {user}] = await Promise.all([
        makeHttpReq<OauthTokenInputType, OauthTokenResponseType>('oauth/token', 'POST', input),
        makeHttpReq2<
          OauthTokenInputType,
          {
            user: userResponseType
           
          }
        >('user_data', 'POST', input)
      ])
  
        setUserData({
          user: {
            name: user?.name,
            email: user?.email,
            userId: user?.id,
          },
  
    
          token: {
            accessToken: token?.access_token,
            refreshToken: token?.refresh_token
          }
        })
  
        window.location.href = '/app/projects'
    } catch (error) {
      
         console.log((error as Error).message)
      
    }
  }