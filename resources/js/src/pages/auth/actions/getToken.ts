import { getUserData, setUserData } from "../../../helper/auth";
import { makeHttpReq, makeHttpReq2 } from "../../../helper/makeHttpReq";
import { showError } from "../../../helper/toastnotification";
import {
    OauthTokenInputType,
    OauthTokenResponseType,
    userResponseType,
} from "./tokenTypes";

export async function getAccessTokenAndRefreshToken(
    codeVerifier: string,
    userId: string
) {
    const userData = getUserData();

    try {
        const input: OauthTokenInputType = {
            grant_type: "authorization_code",
            client_id: "9d69c34f-da8d-4930-a760-cb24235ee151",
            redirect_uri: "http://127.0.0.1:8000/app/callback",
            code_verifier: codeVerifier,
            code: userData?.authorizationCode as string,
        };
        //request access an refresh token
        const token = await makeHttpReq<
            OauthTokenInputType,
            OauthTokenResponseType
        >("oauth/token", "POST", input);
        const tokenProps = {
            accessToken: token?.access_token,
            refreshToken: token?.refresh_token,
        };
        setUserData({
            token: {
                ...tokenProps,
            },
        });

        //end request for the access and refresh token

        //requesting for the user data
        const { user } = await makeHttpReq2<
            { client_id: string; user_id: string },
            {
                user: userResponseType;
            }
        >("user_data", "POST", {
            client_id: input.client_id,
            user_id: userId,
        });

        setUserData({
            user: {
                name: user?.name,
                email: user?.email,
                userId: user?.id,
            },
            token: {
                ...tokenProps,
            },
        });

        window.location.href = "/app/projects";
        //end request for the user data
    } catch (error) {
        showError((error as Error).message);
    }
}
