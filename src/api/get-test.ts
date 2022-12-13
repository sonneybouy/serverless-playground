import {APIGatewayProxyResult} from "aws-lambda";
import middy from "@middy/core";
import {captureLambdaHandler} from "@aws-lambda-powertools/tracer";
import {logger, metrics, tracer} from "../powertools/utilities";
import {logMetrics} from "@aws-lambda-powertools/metrics";
import {injectLambdaContext} from "@aws-lambda-powertools/logger";


const lambdaHandler = async(): Promise<APIGatewayProxyResult> => {

    return {
        statusCode: 201,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "Hello New World" }),
    };
}


const handler = middy(lambdaHandler)
    .use(captureLambdaHandler(tracer))
    .use(logMetrics(metrics, { captureColdStartMetric: true }))
    .use(injectLambdaContext(logger, { clearState: true }));

export {
    handler
};