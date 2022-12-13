import {S3Store} from "../store/s3/s3-store";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {logger, metrics, tracer} from "../powertools/utilities";
import middy from "@middy/core";
import {captureLambdaHandler} from "@aws-lambda-powertools/tracer";
import {logMetrics, MetricUnits} from "@aws-lambda-powertools/metrics";
import {injectLambdaContext} from "@aws-lambda-powertools/logger";


const s3Store: S3Store = new S3Store();
const lambdaHandler = async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.appendKeys({
        resource_path: event.requestContext.resourcePath
    });

    return {
        statusCode: 201,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "We made it here" }),
    };


    //parse the incoming request
    // console.log(event.body);

    try {
        // await s3Store.putMedia(media);
        // metrics.addMetric('mediaStored', MetricUnits.Count, 1);
        // metrics.addMetadata('mediaId', id);

        return {
            statusCode: 201,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ message: "Media Stored" }),
        };
    } catch (error) {
        logger.error("Unexpected error occured while trying to store media", error);

        return {
            statusCode: 500,
            headers: { "content-type": "application/json" },
            body: JSON.stringify(error),
        };
    }
}

const handler = middy(lambdaHandler)
    .use(captureLambdaHandler(tracer))
    .use(logMetrics(metrics, { captureColdStartMetric: true }))
    .use(injectLambdaContext(logger, { clearState: true }));

export {
    handler
};