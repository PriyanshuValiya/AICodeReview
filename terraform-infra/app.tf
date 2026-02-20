resource "aws_iam_role" "coderat_ec2_role" {
  name = "coderat-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy" "coderat_ssm_policy" {
  name = "coderat-ssm-policy"
  role = aws_iam_role.coderat_ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "ssm:GetParameter",
        "ssm:GetParameters"
      ]
      Resource = aws_ssm_parameter.coderat_env.arn
    }]
  })
}

resource "aws_iam_instance_profile" "coderat_profile" {
  name = "coderat-instance-profile"
  role = aws_iam_role.coderat_ec2_role.name
}

resource "aws_instance" "app" {
  ami           = "ami-0f5ee92e2d63afc18"
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [
    aws_security_group.coderat_sg.id
  ]

  iam_instance_profile = aws_iam_instance_profile.coderat_profile.name

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  user_data = templatefile("user-data/app.sh", {
    AST_IP = aws_instance.ast.private_ip
  })

  tags = {
    Name = "coderat-app"
  }

  depends_on = [
    aws_ssm_parameter.coderat_env
  ]
}