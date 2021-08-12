terraform {
  backend "s3" {
    bucket  = "moonpay-tfstate-dya"
    key     = "moonpay/terraform.tfstate"
    region  = "eu-west-1"
    profile = "personal"
  }
}