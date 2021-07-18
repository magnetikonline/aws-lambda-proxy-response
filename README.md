# AWS Lambda proxy response
A Node.js module which generates response payloads for [API Gateway](https://aws.amazon.com/api-gateway/) fronted [Lambda](https://aws.amazon.com/lambda/) functions integrated via the [Lambda proxy](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#lambda-proxy-integration-with-proxy-resource) method.

[![NPM](https://nodei.co/npm/awslambdaproxyresponse.png?downloads=true)](https://nodei.co/npm/awslambdaproxyresponse/)

The [response structure](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format) takes the following form:

```js
{
	statusCode: httpStatusCode,
	headers: { headerName: 'headerValue' },
	body: '...'
}
```

- [Methods](#methods)
	- [AWSLambdaProxyResponse([statusCode])](#awslambdaproxyresponsestatuscode)
	- [AWSLambdaProxyResponse.setStatusCode(statusCode)](#awslambdaproxyresponsesetstatuscodestatuscode)
	- [AWSLambdaProxyResponse.addHeader(name[,value])](#awslambdaproxyresponseaddheadernamevalue)
	- [AWSLambdaProxyResponse.setBody(body)](#awslambdaproxyresponsesetbodybody)
	- [AWSLambdaProxyResponse.getPayload()](#awslambdaproxyresponsegetpayload)
- [Constants](#constants)
	- [AWSLambdaProxyResponse.HTTP_STATUS](#awslambdaproxyresponsehttp_status)
- [Example usage](#example-usage)
- [Reference](#reference)

## Methods

### AWSLambdaProxyResponse([statusCode])

- Creates new `AWSLambdaProxyResponse` instance.
- Optional `statusCode` sets the [HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for the response, otherwise defaults to `200 / OK`.
- Collection of valid HTTP codes defined at [`AWSLambdaProxyResponse.HTTP_STATUS`](#awslambdaproxyresponsehttp_status).
- Constructor will throw an exception if given `statusCode` is not within this collection.

Example:

```js
const AWSLambdaProxyResponse = require('awslambdaproxyresponse');

const resp = new AWSLambdaProxyResponse(
	AWSLambdaProxyResponse.HTTP_STATUS.FOUND
);
```

### AWSLambdaProxyResponse.setStatusCode(statusCode)

- Sets the HTTP `statusCode` for a response.
- Throws an exception if given `statusCode` is not within the [`AWSLambdaProxyResponse.HTTP_STATUS`](#awslambdaproxyresponsehttp_status) collection.
- Returns `AWSLambdaProxyResponse` instance.

### AWSLambdaProxyResponse.addHeader(name[,value])

- Adds HTTP headers to the Lambda proxy response.
- Single HTTP header can be added by providing a `name` / `value` pair.
- Multiple headers can be added by providing an object collection as `name` only.
- Throws an exception if header names don't match the regular expression pattern `/^[A-Za-z-]+$/`.
- Returns `AWSLambdaProxyResponse` instance.

Example:

```js
const AWSLambdaProxyResponse = require('awslambdaproxyresponse');
const resp = new AWSLambdaProxyResponse();

// lets add a single header
resp.addHeader('Content-Type','text/html');

// add several others
resp.addHeader({
	'x-custom-header': 'value',
	'x-user-auth': 'Donald Duck'
});
```

### AWSLambdaProxyResponse.setBody(body)

- Sets the response body payload.
- If `body` is not of type `string`, will be automatically serialized via `JSON.stringify()`.
- Returns `AWSLambdaProxyResponse` instance.

### AWSLambdaProxyResponse.getPayload()

Returns a valid Lambda proxy response structure object.

## Constants

### AWSLambdaProxyResponse.HTTP_STATUS

A collection of valid HTTP status codes for use with the `AWSLambdaProxyResponse()` constructor or `setStatusCode(statusCode)` method:

```js
const AWSLambdaProxyResponse = require('awslambdaproxyresponse');
console.dir(AWSLambdaProxyResponse.HTTP_STATUS);

/*
{
	OK: 200,
	MOVED: 301,
	FOUND: 302,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
	GATEWAY_TIMEOUT: 504
}
*/
```

## Example usage

Within the context of a Lambda function:

```js
const AWSLambdaProxyResponse = require('awslambdaproxyresponse');

exports.myHandler = (event,context,callback) => {

	// create our response
	const resp = new AWSLambdaProxyResponse();
	resp.setBody('Hello world');

	// return from Lambda
	callback(null,resp.getPayload());

	/*
	console.dir(resp.getPayload());
	{
		statusCode: 200,
		headers: {},
		body: 'Hello world'
	}
	*/
};
```

A Lambda response that results in a redirect:

```js
const AWSLambdaProxyResponse = require('awslambdaproxyresponse');

exports.myHandler = (event,context,callback) => {

	// create our response
	const resp = new AWSLambdaProxyResponse();

	resp.setStatusCode(AWSLambdaProxyResponse.HTTP_STATUS.MOVED);
	resp.addHeader('Location','https://my.new.domain.com/');

	// return from Lambda
	callback(null,resp.getPayload());

	/*
	console.dir(resp.getPayload());
	{
		statusCode: 301,
		headers: { Location: 'https://my.new.domain.com/' },
		body: ''
	}
	*/
};
```

## Reference

- https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
- https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#lambda-proxy-integration-with-proxy-resource
- https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format
