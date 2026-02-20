resource "aws_instance" "ast" {
  ami           = "ami-0f5ee92e2d63afc18" 
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.coderat_sg.id]

  user_data = file("user-data/ast.sh")

  tags = {
    Name = "coderat-ast"
  }
}
