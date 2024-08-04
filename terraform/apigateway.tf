resource "aws_api_gateway_rest_api" "invoice_api" {
  name        = "invoice-api"
  description = "API for processing invoices"
}

resource "aws_api_gateway_resource" "invoice_resource" {
  rest_api_id = aws_api_gateway_rest_api.invoice_api.id
  parent_id   = aws_api_gateway_rest_api.invoice_api.root_resource_id
  path_part   = "invoice"
}

resource "aws_api_gateway_method" "invoice_post" {
  rest_api_id   = aws_api_gateway_rest_api.invoice_api.id
  resource_id   = aws_api_gateway_resource.invoice_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "invoice_integration" {
  rest_api_id             = aws_api_gateway_rest_api.invoice_api.id
  resource_id             = aws_api_gateway_resource.invoice_resource.id
  http_method             = aws_api_gateway_method.invoice_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.invoice_processor.invoke_arn
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.invoice_processor.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.invoice_api.execution_arn}/*/POST/invoice"
}
