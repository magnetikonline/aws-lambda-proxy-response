'use strict';

let CONTENT_TYPE_REGEXP = /^[A-Za-z-]+$/;


class AWSLambdaProxyResponse {

	constructor(statusCode) {

		// default HTTP status to 200/OK if not given
		this.setStatusCode(
			(statusCode === undefined)
				? AWSLambdaProxyResponse.HTTP_STATUS.OK
				: statusCode
		);

		// empty headers and body
		this.headerCollection = {};
		this.body = '';
	}

	setStatusCode(statusCode) {

		// is HTTP code valid?
		let statusCollection = AWSLambdaProxyResponse.HTTP_STATUS,
			isValid = Object.keys(statusCollection).some((statusName) => {

			return (statusCollection[statusName] === statusCode);
		});

		if (!isValid) {
			throw new Error(`Invalid HTTP status code [${statusCode}] given`);
		}

		// all good
		this.statusCode = statusCode;
		return this;
	}

	addHeader(name,value) {

		// assume name contains a header collection
		let addHeaderCollection = name;

		if (value !== undefined) {
			// adding a single header only
			addHeaderCollection = {
				[name]: value
			};
		}

		let headerKeyList = Object.keys(addHeaderCollection);

		// validate all header names
		for (let headerName of headerKeyList) {
			if (!CONTENT_TYPE_REGEXP.test(headerName)) {
				throw new Error(`Invalid HTTP header name of [${headerName}] given`);
				break;
			}
		}

		// with all header names validated, add into response
		for (let headerName of headerKeyList) {
			this.headerCollection[headerName] = addHeaderCollection[headerName].trim();
		}

		return this;
	}

	setBody(body) {

		// if body isn't a string, we use JSON.stringify() to serialize
		this.body = (typeof body == 'string')
			? body
			: JSON.stringify(body);

		return this;
	}

	getPayload() {

		return {
			statusCode: this.statusCode,
			headers: this.headerCollection,
			body: this.body
		};
	}
}

// note: only HTTP status codes of frequent use/lazy
AWSLambdaProxyResponse.HTTP_STATUS = {
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
};

module.exports = AWSLambdaProxyResponse;
