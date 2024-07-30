# Declare the Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "Access identity for my S3 bucket"
}

# Declare the API Gateway
resource "aws_api_gateway_rest_api" "example" {
  name        = "example-api"
  description = "Example API for CloudFront"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.website_bucket.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.website_bucket.id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = "${aws_api_gateway_rest_api.example.execution_arn}.execute-api.${var.region}.amazonaws.com"
    origin_id   = "APIGateway-${aws_api_gateway_rest_api.example.id}"

    custom_origin_config {
      origin_protocol_policy = "https-only"
      http_port              = 80
      https_port             = 443
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CDN for Task Management App"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.website_bucket.id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
      headers = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 450
    max_ttl                = 10800
  }

  ordered_cache_behavior {
    path_pattern           = "/prod/task*"
    allowed_methods        = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "APIGateway-${aws_api_gateway_rest_api.example.id}"
    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
      headers = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}
