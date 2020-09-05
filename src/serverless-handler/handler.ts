import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda'
import { ProfileController } from '../services/profile/profileController';

let response: ProxyResult

const ALLOWED_ORIGINS = [
    'https://lazypandatech.com',
    'https://api.lazypandatech.com',
	'http://localhost:4500'
];


export const getHeaders = (event: APIGatewayEvent) => {
    const origin = event.headers.origin;
    let headers;
    if (ALLOWED_ORIGINS.includes(origin)) {
        headers = {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Api-Key',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,PATCH,OPTIONS'
        }
    }

    return headers;
}

export const profileRoute = async (event: APIGatewayEvent, context: Context): Promise<ProxyResult> => {
    const origin = event.headers.origin;
    try {
        const profileController = new ProfileController(event);
        const result = await profileController.getUserProfile();
        response = {
            statusCode: 200,
            headers: getHeaders(event),
            body: JSON.stringify(result)
        }
    } catch (err) {
        console.log(err)
        return err
    }

    return response;
};