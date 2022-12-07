import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {logger, metrics, tracer} from "../powertools/utilities";
import {logMetrics, MetricUnits} from "@aws-lambda-powertools/metrics";
import middy from "@middy/core";
import {captureLambdaHandler} from "@aws-lambda-powertools/tracer";
import {injectLambdaContext} from "@aws-lambda-powertools/logger";


const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.appendKeys({
        resource_path: event.requestContext.resourcePath
    });


    const result = "Hello World";
    logger.info("Invoking new Endpoint");
    metrics.addMetric("media received", MetricUnits.Count, 1);

    return {
        statusCode: 200,
        headers: {"content-type": "application/json"},
        body: `{"message":${result}}`,
    }


}

const handler = middy(lambdaHandler)
    .use(captureLambdaHandler(tracer))
    .use(logMetrics(metrics, { captureColdStartMetric: true }))
    .use(injectLambdaContext(logger, { clearState: true }));

export {
    handler
};