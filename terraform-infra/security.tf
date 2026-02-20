resource "aws_security_group" "coderat_sg" {
  name        = "coderat-sg"
  description = "Coderat main security group"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description      = "HTTP"
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    description      = "HTTPS"
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group_rule" "internal_ast_access" {
  type              = "ingress"
  from_port         = 4000
  to_port           = 4000
  protocol          = "tcp"
  security_group_id = aws_security_group.coderat_sg.id
  source_security_group_id = aws_security_group.coderat_sg.id
  description       = "Allow internal AST traffic within same SG"
}

resource "aws_ssm_parameter" "coderat_env" {
  name  = "/coderat/prod/env"
  type  = "SecureString"

  value = file("${path.module}/../.env")
}
