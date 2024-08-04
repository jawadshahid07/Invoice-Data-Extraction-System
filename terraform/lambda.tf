data "archive_file" "lambda_functions_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda_function"
  output_path = "${path.module}/lambda_function.zip"
}

resource "aws_s3_bucket" "lambda_deployments" {
  bucket = "my-lambda-deployments-2024-jawad"
}

resource "aws_s3_object" "lambda_zip" {
  bucket = aws_s3_bucket.lambda_deployments.bucket
  key    = "lambda_function.zip"
  source = "lambda_function.zip"
}

resource "aws_iam_role_policy_attachment" "lambda_s3_access" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
  role      = "arn:aws:iam::637423471197:role/lambda_exec_role"
}

resource "aws_lambda_function" "invoice_processor" {
  function_name    = "invoice_processor"
  role             = "arn:aws:iam::637423471197:role/lambda_exec_role"
  handler          = "lambda_function.lambda_handler"
  runtime          = "python3.8"
  s3_bucket        = aws_s3_bucket.lambda_deployments.bucket
  s3_key           = "lambda_function.zip"
}
